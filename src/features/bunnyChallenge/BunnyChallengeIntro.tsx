import { ArrowRight, Hand, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BunnyChallengeRecordingControls } from "./BunnyChallengeRecordingControls";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

interface BunnyChallengeIntroProps {
  controller: RecordingController;
  onGo: () => void;
  onContinueWithoutRecording: () => void;
}

export const BunnyChallengeIntro = ({
  controller,
  onGo,
  onContinueWithoutRecording,
}: BunnyChallengeIntroProps) => {
  const { t } = useTranslation();
  const isRecordingSelected = controller.isRecordingSelected;

  return (
    <div
      className={`relative mx-auto max-w-3xl rounded-2xl border p-6 text-center shadow-lg transition-colors md:p-10 ${
        isRecordingSelected
          ? "border-brand-accent/70 bg-brand-accent/5"
          : "border-foreground/10 bg-background/70"
      }`}
    >
      {isRecordingSelected && (
        <>
          <Heart className="absolute left-4 top-4 h-6 w-6 fill-brand-accent/20 text-brand-accent" aria-hidden="true" />
          <Heart className="absolute right-4 top-4 h-6 w-6 fill-brand-accent/20 text-brand-accent" aria-hidden="true" />
          <Heart className="absolute bottom-4 left-4 h-6 w-6 fill-brand-accent/20 text-brand-accent" aria-hidden="true" />
          <Heart className="absolute bottom-4 right-4 h-6 w-6 fill-brand-accent/20 text-brand-accent" aria-hidden="true" />
        </>
      )}
      <h3 className="text-3xl font-bold text-foreground md:text-4xl">
        {t("bunnyChallenge.prepareTitle")}
      </h3>

      <div className="mt-7 space-y-5 text-left">
        <section className="rounded-xl bg-secondary/60 p-4 sm:p-5">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <Hand className="h-8 w-8 shrink-0 -scale-x-100 text-primary sm:h-10 sm:w-10" aria-hidden="true" />
            <div className="max-w-md space-y-2 text-center">
              <h4 className="text-lg font-bold text-foreground sm:text-xl">
                {t("bunnyChallenge.handsStepTitle")}
              </h4>
              <p className="text-sm text-foreground/90 sm:text-base">
                <span className="sm:hidden">{t("bunnyChallenge.mobileSetup")}</span>
                <span className="hidden sm:inline">{t("bunnyChallenge.desktopSetup")}</span>
              </p>
            </div>
            <Hand className="h-8 w-8 shrink-0 text-primary sm:h-10 sm:w-10" aria-hidden="true" />
          </div>
        </section>

        <section
          className={`rounded-xl border p-4 transition-colors sm:p-5 ${
            isRecordingSelected
              ? "border-brand-accent/50 bg-brand-accent/10"
              : "border-foreground/10 bg-background/60"
          }`}
        >
          <h4 className="text-lg font-bold text-foreground sm:text-xl">
            {t("bunnyChallenge.recordStepTitle")}
          </h4>
          <p className="mt-2 text-sm text-foreground/90 sm:text-base">
            {t("bunnyChallenge.recordStepBody")}
          </p>
          {isRecordingSelected && (
            <p className="mt-2 text-lg font-bold text-brand-accent sm:text-xl" role="status">
              {t("bunnyChallenge.recordingThanks")}
            </p>
          )}
          <div className="mt-4">
            <BunnyChallengeRecordingControls
              controller={controller}
              mode="setup"
              onContinueWithoutRecording={onContinueWithoutRecording}
            />
          </div>
          <Link
            to="/terms-and-privacy"
            className="mt-3 inline-block text-sm text-foreground/80 underline underline-offset-4 hover:text-foreground"
          >
            {t("bunnyChallenge.termsLink")}
          </Link>
        </section>

        <section className="rounded-xl bg-secondary/60 p-4 text-center sm:p-5">
          <h4 className="text-lg font-bold text-foreground sm:text-xl">
            {t("bunnyChallenge.beginStepTitle")}
          </h4>
          <Button
            type="button"
            onClick={onGo}
            disabled={controller.status === "requesting"}
            className="mt-5 min-h-14 min-w-48 text-lg"
          >
            {t("bunnyChallenge.go")}
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </section>
      </div>
    </div>
  );
};
