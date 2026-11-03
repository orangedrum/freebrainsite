import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { MovementPageMeta } from "@/features/movements/MovementPageMeta";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ExercisesForCondition } from "@/components/shared/ExercisesForCondition";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { FaqJsonLd } from "@/components/shared/FaqJsonLd";
import { BenefitsOfMovement } from "@/components/shared/BenefitsOfMovement";
import { MovementByCondition } from "@/components/shared/MovementByCondition";
import { MovementPlannerPromoCard } from "@/components/shared/MovementPlannerPromoCard";
import { useModalState } from "@/hooks/useModalState";
import { Users } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";
import type { MovementItem, MovementMobility } from "@/types";
import {
  CONDITIONS,
  FAQ_ITEMS,
  FOCUS_OPTIONS,
  MOBILITY_OPTIONS,
  MOVEMENTS,
  TIME_OPTIONS,
} from "@/features/movements/movementPageData";

export const Movements = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { modalConfig, openModal, closeModal } = useModalState();

  const [condition, setCondition] = useState(location.state?.condition ?? "parkinsonsDisease");
  const [conditionSearch, setConditionSearch] = useState("");
  const [conditionOpen, setConditionOpen] = useState(false);
  const [mobility, setMobility] = useState<MovementMobility>(location.state?.mobility ?? "seated");
  const [timeIndex, setTimeIndex] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MovementItem | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const FACT_KEYS = ["movements.facts.f1", "movements.facts.f2", "movements.facts.f3", "movements.facts.f4", "movements.facts.f5", "movements.facts.f6", "movements.selectToGenerate"];

  const selectedTime = TIME_OPTIONS[timeIndex];
  const results = showResults
    ? MOVEMENTS.filter((m) => m.mobility === mobility && m.minutes <= selectedTime).slice(0, 1)
    : [];

  useEffect(() => {
    if (showResults) return;
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % FACT_KEYS.length);
        setFactVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [showResults]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>Free Movement Exercises for Neurological Conditions | FreeBrain</title>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Movement Exercises for Neurological Conditions",
            "url": "https://www.freethebrains.com/movements",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Free guided movement videos for Parkinson's, MS, stroke recovery, epilepsy, and 15+ neurological conditions."
          })}
        </script>
        <meta name="description" content="Free guided movement videos for Parkinson's, MS, stroke recovery, epilepsy, and 15+ neurological conditions. Filter by condition, mobility level, and session time. No equipment needed." />
        <link rel="canonical" href="https://www.freethebrains.com/movements" />
        <meta property="og:title" content="Free Movement Exercises for Neurological Conditions | FreeBrain" />
        <meta property="og:description" content="Free guided movement videos for Parkinson's, MS, stroke recovery, epilepsy, and 15+ neurological conditions." />
        <meta property="og:url" content="https://www.freethebrains.com/movements" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Movement Exercises for Neurological Conditions | FreeBrain" />
        <meta name="twitter:description" content="Free guided movement videos for Parkinson's, MS, stroke recovery, epilepsy, and 15+ neurological conditions." />
      </Helmet>
      <FaqJsonLd items={FAQ_ITEMS} />
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="relative overflow-hidden pt-10 md:pt-16 pb-20 md:pb-32 z-0">
          <div className="relative z-10 w-full px-4 md:px-6">
            <div className="w-full space-y-4">
              <MovementPageMeta />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("movements.title")}</h1>
                <p className="text-lg text-muted-foreground">{t("movements.subtitle")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[11px] text-foreground/90">
                <span>15 neurological conditions</span>
                <span aria-hidden="true">·</span>
                <span>3 mobility levels</span>
                <span aria-hidden="true">·</span>
                <span>1-15 min sessions</span>
                <span aria-hidden="true">·</span>
                <span>Free to use</span>
              </div>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 md:p-8 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1 relative">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movements.conditionLabel")}</p>
                    <input
                      type="text"
                      value={conditionSearch || t(`movementPlanner.conditions.${condition}`)}
                      onChange={(e) => { setConditionSearch(e.target.value); setConditionOpen(true); }}
                      onFocus={() => { setConditionSearch(""); setConditionOpen(true); }}
                      onBlur={() => setTimeout(() => setConditionOpen(false), 150)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      placeholder={t("movements.conditionLabel")}
                    />
                    {conditionOpen && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                        {CONDITIONS.filter((c) => t(`movementPlanner.conditions.${c}`).toLowerCase().includes(conditionSearch.toLowerCase())).map((c) => (
                          <button
                            key={c}
                            type="button"
                            className="flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                            onMouseDown={() => { setCondition(c); setConditionSearch(""); setConditionOpen(false); }}
                          >
                            {t(`movementPlanner.conditions.${c}`)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movementPlanner.mobilityLabel")}</p>
                    <Select value={mobility} onValueChange={(v) => setMobility(v as MovementMobility)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MOBILITY_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{t(o.key)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movements.timeLabel")}: {selectedTime} min</p>
                    <input type="range" min={0} max={2} step={1} value={timeIndex} onChange={(e) => setTimeIndex(Number(e.target.value))} className="w-full accent-secondary h-2 cursor-pointer rounded-full border border-white" style={{ accentColor: "hsl(241.2 64.5% 45%)" }} />
                  </div>
                  <button type="button" onClick={() => setShowResults(true)} className="bg-primary text-brand hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-medium border-0">
                    {t("movements.findMyMovement")}
                  </button>
                </div>
                <div className="rounded-xl bg-background/60 border border-foreground/10 p-4 md:p-6 space-y-3 min-h-[120px]">
                  <h3 className="text-lg font-bold text-foreground">{t("movements.yourMovementLibrary")}</h3>
                  {showResults ? (
                    results.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {results.map((m) => (
                          <div key={m.id} className="flex gap-4 rounded-2xl bg-secondary border border-foreground/10 p-4 cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => setSelectedVideo(m)}>
                            <div className="shrink-0 w-40 sm:w-48">
                              <VideoPlayer src={m.src} poster="/tangoworkshop.png" orientation="horizontal" playable={false} />
                            </div>
                            <div className="flex flex-col justify-center gap-1 min-w-0">
                              <h3 className="text-lg font-bold text-foreground">{t(m.titleKey)}</h3>
                              <p className="text-sm text-muted-foreground">{t(m.descriptionKey)}</p>
                              <p className="text-xs text-foreground/70">{t(m.whyHelpfulKey)}</p>
                              <span className="text-sm font-medium text-foreground">{m.minutes} min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">{t("movements.noResults")}</p>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                      <p
                        className={`text-center text-sm text-muted-foreground transition-opacity duration-300 ${factVisible ? "opacity-100" : "opacity-0"}`}
                      >
                        {t(FACT_KEYS[factIndex])}
                      </p>
                    </div>
                  )}
                </div>
                <Dialog open={!!selectedVideo} onOpenChange={(open) => { if (!open) setSelectedVideo(null); }}>
                  <DialogContent className="max-w-3xl">
                    {selectedVideo && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-foreground">{t(selectedVideo.titleKey)}</h3>
                        <VideoPlayer src={selectedVideo.src} poster="/tangoworkshop.png" orientation="horizontal" />
                        <p className="text-sm text-muted-foreground">{t(selectedVideo.descriptionKey)}</p>
                        <p className="text-xs text-foreground/70">{t(selectedVideo.whyHelpfulKey)}</p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mt-[50px]">
              <MovementPlannerPromoCard
                href="/movement-planner"
                description={
                  <>
                    {t("movementPlanner.pickMovementBodyPrefix")}
                    <button type="button" onClick={() => openModal(t("modal.joinPilot.title"), t("modal.joinPilot.description"), Users, t("modal.joinPilot.cta"), EXTERNAL_LINKS.pilotForm)} className="font-medium text-primary underline underline-offset-4 hover:text-primary">
                      {t("movementPlanner.pickMovementBodyLink")}
                    </button>
                    {t("movementPlanner.pickMovementBodySuffix")}
                  </>
                }
              />
            </div>
            <div className="mt-[50px]">
              <h2 className="text-xl font-bold text-foreground">{t("movements.whatIsTitle")}</h2>
              <p className="mt-2 text-foreground/90">{t("movements.whatIsBody")}</p>
            </div>
            <div className="mt-[50px]">
              <h2 className="text-xl font-bold text-foreground">{t("movements.howToTitle")}</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-6 text-foreground/90">
                <li>{t("movements.howToStep1")}</li>
                <li>{t("movements.howToStep2")}</li>
                <li>{t("movements.howToStep3")}</li>
              </ol>
            </div>
            <div className="mt-[50px]">
              <BenefitsOfMovement />
            </div>
            <div className="mt-[50px]">
              <h2 id="movement-research" className="text-xl font-bold text-foreground">{t("movements.researchTitle")}</h2>
              <p className="mt-2 text-foreground/90">{t("movements.researchBody")}</p>
            </div>
            <div className="mt-[50px]">
              <ExercisesForCondition />
            </div>
            <div className="mt-[50px]">
              <MovementByCondition />
            </div>
            <div className="mt-[50px]">
              <h2 className="text-xl font-bold text-foreground">{t("movements.howMovementHelpsTitle")}</h2>
              <p className="mt-2 text-foreground/90">{t("movements.howMovementHelpsBody")}</p>
            </div>
            <div className="mt-[50px]">
              <h2 className="text-xl font-bold text-foreground">{t("movements.faqTitle")}</h2>
              <FaqAccordion
                items={FAQ_ITEMS.map((item) => ({
                  id: item.id,
                  question: t(item.questionKey),
                  answer: t(item.answerKey),
                }))}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Modal config={modalConfig} onOpenChange={(open) => { if (!open) closeModal(); }} />
    </div>
  );
};

export default Movements;
