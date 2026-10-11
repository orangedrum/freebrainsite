import { useTranslation } from "react-i18next";
import { Handshake, ChevronRight } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";
import type { OpenModalFn } from "@/types";

interface AdvisorsSectionProps {
  onOpenModal: OpenModalFn;
}

/** Advisors band — Anoop spotlight + invite card opening the advisors modal. */
export const AdvisorsSection = ({ onOpenModal }: AdvisorsSectionProps) => {
  const { t } = useTranslation();

  const openAdvisorsModal = (): void => {
    onOpenModal(
      t("modal.advisors.title"),
      t("modal.advisors.description"),
      Handshake,
      t("modal.advisors.cta"),
      EXTERNAL_LINKS.calendly,
    );
  };

  return (
    <section className="border-y border-foreground/10 bg-foreground/5 py-16 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          {t("advisors.title")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("advisors.description")}
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <a
            href="https://www.linkedin.com/in/anoop-antony-529a72181/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("advisors.members.advisor1.name")} on LinkedIn`}
            className="flex flex-col items-center text-center gap-4 rounded-2xl bg-secondary border border-foreground/10 p-6 transition-colors hover:bg-secondary/80"
          >
            <div className="flex h-[155px] w-[155px] shrink-0 items-center justify-center rounded-full border border-foreground bg-foreground/10 p-[10px]">
              <img
                src="/advisor_Anoop.jpeg"
                alt={t("advisors.members.advisor1.name")}
                loading="lazy"
                className="h-full w-full rounded-full object-cover object-top"
              />
            </div>
            <div className="space-y-1 flex flex-col items-center">
              <h4 className="text-base font-semibold text-foreground">
                {t("advisors.members.advisor1.name")}
              </h4>
              <p className="text-xs font-medium italic text-brand-pink">
                {t("advisors.members.advisor1.role")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t("advisors.members.advisor1.contribution")}
            </p>
          </a>

          <article
            onClick={openAdvisorsModal}
            className="flex flex-col items-center justify-center text-center gap-4 rounded-2xl bg-secondary border border-foreground/10 p-6 transition-colors hover:bg-secondary/80 cursor-pointer group"
          >
            <div
              aria-hidden="true"
              className="flex h-[155px] w-[155px] shrink-0 items-center justify-center rounded-full border border-foreground bg-foreground/10 p-[10px]"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-foreground">
                <Handshake className="h-16 w-16" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-foreground">{t("advisors.invite.title")}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t("advisors.invite.description")}
            </p>
            <div className="text-sm font-medium text-foreground group-hover:text-foreground/80 flex items-center gap-1 transition-colors">
              {t("getInvolved.cards.advisors.cta")} <ChevronRight className="h-4 w-4" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
