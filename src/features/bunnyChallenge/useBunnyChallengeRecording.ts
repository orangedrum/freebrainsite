import { useCallback, useEffect, useRef, useState } from "react";
import {
  drawBunnyChallengeVideoFrame,
  type BunnyChallengeRecordingScene,
} from "./bunnyChallengeVideoCanvas";
import {
  getRecordingSupport,
  type RecordingSupportError,
} from "./recordingSupport";

type RecordingStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "ready"
  | "error";

type RecordingError =
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

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load recording image: ${source}`));
    image.src = source;
  });

export const useBunnyChallengeRecording = (
  scene: BunnyChallengeRecordingScene,
) => {
  const [isRecordingSelected, setIsRecordingSelected] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<RecordingError | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const sceneRef = useRef(scene);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoUrlRef = useRef<string | null>(null);
  const hasRecordingErrorRef = useRef(false);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(true);

  const support = getRecordingSupport();

  const releaseStreams = useCallback((): void => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    canvasStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    canvasStreamRef.current = null;
    if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
  }, []);

  const revokePreview = useCallback((): void => {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    videoUrlRef.current = null;
    setVideoUrl(null);
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (isStartingRef.current) return false;
    isStartingRef.current = true;
    setStatus("requesting");
    setError(null);
    hasRecordingErrorRef.current = false;
    revokePreview();

    if (support.error || !support.mimeType) {
      setError(support.error ?? "recordingFormatUnavailable");
      setStatus("error");
      isStartingRef.current = false;
      return false;
    }

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      cameraStreamRef.current = cameraStream;
      if (!isMountedRef.current) {
        releaseStreams();
        isStartingRef.current = false;
        return false;
      }

      const cameraVideo = cameraVideoRef.current;
      const canvas = canvasRef.current;
      if (!cameraVideo || !canvas) throw new Error("Recording preview is unavailable");

      cameraVideo.srcObject = cameraStream;
      await cameraVideo.play();
      if (!isMountedRef.current) {
        releaseStreams();
        isStartingRef.current = false;
        return false;
      }

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Recording canvas is unavailable");

      const [bunnyImage, gunImage] = await Promise.all([
        loadImage("/handgesture_bunny.svg"),
        loadImage("/handgesture_gun.svg"),
      ]);
      if (!isMountedRef.current) {
        releaseStreams();
        isStartingRef.current = false;
        return false;
      }

      const renderFrame = (): void => {
        drawBunnyChallengeVideoFrame(
          context,
          cameraVideo,
          bunnyImage,
          gunImage,
          sceneRef.current,
        );
        animationFrameRef.current = window.requestAnimationFrame(renderFrame);
      };
      renderFrame();

      const canvasStream = canvas.captureStream(24);
      canvasStreamRef.current = canvasStream;
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: support.mimeType,
      });
      recorderRef.current = recorder;
      recorder.ondataavailable = (event: BlobEvent): void => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = (): void => {
        hasRecordingErrorRef.current = true;
        if (isMountedRef.current) {
          setError("recordingInterrupted");
          setStatus("error");
        }
        if (recorder.state === "recording") recorder.stop();
      };
      recorder.onstop = (): void => {
        const chunks = chunksRef.current;
        chunksRef.current = [];
        recorderRef.current = null;
        releaseStreams();

        if (!isMountedRef.current) return;
        if (hasRecordingErrorRef.current || chunks.length === 0) {
          setError((currentError) => currentError ?? "recordingInterrupted");
          setStatus("error");
          return;
        }

        const videoBlob = new Blob(chunks, { type: recorder.mimeType });
        if (!videoBlob.size) {
          setError("recordingInterrupted");
          setStatus("error");
          return;
        }
        const previewUrl = URL.createObjectURL(videoBlob);
        videoUrlRef.current = previewUrl;
        setVideoUrl(previewUrl);
        setMimeType(recorder.mimeType);
        setStatus("ready");
      };

      cameraStream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          hasRecordingErrorRef.current = true;
          if (isMountedRef.current) {
            setError("recordingInterrupted");
            setStatus("error");
          }
          if (recorder.state === "recording") recorder.stop();
        });
      });

      chunksRef.current = [];
      recorder.start(1000);
      setMimeType(recorder.mimeType);
      setStatus("recording");
      isStartingRef.current = false;
      return true;
    } catch (caughtError) {
      releaseStreams();
      if (isMountedRef.current) {
        setError(getRecordingError(caughtError));
        setStatus("error");
      }
      isStartingRef.current = false;
      return false;
    }
  }, [releaseStreams, revokePreview, support.error, support.mimeType]);

  const stopRecording = useCallback((): void => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") {
      setStatus("processing");
      recorder.stop();
      return;
    }
    if (status === "requesting" || status === "recording") releaseStreams();
  }, [releaseStreams, status]);

  const discardRecording = useCallback((): void => {
    revokePreview();
    setMimeType(null);
    setError(null);
    setStatus("idle");
  }, [revokePreview]);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      releaseStreams();
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    };
  }, [releaseStreams]);

  return {
    cameraVideoRef,
    canvasRef,
    discardRecording,
    error,
    isRecordingSelected,
    mimeType,
    setIsRecordingSelected,
    startRecording,
    status,
    stopRecording,
    support,
    videoUrl,
  };
};
