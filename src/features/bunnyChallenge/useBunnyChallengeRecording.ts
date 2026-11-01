import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  drawBunnyChallengeVideoFrame,
  type BunnyChallengeRecordingScene,
} from "./bunnyChallengeVideoCanvas";
import {
  getRecordingCanvasDimensions,
  getRecordingSupport,
} from "./recordingSupport";
import {
  getRecordingError,
  loadRecordingImage,
  type RecordingError,
  type RecordingStatus,
} from "./recordingHelpers";

export const useBunnyChallengeRecording = (
  scene: BunnyChallengeRecordingScene,
) => {
  const [isRecordingSelected, setIsRecordingSelected] = useState(false);
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [error, setError] = useState<RecordingError | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const sceneRef = useRef(scene);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const imagesRef = useRef<{
    bunny: HTMLImageElement;
    gun: HTMLImageElement;
    logo: HTMLImageElement;
  } | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoUrlRef = useRef<string | null>(null);
  const posterUrlRef = useRef<string | null>(null);
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
    if (isMountedRef.current) setCameraStream(null);
  }, []);

  const revokePreview = useCallback((): void => {
    if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    if (posterUrlRef.current) URL.revokeObjectURL(posterUrlRef.current);
    videoUrlRef.current = null;
    posterUrlRef.current = null;
    setVideoUrl(null);
    setVideoBlob(null);
    setPosterUrl(null);
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
      setCameraStream(cameraStream);

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

      const { width, height } = getRecordingCanvasDimensions();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Recording canvas is unavailable");

      const [bunnyImage, gunImage, logoImage] = await Promise.all([
        loadRecordingImage("/handgesture_bunny.svg"),
        loadRecordingImage("/handgesture_gun.svg"),
        loadRecordingImage("/smoothbluebkgrnd_nobkgrnd.png"),
      ]);
      if (!isMountedRef.current) {
        releaseStreams();
        isStartingRef.current = false;
        return false;
      }
      imagesRef.current = { bunny: bunnyImage, gun: gunImage, logo: logoImage };
      canvasContextRef.current = context;

      let lastFrameTime = 0;
      const renderFrame = (timestamp: number): void => {
        if (timestamp - lastFrameTime >= 50) {
          drawBunnyChallengeVideoFrame(
            context,
            cameraVideo,
            bunnyImage,
            gunImage,
            logoImage,
            sceneRef.current,
          );
          lastFrameTime = timestamp;
        }
        animationFrameRef.current = window.requestAnimationFrame(renderFrame);
      };
      animationFrameRef.current = window.requestAnimationFrame(renderFrame);

      const canvasStream = canvas.captureStream(20);
      canvasStreamRef.current = canvasStream;
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: support.mimeType,
        videoBitsPerSecond: 1_500_000,
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
        setVideoBlob(videoBlob);
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
      const canvas = canvasRef.current;
      const context = canvasContextRef.current;
      const images = imagesRef.current;
      const cameraVideo = cameraVideoRef.current;
      if (canvas && context && images && cameraVideo) {
        drawBunnyChallengeVideoFrame(
          context,
          cameraVideo,
          images.bunny,
          images.gun,
          images.logo,
          sceneRef.current,
        );
        canvas.toBlob((posterBlob) => {
          if (!posterBlob || !isMountedRef.current) return;
          if (posterUrlRef.current) URL.revokeObjectURL(posterUrlRef.current);
          const previewPosterUrl = URL.createObjectURL(posterBlob);
          posterUrlRef.current = previewPosterUrl;
          setPosterUrl(previewPosterUrl);
        }, "image/jpeg", 0.82);
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
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

  useLayoutEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      releaseStreams();
      imagesRef.current = null;
      canvasContextRef.current = null;
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
      if (posterUrlRef.current) URL.revokeObjectURL(posterUrlRef.current);
    };
  }, [releaseStreams]);

  return {
    cameraVideoRef,
    cameraStream,
    canvasRef,
    discardRecording,
    error,
    isRecordingSelected,
    mimeType,
    posterUrl,
    setIsRecordingSelected,
    startRecording,
    status,
    stopRecording,
    support,
    videoUrl,
    videoBlob,
  };
};
