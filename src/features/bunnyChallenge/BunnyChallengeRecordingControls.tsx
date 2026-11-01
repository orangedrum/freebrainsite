import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, CameraOff, Check, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;
type RecordingControlsMode = "setup" | "live" | "result";

interface BunnyChallengeRecordingControlsProps {
  controller: RecordingController;
  mode: RecordingControlsMode;
  onContinueWithoutRecording?: () => void;
}

export const BunnyChallengeRecordingControls = ({
  controller,
  mode,
  onContinueWithoutRecording,
}: BunnyChallengeRecordingControlsProps) => {
  const { t } = useTranslation();
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const hasVideo = controller.status === "ready" && controller.videoUrl;

  const handlePreviewOpenChange = (isOpen: boolean): void => {
    setIsPreviewOpen(isOpen);
    if (!isOpen) modalVideoRef.current?.pause();
  };

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
            <Switch
              id="bunny-recording-consent"
              checked={controller.isRecordingSelected}
              disabled={Boolean(controller.support.error)}
              onCheckedChange={controller.setIsRecordingSelected}
              aria-label={t("bunnyChallenge.recordingOptIn")}
              className="mt-1 shrink-0"
            />
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
              <div className="md:hidden">
                <Dialog open={isPreviewOpen} onOpenChange={handlePreviewOpenChange}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="group relative mx-auto block w-full max-w-48 overflow-hidden rounded-xl border border-foreground/20 bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={t("bunnyChallenge.openRecordingPreview")}
                    >
                      {controller.posterUrl ? (
                        <img
                          src={controller.posterUrl}
                          alt=""
                          className="block max-h-64 w-full bg-background object-contain"
                        />
                      ) : (
                        <div className="flex min-h-32 items-center justify-center">
                          <Video className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                        </div>
                      )}
                      <span className="absolute inset-0 flex items-center justify-center bg-background/15 transition-colors group-hover:bg-background/30">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-foreground shadow">
                          <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-foreground/10 bg-background p-4">
                    <DialogTitle className="pr-8 text-foreground">
                      {t("bunnyChallenge.recordingPreviewTitle")}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      {t("bunnyChallenge.recordingPreviewDescription")}
                    </DialogDescription>
                    <video
                      ref={modalVideoRef}
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      src={controller.videoUrl ?? undefined}
                      poster={controller.posterUrl ?? undefined}
                      aria-label={t("bunnyChallenge.recordingPreviewTitle")}
                      className="mx-auto max-h-[70svh] w-full rounded-xl bg-background"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <video
                controls
                playsInline
                preload="metadata"
                src={controller.videoUrl ?? undefined}
                poster={controller.posterUrl ?? undefined}
                aria-label={t("bunnyChallenge.recordingPreviewTitle")}
                className="mx-auto hidden max-h-[70vh] w-full rounded-xl bg-background md:block"
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
        <div className="absolute right-2 top-2 z-10 w-1/4 min-w-20 max-w-32 overflow-hidden rounded-xl border border-foreground/20 bg-background shadow-lg sm:right-4 sm:top-4">
          <div className="relative aspect-[9/16] w-full">
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
              <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
                <CameraOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-xs text-muted-foreground">
                  {t("bunnyChallenge.recordingCameraOff")}
                </p>
                {controller.error && (
                  <p className="text-xs text-danger" role="alert">
                    {t(`bunnyChallenge.${controller.error}`)}
                  </p>
                )}
              </div>
            )}
          </div>
          {controller.status === "recording" && (
            <p className="px-1 py-1 text-center text-[10px] font-medium leading-tight text-info" role="status">
              {t("bunnyChallenge.recordingActive")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
