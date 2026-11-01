import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

interface BunnyChallengeRecordingControlsProps {
  controller: RecordingController;
  canContinueWithoutRecording: boolean;
  onContinueWithoutRecording: () => void;
}

export const BunnyChallengeRecordingControls = ({
  controller,
  canContinueWithoutRecording,
  onContinueWithoutRecording,
}: BunnyChallengeRecordingControlsProps) => {
  const { t } = useTranslation();
  const isBusy =
    controller.status === "requesting" ||
    controller.status === "recording" ||
    controller.status === "processing";
  const canDownload = controller.status === "ready" && controller.videoUrl;
  const extension = controller.mimeType?.includes("mp4") ? "mp4" : "webm";

  return (
    <div className="mt-5 space-y-3 rounded-xl border border-foreground/10 bg-background/70 p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          id="bunny-recording-consent"
          checked={controller.isRecordingSelected}
          disabled={isBusy || Boolean(controller.support.error)}
          onCheckedChange={(checked) =>
            controller.setIsRecordingSelected(checked === true)
          }
          className="mt-1"
        />
        <div>
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
          {canContinueWithoutRecording && (
            <Button type="button" variant="outline" onClick={onContinueWithoutRecording}>
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
      {controller.status === "recording" && (
        <p className="text-sm font-semibold text-foreground" role="status">
          {t("bunnyChallenge.recordingActive")}
        </p>
      )}
      {controller.status === "processing" && (
        <p className="text-sm text-muted-foreground" role="status">
          {t("bunnyChallenge.recordingProcessing")}
        </p>
      )}

      <video
        ref={controller.cameraVideoRef}
        autoPlay
        muted
        playsInline
        aria-label={t("bunnyChallenge.recordingCameraPreview")}
        className={`mx-auto max-h-64 w-full rounded-lg object-cover ${
          controller.status === "requesting" || controller.status === "recording"
            ? "block"
            : "hidden"
        }`}
      />
      <canvas
        ref={controller.canvasRef}
        width={720}
        height={1280}
        aria-hidden="true"
        className="hidden"
      />

      {canDownload && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            {t("bunnyChallenge.recordingPreviewTitle")}
          </h3>
          <video
            controls
            playsInline
            src={controller.videoUrl ?? undefined}
            className="mx-auto max-h-96 w-full rounded-lg"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a
                href={controller.videoUrl ?? undefined}
                download={`freebrain-bunny-challenge.${extension}`}
              >
                {t("bunnyChallenge.recordingDownload")}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={controller.discardRecording}
            >
              {t("bunnyChallenge.recordingDiscard")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
