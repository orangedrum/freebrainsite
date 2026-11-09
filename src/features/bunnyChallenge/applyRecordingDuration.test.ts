import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyRecordingDuration } from "./applyRecordingDuration";

const { fixWebmDuration } = vi.hoisted(() => ({ fixWebmDuration: vi.fn() }));

vi.mock("fix-webm-duration", () => ({
  default: (...args: unknown[]) => fixWebmDuration(...args),
}));

const box = (type: string, payload: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> => {
  const out = new Uint8Array(8 + payload.length);
  new DataView(out.buffer).setUint32(0, out.length);
  for (let i = 0; i < 4; i += 1) out[4 + i] = type.charCodeAt(i);
  out.set(payload, 8);
  return out;
};

/** Minimal fragmented MP4: `moov` first with a zeroed `mvhd`, like MediaRecorder. */
const buildMp4 = (): Uint8Array<ArrayBuffer> => {
  const mvhd = new Uint8Array(100);
  new DataView(mvhd.buffer).setUint32(12, 1000); // timescale; duration stays 0
  return box("moov", box("mvhd", mvhd));
};

/** moov header (8) + mvhd header (8) + mvhd duration field (16). */
const readMvhdDuration = (bytes: Uint8Array<ArrayBuffer>): number =>
  new DataView(bytes.buffer, bytes.byteOffset).getUint32(8 + 8 + 16);

const bytesOf = (blob: Blob): Promise<Uint8Array<ArrayBuffer>> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });

beforeEach(() => {
  fixWebmDuration.mockReset();
});

describe("applyRecordingDuration", () => {
  it("stamps the full take into an MP4, the container Chrome actually picks", async () => {
    const raw = new Blob([buildMp4()], { type: "video/mp4;codecs=vp9" });
    expect(readMvhdDuration(await bytesOf(raw))).toBe(0);

    const fixed = await applyRecordingDuration(raw, "video/mp4;codecs=vp9", 5_011);

    expect(readMvhdDuration(await bytesOf(fixed))).toBe(5_011);
    // MP4 must never be routed to the WebM fixer — that guard is what broke.
    expect(fixWebmDuration).not.toHaveBeenCalled();
  });

  it("hands WebM to the WebM fixer", async () => {
    const raw = new Blob([new Uint8Array(64)], { type: "video/webm;codecs=vp8" });
    const patched = new Blob([new Uint8Array(70)], { type: "video/webm;codecs=vp8" });
    fixWebmDuration.mockResolvedValue(patched);

    const fixed = await applyRecordingDuration(raw, "video/webm;codecs=vp8", 12_000);

    expect(fixWebmDuration).toHaveBeenCalledWith(raw, 12_000, { logger: false });
    expect(fixed).toBe(patched);
  });

  it("keeps the original when the WebM fixer answers false", async () => {
    const raw = new Blob([new Uint8Array(64)], { type: "video/webm" });
    fixWebmDuration.mockResolvedValue(false as unknown as Blob);

    expect(await applyRecordingDuration(raw, "video/webm", 12_000)).toBe(raw);
  });

  it("keeps the recording when patching throws", async () => {
    const raw = new Blob([buildMp4()], { type: "video/webm" });
    fixWebmDuration.mockRejectedValue(new Error("boom"));

    expect(await applyRecordingDuration(raw, "video/webm", 12_000)).toBe(raw);
  });

  it("does nothing without a measured duration or a mime type", async () => {
    const raw = new Blob([buildMp4()], { type: "video/mp4" });

    expect(await applyRecordingDuration(raw, "video/mp4", 0)).toBe(raw);
    expect(await applyRecordingDuration(raw, null, 5_000)).toBe(raw);
  });
});
