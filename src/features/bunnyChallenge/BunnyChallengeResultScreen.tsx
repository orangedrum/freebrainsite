import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BunnyChallengeRecordingControls } from "./BunnyChallengeRecordingControls";
import { BunnyChallengeShare } from "./BunnyChallengeShare";
import { formatChallengeElapsedTime } from "./bunnyChallengeSharing";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

interface BunnyChallengeResultScreenProps {
  controller: RecordingController;
  elapsedMs: number;
  onTryAgain: () => void;
}

export const BunnyChallengeResultScreen = ({
  controller,
  elapsedMs,
  onTryAgain,
}: BunnyChallengeResultScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 md:items-start">
      <section
        aria-label={t("bunnyChallenge.recordingPreviewTitle")}
        className="rounded-2xl border border-foreground/10 bg-secondary p-5 md:p-7"
      >
        <BunnyChallengeRecordingControls controller={controller} mode="result" />
      </section>
      <section className="rounded-2xl border border-foreground/10 bg-background/70 p-6 text-center md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("bunnyChallenge.elapsedLabel")}
        </p>
        {/* Sized to the time so the emoji spans exactly as wide as the digits. */}
        <div className="mx-auto w-fit">
          <p className="text-4xl font-bold tabular-nums text-foreground">
            {formatChallengeElapsedTime(elapsedMs)}
          </p>
          <p aria-hidden="true" className="text-center text-4xl leading-tight">
            🧠
          </p>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
          {t("bunnyChallenge.resultTitle")}
        </h2>
        <p className="mt-3 text-foreground/90">{t("bunnyChallenge.resultSubtitle")}</p>
        <p className="mt-4 font-semibold text-foreground">
          {t("bunnyChallenge.resultSharePrompt")}
        </p>
        <BunnyChallengeShare
          elapsedMs={elapsedMs}
          videoUrl={controller.status === "ready" ? controller.videoUrl : null}
          mimeType={controller.mimeType}
        />
        <Button
          asChild
          type="button"
          className="mt-6 min-h-12 w-full bg-brand text-white hover:bg-brand-hover"
        >
          <Link to="/#platform">{t("bunnyChallenge.whatIsFreeBrain")}</Link>
        </Button>
        <button
          type="button"
          onClick={onTryAgain}
          className="mt-4 text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("bunnyChallenge.playAgain")}
        </button>
      </section>
    </div>
  );
};
