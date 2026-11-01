import { describe, expect, it } from "vitest";
import { getRecordingError } from "./recordingHelpers";

describe("getRecordingError", () => {
  it("distinguishes permission, missing-camera, and busy-camera failures", () => {
    expect(getRecordingError(new DOMException("Denied", "NotAllowedError"))).toBe(
      "recordingPermissionDenied",
    );
    expect(getRecordingError(new DOMException("No camera", "NotFoundError"))).toBe(
      "recordingCameraNotFound",
    );
    expect(getRecordingError(new DOMException("Busy", "NotReadableError"))).toBe(
      "recordingCameraBusy",
    );
  });

  it("reports other startup failures explicitly", () => {
    expect(getRecordingError(new Error("Canvas failure"))).toBe("recordingFailed");
  });
});
