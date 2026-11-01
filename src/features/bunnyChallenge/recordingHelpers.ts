import type { RecordingSupportError } from "./recordingSupport";

export type RecordingStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "ready"
  | "error";

export type RecordingError =
  | RecordingSupportError
  | "recordingPermissionDenied"
  | "recordingCameraNotFound"
  | "recordingCameraBusy"
  | "recordingInterrupted"
  | "recordingFailed";

export const getRecordingError = (error: unknown): RecordingError => {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "recordingPermissionDenied";
    }
    if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return "recordingCameraNotFound";
    }
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return "recordingCameraBusy";
    }
  }
  return "recordingFailed";
};

export const loadRecordingImage = (
  source: string,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load recording image: ${source}`));
    image.src = source;
  });
