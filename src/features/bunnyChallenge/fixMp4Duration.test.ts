import { describe, expect, it } from "vitest";
import { fixMp4Duration, patchMp4Duration } from "./fixMp4Duration";

type Bytes = Uint8Array<ArrayBuffer>;

/** jsdom's Blob predates `arrayBuffer()`, so read it the portable way. */
const blobBytes = (blob: Blob): Promise<Bytes> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsArrayBuffer(blob);
  });

const concat = (...parts: Bytes[]): Bytes => {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
};

const box = (type: string, payload: Bytes): Bytes => {
  const out = new Uint8Array(8 + payload.length);
  new DataView(out.buffer).setUint32(0, out.length);
  for (let i = 0; i < 4; i += 1) out[4 + i] = type.charCodeAt(i);
  out.set(payload, 8);
  return out;
};

const container = (type: string, children: Bytes[]): Bytes => box(type, concat(...children));

/** Version-0 `mvhd`/`mdhd`: timescale at +12, duration at +16. */
const timeHeaderV0 = (type: string, timescale: number, duration: number): Bytes => {
  const payload = new Uint8Array(100);
  const view = new DataView(payload.buffer);
  view.setUint32(12, timescale);
  view.setUint32(16, duration);
  return box(type, payload);
};

/** Version-0 `tkhd`: duration at +20, on the *movie* timescale. */
const trackHeaderV0 = (duration: number): Bytes => {
  const payload = new Uint8Array(84);
  new DataView(payload.buffer).setUint32(20, duration);
  return box("tkhd", payload);
};

/** Version-1 headers widen creation/modification/duration to 64 bits. */
const timeHeaderV1 = (type: string, timescale: number, duration: number): Bytes => {
  const payload = new Uint8Array(108);
  const view = new DataView(payload.buffer);
  payload[0] = 1;
  view.setUint32(20, timescale);
  view.setBigUint64(24, BigInt(duration));
  return box(type, payload);
};

const trackHeaderV1 = (duration: number): Bytes => {
  const payload = new Uint8Array(96);
  const view = new DataView(payload.buffer);
  payload[0] = 1;
  view.setBigUint64(28, BigInt(duration));
  return box("tkhd", payload);
};

/** Independent re-read of the fixture, so the test does not trust the patcher. */
const readBoxes = (bytes: Bytes, start = 0, end = bytes.length) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const found: Array<{ type: string; payload: number; end: number }> = [];
  let offset = start;
  while (offset + 8 <= end) {
    const size = view.getUint32(offset);
    if (size < 8 || offset + size > end) break;
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
    found.push({ type, payload: offset + 8, end: offset + size });
    offset += size;
  }
  return found;
};

const findBox = (bytes: Bytes, type: string) => {
  const queue = readBoxes(bytes);
  while (queue.length) {
    const current = queue.shift()!;
    if (current.type === type) return current;
    if (["moov", "trak", "mdia", "minf"].includes(current.type)) {
      queue.push(...readBoxes(bytes, current.payload, current.end));
    }
  }
  return null;
};

const readDuration = (bytes: Bytes, type: string): number => {
  const target = findBox(bytes, type);
  if (!target) throw new Error(`missing ${type}`);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = bytes[target.payload];
  const offset = target.payload + (version === 1 ? (type === "tkhd" ? 28 : 24) : type === "tkhd" ? 20 : 16);
  return version === 1 ? Number(view.getBigUint64(offset)) : view.getUint32(offset);
};

const readTimescale = (bytes: Bytes, type: string): number => {
  const target = findBox(bytes, type);
  if (!target) throw new Error(`missing ${type}`);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(target.payload + (bytes[target.payload] === 1 ? 20 : 12));
};

/** The shape `MediaRecorder` actually ships: 0s and first-fragment stubs. */
const buildMp4 = (version: 0 | 1): Bytes =>
  container("moov", [
    version === 1 ? timeHeaderV1("mvhd", 1000, 0) : timeHeaderV0("mvhd", 1000, 0),
    container("trak", [
      version === 1 ? trackHeaderV1(1722) : trackHeaderV0(1722),
      container("mdia", [
        version === 1 ? timeHeaderV1("mdhd", 30_000, 1722) : timeHeaderV0("mdhd", 30_000, 1722),
        container("minf", [box("vmhd", new Uint8Array(12))]),
      ]),
    ]),
    container("mvex", [box("trex", new Uint8Array(24))]),
  ]);

