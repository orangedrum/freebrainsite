import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

interface BunnyChallengeRecordPromptProps {
  open: boolean;
  controller: RecordingController;
  /** Controlled close, so the camera request can finish before the modal leaves. */
  onOpenChange: (open: boolean) => void;
  /** Starts the camera and the challenge together. */
  onRecord: () => void;
  /** Starts the challenge without recording. */
  onSkip: () => void;
}

/**
 * The consent step that used to live on the intro screen. Pressing Go opens
 * this choice instead of a toggle: "Record Me" starts the camera and the
 * challenge, "Don't Record Me" starts the challenge alone.
 */
export const BunnyChallengeRecordPrompt = ({
  open,
  controller,
  onOpenChange,
  onRecord,
  onSkip,
}: BunnyChallengeRecordPromptProps) => {
  const { t } = useTranslation();
  const isRequesting = controller.status === "requesting";

  const handleOpenChange = (nextOpen: boolean): void => {
    // While the camera request is in flight the choice is already made;
    // dismissing mid-request would start the run behind a closed modal.
    if (isRequesting && !nextOpen) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg border-foreground/10 bg-background">
        <DialogTitle className="pr-8 text-foreground">
          {t("bunnyChallenge.recordModalTitle")}
        </DialogTitle>
        <DialogDescription className="text-left text-sm text-foreground/90 sm:text-base">
          {t("bunnyChallenge.recordStepBody")}
        </DialogDescription>
        <p className="text-sm text-foreground/80">
          {t("bunnyChallenge.recordingConsent")}
        </p>
        {controller.support.error && (
          <p className="text-sm text-muted-foreground" role="status">
            {t(`bunnyChallenge.${controller.support.error}`)}
          </p>
        )}
        {controller.error && (
          <p className="text-sm text-danger" role="alert">
            {t(`bunnyChallenge.${controller.error}`)}
          </p>
        )}
        {isRequesting && (
          <div className="space-y-1 text-center">
            <p
              className="text-lg font-bold text-brand-accent sm:text-xl"
              role="status"
            >
              {t("bunnyChallenge.recordingThanks")}
            </p>
            <p className="text-sm text-foreground/80" role="status">
              {t("bunnyChallenge.recordingStarting")}
            </p>
          </div>
        )}
        <Link
          to="/terms"
          className="text-sm text-foreground/80 underline underline-offset-4 hover:text-foreground"
        >
          {t("bunnyChallenge.termsLink")}
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            disabled={isRequesting}
          >
            {t("bunnyChallenge.recordSkip")}
          </Button>
          <Button
            type="button"
            onClick={onRecord}
            disabled={isRequesting || Boolean(controller.support.error)}
          >
            {t("bunnyChallenge.recordMe")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
