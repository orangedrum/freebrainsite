const RECORDING_MIME_TYPES = [
  "video/mp4",
  "video/webm;codecs=vp8",
  "video/webm",
];

export type RecordingSupportError =
  | "recordingInsecureContext"
  | "recordingCameraUnavailable"
  | "recordingCanvasUnavailable"
  | "recordingRecorderUnavailable"
  | "recordingFormatUnavailable";

export interface RecordingSupport {
  mimeType: string | null;
  error: RecordingSupportError | null;
}

export const getRecordingCanvasDimensions = (): {
  width: number;
  height: number;
} => ({ width: 540, height: 960 });

export const selectRecordingMimeType = (
  isTypeSupported: (mimeType: string) => boolean,
): string | null => RECORDING_MIME_TYPES.find(isTypeSupported) ?? null;

export const getRecordingSupport = (): RecordingSupport => {
  if (!window.isSecureContext) {
    return { mimeType: null, error: "recordingInsecureContext" };
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return { mimeType: null, error: "recordingCameraUnavailable" };
  }

  if (typeof HTMLCanvasElement.prototype.captureStream !== "function") {
    return { mimeType: null, error: "recordingCanvasUnavailable" };
  }

  if (typeof MediaRecorder === "undefined") {
    return { mimeType: null, error: "recordingRecorderUnavailable" };
  }

  if (typeof MediaRecorder.isTypeSupported !== "function") {
    return { mimeType: null, error: "recordingFormatUnavailable" };
  }

  const mimeType = selectRecordingMimeType(MediaRecorder.isTypeSupported);
  return mimeType
    ? { mimeType, error: null }
    : { mimeType: null, error: "recordingFormatUnavailable" };
};
