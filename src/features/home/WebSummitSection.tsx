import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { useCountdown } from "@/hooks/useCountdown";

const SUMMIT_START = new Date("2026-11-09T09:00:00Z");

/** Web Summit 2026 banner — full-width cover, no overlay, links to our appearance. */
export const WebSummitSection = () => {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds, hasPassed } = useCountdown(SUMMIT_START);

  const units = [
    { value: days, label: t("websummit.countdown.days") },
    { value: hours, label: t("websummit.countdown.hours") },
    { value: minutes, label: t("websummit.countdown.minutes") },
    { value: seconds, label: t("websummit.countdown.seconds") },
  ];

  return (
    <section className="relative overflow-hidden">
      <img
        src="/aigenwebsumitvision.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-background/70" />
      <div className="container relative mx-auto px-4 md:px-6 flex min-h-[480px] md:min-h-[560px] flex-col items-start justify-end pb-12 md:pb-16">
        <div className="max-w-2xl space-y-4 drop-shadow-lg">
          <div className="inline-flex items-center rounded-full border border-primary bg-primary px-3 py-1 text-sm font-medium text-brand">
            {t("websummit.pill")}
          </div>
          {hasPassed ? (
            <p className="text-lg font-semibold text-foreground">{t("websummit.countdown.live")}</p>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6" role="timer">
              {units.map((unit) => (
                <div key={unit.label} className="text-center">
                  <p className="text-3xl font-bold tabular-nums text-foreground md:text-4xl">
                    {unit.value}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/80">
                    {unit.label}
                  </p>
                </div>
              ))}
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("websummit.title")}
          </h2>
          <p className="text-lg font-semibold text-foreground">{t("websummit.dates")}</p>
          <p className="text-lg text-foreground/90">{t("websummit.description")}</p>
          <a
            href={EXTERNAL_LINKS.webSummit}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-primary/90"
          >
            {t("websummit.cta")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
