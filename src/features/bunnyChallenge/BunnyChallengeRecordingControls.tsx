import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, CameraOff, Check, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;
type RecordingControlsMode = "setup" | "live" | "result";

interface BunnyChallengeRecordingControlsProps {
  controller: RecordingController;
  mode: RecordingControlsMode;
  onStop?: () => void;
  onContinueWithoutRecording?: () => void;
}

export const BunnyChallengeRecordingControls = ({
  controller,
  mode,
  onStop,
  onContinueWithoutRecording,
}: BunnyChallengeRecordingControlsProps) => {
  const { t } = useTranslation();
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = controller.status === "ready" && controller.videoUrl;

  useEffect(() => {
    const previewVideo = previewVideoRef.current;
    if (!previewVideo) return;
    previewVideo.srcObject = controller.cameraStream;
    return () => {
      previewVideo.srcObject = null;
    };
  }, [controller.cameraStream]);

  return (
    <div className="space-y-3">
      {mode === "setup" && (
        <div className="space-y-3 rounded-xl border border-foreground/10 bg-background/70 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="bunny-recording-consent"
              checked={controller.isRecordingSelected}
              disabled={Boolean(controller.support.error)}
              onCheckedChange={(checked) =>
                controller.setIsRecordingSelected(checked === true)
              }
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="bunny-recording-consent"
                className="cursor-pointer font-semibold text-foreground"
              >
                {t("bunnyChallenge.recordingOptIn")}
              </label>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("bunnyChallenge.recordingConsent")}
              </p>
            </div>
            <Video aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" />
          </div>
          {controller.support.error && (
            <p className="text-sm text-muted-foreground" role="status">
              {t(`bunnyChallenge.${controller.support.error}`)}
            </p>
          )}
          {controller.error && (
            <div className="space-y-2" role="alert">
              <p className="text-sm text-danger">
                {t(`bunnyChallenge.${controller.error}`)}
              </p>
              {controller.isRecordingSelected && onContinueWithoutRecording && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onContinueWithoutRecording}
                >
                  {t("bunnyChallenge.recordingContinueWithout")}
                </Button>
              )}
            </div>
          )}
          {controller.status === "requesting" && (
            <p className="text-sm text-muted-foreground" role="status">
              {t("bunnyChallenge.recordingStarting")}
            </p>
          )}
        </div>
      )}

      {mode === "result" && (
        <div className="space-y-3">
          {hasVideo ? (
            <>
              <video
                controls
                playsInline
                preload="none"
                src={controller.videoUrl ?? undefined}
                poster={controller.posterUrl ?? undefined}
                aria-label={t("bunnyChallenge.recordingPreviewTitle")}
                className="mx-auto max-h-[70vh] w-full rounded-xl bg-background"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={controller.discardRecording}
              >
                {t("bunnyChallenge.recordingDiscard")}
              </Button>
            </>
          ) : controller.status === "processing" ? (
            <p className="rounded-xl bg-background/70 p-6 text-center text-sm text-muted-foreground" role="status">
              {t("bunnyChallenge.recordingProcessing")}
            </p>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-foreground/10 bg-background/70 p-6 text-center">
              <Camera className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {controller.error
                  ? t(`bunnyChallenge.${controller.error}`)
                  : t("bunnyChallenge.resultNoRecording")}
              </p>
            </div>
          )}
          {hasVideo && (
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4" aria-hidden="true" />
              {t("bunnyChallenge.recordingLocalOnly")}
            </p>
          )}
        </div>
      )}

      {mode === "live" && (
        <div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background">
          <div className="relative aspect-[9/16] max-h-[70vh] w-full md:aspect-[4/5]">
            {controller.status === "recording" ? (
              <video
                ref={previewVideoRef}
                autoPlay
                muted
                playsInline
                aria-label={t("bunnyChallenge.recordingCameraPreview")}
                className="h-full w-full scale-x-[-1] object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <CameraOff className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  {t("bunnyChallenge.recordingCameraOff")}
                </p>
                {controller.error && (
                  <p className="text-sm text-danger" role="alert">
                    {t(`bunnyChallenge.${controller.error}`)}
                  </p>
                )}
              </div>
            )}
          </div>
          {controller.status === "recording" && (
            <p className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-foreground" role="status">
              <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />
              {t("bunnyChallenge.recordingActive")}
            </p>
          )}
          <Button
            type="button"
            variant="destructive"
            onClick={onStop}
            className="absolute bottom-4 left-1/2 min-h-12 min-w-32 -translate-x-1/2 px-8 text-lg"
          >
            {t("bunnyChallenge.stop")}
          </Button>
        </div>
      )}
    </div>
  );
};
