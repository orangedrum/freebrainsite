import { ArrowRight, Smartphone, Video } from "lucide-react";
import { useTranslation } from "react-i18next";
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

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-foreground/10 bg-background/70 p-6 text-center shadow-lg md:p-10">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Video className="h-10 w-10" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-foreground md:text-3xl">
        {t("bunnyChallenge.introTitle")}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-foreground/90">
        {t("bunnyChallenge.introBody")}
      </p>

      <div className="my-6 rounded-xl bg-secondary/60 p-5 text-left">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-2 text-foreground/90">
            <p className="sm:hidden">{t("bunnyChallenge.mobileSetup")}</p>
            <p className="hidden sm:block">{t("bunnyChallenge.desktopSetup")}</p>
            <p>{t("bunnyChallenge.copyInstruction")}</p>
          </div>
        </div>
      </div>

      <p className="font-semibold text-foreground">
        {t("bunnyChallenge.highScore")}
      </p>
      <p className="mt-5 text-lg font-semibold text-foreground">
        {t("bunnyChallenge.areYouReady")}
      </p>

      <div className="mx-auto mt-5 max-w-xl text-left">
        <BunnyChallengeRecordingControls
          controller={controller}
          mode="setup"
          onContinueWithoutRecording={onContinueWithoutRecording}
        />
      </div>

      <Button
        type="button"
        onClick={onGo}
        disabled={controller.status === "requesting"}
        className="mt-6 min-h-14 min-w-48 text-lg"
      >
        {t("bunnyChallenge.go")}
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
};
