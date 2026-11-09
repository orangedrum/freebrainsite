/**
 * `MediaRecorder` writes MP4 as *fragmented* MP4: the `moov` box is emitted
 * before a single frame exists, so it ships with `mvhd` at 0 and only the first
 * fragment's duration stamped into `tkhd`/`mdhd` — while the real sample table
 * (`stts`/`stsz`/`stco`) stays empty and the media lives in trailing `moof`
 * boxes. Players that trust those headers instead of scanning the fragments
 * therefore report (and play) only the opening fragment of a long take, which
 * is how a 90s challenge downloads as "a few seconds".
 *
 * This is the MP4 twin of `fix-webm-duration`: it writes the duration we
 * already measured (`durationMs`, from `recorder.start()` to `onstop`) into
 * every duration header, converting through each box's own timescale.
 */

/** `Blob` only accepts `ArrayBuffer`-backed views, not `SharedArrayBuffer`. */
type Bytes = Uint8Array<ArrayBuffer>;

interface Box {
  type: string;
  /** Byte offset of the box payload, just past its (possibly 64-bit) header. */
  payload: number;
  /** Byte offset just past the end of the box. */
  end: number;
}

interface DurationLayout {
  /** Offset of the duration field relative to the payload start. */
  durationOffset: number;
  size: 4 | 8;
  /** False when the box borrows the movie timescale (`tkhd`). */
  usesOwnTimescale: boolean;
}

const HEADER_SIZE = 8;

/** Reads the direct children of a box range, bailing out on malformed sizes. */
const readBoxes = (bytes: Bytes, start: number, end: number): Box[] => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const boxes: Box[] = [];
  let offset = start;

  while (offset + HEADER_SIZE <= end) {
    let size = view.getUint32(offset);
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7],
    );
    let headerSize = HEADER_SIZE;

    if (size === 1) {
      const largeSize = view.getBigUint64(offset + HEADER_SIZE);
      if (largeSize > BigInt(Number.MAX_SAFE_INTEGER)) break;
      size = Number(largeSize);
      headerSize = HEADER_SIZE + 8;
    } else if (size === 0) {
      size = end - offset;
    }

    if (size < headerSize || offset + size > end) break;
    boxes.push({ type, payload: offset + headerSize, end: offset + size });
    offset += size;
  }

  return boxes;
};

/** `mvhd`/`mdhd` carry their own timescale right before the duration field. */
const readTimescale = (bytes: Bytes, payload: number, version: number): number =>
  new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength,
  ).getUint32(payload + (version === 1 ? 20 : 12));

const getDurationLayout = (type: string, version: number): DurationLayout | null => {
  if (type === "mvhd" || type === "mdhd") {
    return version === 1
      ? { durationOffset: 24, size: 8, usesOwnTimescale: true }
      : { durationOffset: 16, size: 4, usesOwnTimescale: true };
  }
  if (type === "tkhd") {
    return version === 1
      ? { durationOffset: 28, size: 8, usesOwnTimescale: false }
      : { durationOffset: 20, size: 4, usesOwnTimescale: false };
  }
  return null;
};

const writeUintBE = (bytes: Bytes, offset: number, value: number, size: 4 | 8): void => {
  const limit = size === 4 ? 0xffff_ffff : 0x1_0000_0000_0000_0000;
  const clamped = Math.max(0, Math.min(Math.round(value), limit));
  const parts =
    size === 4 ? [clamped] : [Math.floor(clamped / 0x1_0000_0000), clamped % 0x1_0000_0000];

  parts.forEach((part, index) => {
    let remaining = part;
    for (let byte = 3; byte >= 0; byte -= 1) {
      bytes[offset + index * 4 + byte] = remaining % 256;
      remaining = Math.floor(remaining / 256);
    }
  });
};

/** Stamps `durationMs` into `mvhd`, every `tkhd`, and every `mdhd`, in place. */
export const patchMp4Duration = (bytes: Bytes, durationMs: number): Bytes => {
  if (!bytes.length || !(durationMs > 0)) return bytes;

  const moov = readBoxes(bytes, 0, bytes.length).find((box) => box.type === "moov");
  if (!moov) return bytes;

  const children = readBoxes(bytes, moov.payload, moov.end);
  const mvhd = children.find((box) => box.type === "mvhd");
  if (!mvhd) return bytes;

  const movieTimescale = readTimescale(bytes, mvhd.payload, bytes[mvhd.payload]);
  if (!(movieTimescale > 0)) return bytes;

  const targets: Box[] = [];
  for (const child of children) {
    if (child.type === "mvhd") targets.push(child);
    if (child.type !== "trak") continue;

    const trakChildren = readBoxes(bytes, child.payload, child.end);
    const tkhd = trakChildren.find((box) => box.type === "tkhd");
    if (tkhd) targets.push(tkhd);

    const mdia = trakChildren.find((box) => box.type === "mdia");
    const mdhd = mdia && readBoxes(bytes, mdia.payload, mdia.end).find((box) => box.type === "mdhd");
    if (mdhd) targets.push(mdhd);
  }

  for (const box of targets) {
    const version = bytes[box.payload];
    const layout = getDurationLayout(box.type, version);
    if (!layout) continue;

    const timescale = layout.usesOwnTimescale
      ? readTimescale(bytes, box.payload, version)
      : movieTimescale;
    if (!(timescale > 0)) continue;

    const fieldOffset = box.payload + layout.durationOffset;
    if (fieldOffset + layout.size > box.end) continue;

    writeUintBE(bytes, fieldOffset, (durationMs / 1000) * timescale, layout.size);
  }

  return bytes;
};

/** Reads a blob's bytes in both modern browsers and older/JS DOM environments. */
const readBlobBytes = async (blob: Blob): Promise<Bytes> => {
  if (typeof blob.arrayBuffer === "function") return new Uint8Array(await blob.arrayBuffer());

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the recording"));
    reader.readAsArrayBuffer(blob);
  });
};

/** Blob-shaped wrapper so recording code can await it like `fixWebmDuration`. */
export const fixMp4Duration = async (blob: Blob, durationMs: number): Promise<Blob> => {
  if (!blob.size || !blob.type.includes("mp4")) return blob;

  const patched = patchMp4Duration(await readBlobBytes(blob), durationMs);
  return new Blob([patched], { type: blob.type });
};
