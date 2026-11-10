import { ArrowRight, Hand } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface BunnyChallengeIntroProps {
  /** Opens the record-or-skip prompt; the consent choice lives in that modal. */
  onGo: () => void;
}

export const BunnyChallengeIntro = ({ onGo }: BunnyChallengeIntroProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-foreground/10 bg-background/70 p-6 text-center shadow-lg md:p-10">
      <h2 className="text-3xl font-bold text-foreground md:text-4xl">
        {t("bunnyChallenge.prepareTitle")}
      </h2>

      <div className="mt-7 space-y-5 text-left">
        <section className="rounded-xl bg-secondary/60 p-4 sm:p-5">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <Hand className="h-8 w-8 shrink-0 -scale-x-100 text-primary sm:h-10 sm:w-10" aria-hidden="true" />
            <div className="max-w-md space-y-2 text-center">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                {t("bunnyChallenge.handsStepTitle")}
              </h3>
              <p className="text-sm text-foreground/90 sm:text-base">
                <span className="sm:hidden">{t("bunnyChallenge.mobileSetup")}</span>
                <span className="hidden sm:inline">{t("bunnyChallenge.desktopSetup")}</span>
              </p>
            </div>
            <Hand className="h-8 w-8 shrink-0 text-primary sm:h-10 sm:w-10" aria-hidden="true" />
          </div>
        </section>

        <section className="rounded-xl bg-secondary/60 p-4 text-center sm:p-5">
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            {t("bunnyChallenge.beginStepTitle")}
          </h3>
          <Button
            type="button"
            onClick={onGo}
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
