import { useTranslation } from "react-i18next";
import { Linkedin, ExternalLink } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";

/** Founder half-cover for the Team page — photo fills the left half, copy on the right. */
export const FounderSection = () => {
  const { t } = useTranslation();

  const highlights: string[] = [
    t("team.founder.highlights.startups"),
    t("team.founder.highlights.thoughtLeader"),
    t("team.founder.highlights.director"),
    t("team.founder.highlights.optimization"),
  ];

  return (
    <section className="grid md:grid-cols-2 border-y border-foreground/10">
      <div className="relative min-h-72 md:min-h-[560px] overflow-hidden">
        <img
          src="/founder_speaking.jpg"
          alt={t("team.founder.photoAlt")}
          className="absolute inset-y-0 left-0 h-full w-full md:w-[calc(100%+200px)] max-w-none object-cover object-center"
        />
      </div>

      <div className="flex flex-col justify-center gap-6 bg-secondary p-8 md:p-16">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("team.founder.name")}
          </h1>
          <p className="text-base font-medium italic text-brand-pink md:text-lg">
            {t("team.founder.role")}
          </p>
        </div>

        <ul className="space-y-3 text-left">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="list-disc marker:text-brand-pink text-muted-foreground leading-relaxed ml-5"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3">
          <a
            href={EXTERNAL_LINKS.founderLinkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-primary/90"
          >
            <Linkedin className="h-4 w-4" />
            {t("team.founder.linkedinCta")}
          </a>
          <a
            href={EXTERNAL_LINKS.productShift}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
          >
            <ExternalLink className="h-4 w-4" />
            {t("team.founder.productShiftCta")}
          </a>
        </div>
      </div>
    </section>
  );
};