describe("patchMp4Duration", () => {
  it("stamps the whole take into mvhd, tkhd and mdhd (version 0)", () => {
    const bytes = buildMp4(0);
    // The stub a 27.83s recording ships with: mvhd 0, track/media at 1.722s.
    expect(readDuration(bytes, "mvhd")).toBe(0);
    expect(readDuration(bytes, "tkhd")).toBe(1722);
    expect(readDuration(bytes, "mdhd")).toBe(1722);

    patchMp4Duration(bytes, 27_832);

    expect(readDuration(bytes, "mvhd")).toBe(27_832);
    expect(readDuration(bytes, "tkhd")).toBe(27_832);
    // Media timescale differs, so the same wall-clock time must be rescaled.
    expect(readDuration(bytes, "mdhd")).toBe(834_960);
    expect(readTimescale(bytes, "mvhd")).toBe(1000);
    expect(readTimescale(bytes, "mdhd")).toBe(30_000);
  });

  it("writes the widened 64-bit fields of version-1 headers", () => {
    const bytes = buildMp4(1);
    expect(readDuration(bytes, "mvhd")).toBe(0);

    patchMp4Duration(bytes, 90_000);

    expect(readDuration(bytes, "mvhd")).toBe(90_000);
    expect(readDuration(bytes, "tkhd")).toBe(90_000);
    expect(readDuration(bytes, "mdhd")).toBe(2_700_000);
  });

  it("covers every track in a multi-track movie", () => {
    const bytes = container("moov", [
      timeHeaderV0("mvhd", 1000, 0),
      container("trak", [trackHeaderV0(0), container("mdia", [timeHeaderV0("mdhd", 60_000, 0)])]),
      container("trak", [trackHeaderV0(0), container("mdia", [timeHeaderV0("mdhd", 90_000, 0)])]),
    ]);

    patchMp4Duration(bytes, 10_000);

    const moov = readBoxes(bytes)[0];
    const trackDurations = readBoxes(bytes, moov.payload, moov.end)
      .filter((entry) => entry.type === "trak")
      .map((trak) => {
        const tkhd = readBoxes(bytes, trak.payload, trak.end).find((b) => b.type === "tkhd")!;
        return new DataView(bytes.buffer, bytes.byteOffset).getUint32(tkhd.payload + 20);
      });
    expect(trackDurations).toEqual([10_000, 10_000]);
    expect(readDuration(bytes, "mdhd")).toBe(600_000);
  });

  it("is a no-op without a duration, a movie, or a usable timescale", () => {
    const noDuration = buildMp4(0);
    const untouched = noDuration.slice();
    patchMp4Duration(noDuration, 0);
    expect(noDuration).toEqual(untouched);

    const bare = box("mdat", new Uint8Array(16));
    patchMp4Duration(bare, 5_000);
    expect(bare).toEqual(box("mdat", new Uint8Array(16)));

    const badTimescale = container("moov", [timeHeaderV0("mvhd", 0, 0)]);
    const before = badTimescale.slice();
    patchMp4Duration(badTimescale, 5_000);
    expect(badTimescale).toEqual(before);
  });

  it("leaves the sample table alone so the fragments stay playable", () => {
    const bytes = buildMp4(0);
    const sizeBefore = bytes.length;
    patchMp4Duration(bytes, 45_000);
    expect(bytes.length).toBe(sizeBefore);
  });
});

describe("fixMp4Duration", () => {
  it("round-trips through a blob and keeps the container type", async () => {
    const blob = new Blob([buildMp4(0)], { type: "video/mp4;codecs=avc1" });
    const fixed = await fixMp4Duration(blob, 30_000);

    expect(fixed.type).toBe("video/mp4;codecs=avc1");
    const bytes = await blobBytes(fixed);
    expect(readDuration(bytes, "mvhd")).toBe(30_000);
    expect(readDuration(bytes, "mdhd")).toBe(900_000);
  });

  it("hands non-MP4 recordings back untouched for the WebM fixer to own", async () => {
    const blob = new Blob([new Uint8Array(32)], { type: "video/webm;codecs=vp8" });
    expect(await fixMp4Duration(blob, 30_000)).toBe(blob);
  });

  it("ignores an empty blob", async () => {
    const blob = new Blob([], { type: "video/mp4" });
    expect(await fixMp4Duration(blob, 30_000)).toBe(blob);
  });
});
