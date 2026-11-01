import { describe, expect, it, vi } from "vitest";
import {
  getRecordingCanvasDimensions,
  selectRecordingMimeType,
} from "./recordingSupport";

describe("getRecordingCanvasDimensions", () => {
  it("always returns portrait dimensions", () => {
    const dimensions = getRecordingCanvasDimensions();
    expect(dimensions.height).toBeGreaterThan(dimensions.width);
    expect(dimensions).toEqual({ width: 540, height: 960 });
  });
});

describe("selectRecordingMimeType", () => {
  it("uses the first format supported by the browser", () => {
    const isTypeSupported = vi.fn((mimeType: string) => mimeType === "video/webm");

    expect(selectRecordingMimeType(isTypeSupported)).toBe("video/webm");
    expect(isTypeSupported.mock.calls.map(([mimeType]) => mimeType)).toEqual([
      "video/mp4",
      "video/webm;codecs=vp8",
      "video/webm",
    ]);
  });

  it("returns no format when the browser supports none of the candidates", () => {
    expect(selectRecordingMimeType(() => false)).toBeNull();
  });
});
