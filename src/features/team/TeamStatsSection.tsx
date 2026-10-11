import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface TeamStat {
  target: number;
  suffix: string;
  label: string;
}

interface ClientLogo {
  src: string;
  alt: string;
}

const StatItem = ({ target, suffix, label, start }: TeamStat & { start: boolean }) => {
  const value = useCountUp(target, start);
  return (
    <div className="space-y-1">
      <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        {value}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

/** Impact stats + satisfied-projects logo strip for the Team page. */
export const TeamStatsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEntered) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [hasEntered]);

  const stats: TeamStat[] = [
    { target: 15, suffix: "+", label: t("team.stats.experience") },
    { target: 50, suffix: "+", label: t("team.stats.projects") },
    { target: 70, suffix: "%", label: t("team.stats.roi") },
    { target: 90, suffix: "%", label: t("team.stats.successRate") },
  ];

  const logos: ClientLogo[] = [
    { src: "/clients-disney.png", alt: t("team.clients.logos.disney") },
    { src: "/clients-codeschool.png", alt: t("team.clients.logos.codeschool") },
    { src: "/clients-pluralsight.png", alt: t("team.clients.logos.pluralsight") },
    { src: "/clients-stackpath.png", alt: t("team.clients.logos.stackpath") },
  ];

  return (
    <section ref={sectionRef} className="border-b border-foreground/10 bg-secondary/40 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto text-center md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} start={hasEntered} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          <Star className="h-2 w-2 text-foreground" fill="currentColor" aria-hidden="true" />
          <h3 className="text-[9px] font-normal uppercase tracking-[0.35em] text-foreground">
            {t("team.clients.title")}
          </h3>
          <Star className="h-2 w-2 text-foreground" fill="currentColor" aria-hidden="true" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 md:gap-8">
          {logos.map((logo, index) => (
            <div
              key={logo.src}
              style={{ animationDelay: `${index * 0.75}s` }}
              className="animate-float"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="h-12 w-auto object-contain opacity-30 brightness-0 invert transition duration-300 hover:opacity-100 hover:brightness-100 hover:invert-0 md:h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
