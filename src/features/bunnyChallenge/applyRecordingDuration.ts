import fixWebmDuration from "fix-webm-duration";
import { fixMp4Duration } from "./fixMp4Duration";

/**
 * Neither container `MediaRecorder` emits carries a duration a player can
 * trust: WebM has no `Duration` element at all, and MP4 is written fragmented
 * with `mvhd` at 0 plus the *first fragment's* value in `tkhd`/`mdhd`. Players
 * that read those headers instead of scanning the `moof` fragments therefore
 * play only the opening seconds of a long take — a 90s challenge downloads as
 * "about 5 seconds".
 *
 * Stamps the duration we measured (`recorder.start()` → `onstop`) into whichever
 * container we ended up with. Always resolves to a playable blob: a recording is
 * never worth less than a perfect duration label.
 */
export const applyRecordingDuration = async (
  blob: Blob,
  mimeType: string | null,
  durationMs: number,
): Promise<Blob> => {
  if (!(durationMs > 0) || !mimeType) return blob;

  try {
    const fixed = mimeType.includes("webm")
      ? await fixWebmDuration(blob, durationMs, { logger: false })
      : await fixMp4Duration(blob, durationMs);
    // `fixWebmDuration` resolves to `false` when it cannot patch the file, so
    // only swap in a result that really is a fuller blob.
    return fixed && fixed.size >= blob.size ? fixed : blob;
  } catch {
    return blob;
  }
};
