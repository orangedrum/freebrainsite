import { describe, expect, it, vi } from "vitest";
import { selectRecordingMimeType } from "./recordingSupport";

describe("selectRecordingMimeType", () => {
  it("uses the first format supported by the browser", () => {
    const isTypeSupported = vi.fn((mimeType: string) => mimeType === "video/webm");

    expect(selectRecordingMimeType(isTypeSupported)).toBe("video/webm");
    expect(isTypeSupported).toHaveBeenCalledWith("video/mp4");
    expect(isTypeSupported).toHaveBeenCalledWith("video/webm;codecs=vp8");
    expect(isTypeSupported).toHaveBeenCalledWith("video/webm");
  });

  it("returns no format when the browser supports none of the candidates", () => {
    expect(selectRecordingMimeType(() => false)).toBeNull();
  });
});
