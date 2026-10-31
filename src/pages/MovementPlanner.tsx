import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Star, Users, Home, Brain, Rocket, Building2, ArrowRight } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ExercisesForCondition } from "@/components/shared/ExercisesForCondition";
import { BenefitsOfMovement } from "@/components/shared/BenefitsOfMovement";
import { MovementRecipeTable } from "@/components/shared/MovementRecipeTable";
import { useModalState } from "@/hooks/useModalState";
import type { MovementMobility, OpenModalFn } from "@/types";
const MOBILITY_OPTIONS: { value: MovementMobility; key: string }[] = [{ value: "seated", key: "movementPlanner.mobility.seated" }, { value: "assistedStanding", key: "movementPlanner.mobility.assistedStanding" }, { value: "independent", key: "movementPlanner.mobility.independent" }];
const FOCUS_OPTIONS: { value: string; key: string }[] = [{ value: "freezingGait", key: "movementPlanner.focus.freezingGait" }, { value: "tremor", key: "movementPlanner.focus.tremor" }, { value: "posturalInstability", key: "movementPlanner.focus.posturalInstability" }];
const FAQ_ITEMS = [{ id: "q1", questionKey: "movementPlanner.faq.q1", answerKey: "movementPlanner.faq.a1" }, { id: "q2", questionKey: "movementPlanner.faq.q2", answerKey: "movementPlanner.faq.a2" }, { id: "q3", questionKey: "movementPlanner.faq.q3", answerKey: "movementPlanner.faq.a3" }, { id: "q4", questionKey: "movementPlanner.faq.q4", answerKey: "movementPlanner.faq.a4" }, { id: "q5", questionKey: "movementPlanner.faq.q5", answerKey: "movementPlanner.faq.a5" }, { id: "q6", questionKey: "movementPlanner.faq.q6", answerKey: "movementPlanner.faq.a6" }, { id: "q7", questionKey: "movementPlanner.faq.q7", answerKey: "movementPlanner.faq.a7" }, { id: "q8", questionKey: "movementPlanner.faq.q8", answerKey: "movementPlanner.faq.a8" }, { id: "q9", questionKey: "movementPlanner.faq.q9", answerKey: "movementPlanner.faq.a9" }, { id: "q10", questionKey: "movementPlanner.faq.q10", answerKey: "movementPlanner.faq.a10" }, { id: "q11", questionKey: "movementPlanner.faq.q11", answerKey: "movementPlanner.faq.a11" }, { id: "q12", questionKey: "movementPlanner.faq.q12", answerKey: "movementPlanner.faq.a12" }, { id: "q13", questionKey: "movementPlanner.faq.q13", answerKey: "movementPlanner.faq.a13" }, { id: "q14", questionKey: "movementPlanner.faq.q14", answerKey: "movementPlanner.faq.a14" }];
/** Movement Plan — generates a personalized 10-minute movement recipe. */
export const MovementPlanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalConfig, openModal, closeModal } = useModalState();
  const [mobility, setMobility] = useState<MovementMobility>("seated");
  const [focus, setFocus] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [factIndex, setFactIndex] = useState(0); const [factVisible, setFactVisible] = useState(true);
  const FACT_KEYS = ["movementPlanner.facts.f1", "movementPlanner.facts.f2", "movementPlanner.facts.f3", "movementPlanner.facts.f4", "movementPlanner.facts.f5", "movementPlanner.facts.f6", "movementPlanner.selectToGenerate"];
  const generateMovementPlan = (): void => setRecipe(t("movementPlanner.recipe.text"));
  const startTryNow = (): void => navigate("/movements", { state: { mobility, focus } });
  useEffect(() => {
    if (recipe) return;
    const interval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % FACT_KEYS.length);
        setFactVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [recipe]);
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="relative overflow-hidden pt-10 md:pt-16 pb-20 md:pb-32 z-0">
          <div className="relative z-10 w-full px-4 md:px-6">
            <div className="w-full space-y-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">{t("breadcrumb.home")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t("movementPlanner.title")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {!isAlertDismissed && (
                <div className="relative">
                  <Alert className="border-warning bg-background shadow-md">
                    <AlertDescription className="text-sm text-foreground/90 pr-10">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p>{t("movementPlanner.disclaimer")}</p>
                        <a
                          href="#"
                          onClick={(event) => event.preventDefault()}
                          className="relative z-10 font-medium text-[0.7em] text-muted-foreground underline underline-offset-4 hover:text-foreground ml-auto"
                        >
                          {t("movementPlanner.disclaimerFull")}
                        </a>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <button
                    type="button"
                    onClick={() => setIsAlertDismissed(true)}
                    aria-label={t("movementPlanner.alert.close")}
                    className="absolute right-3 top-3 rounded-full p-1 text-foreground transition-colors hover:bg-foreground/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    className="font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground"
                  >
                    {t("movementPlanner.researchTeam")}
                  </a>
                  {" · "}
                  {t("movementPlanner.researchedMeta")}
                </p>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("movementPlanner.title")}</h1>
                <p className="text-lg text-muted-foreground">{t("movementPlanner.subtitle")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[11px] text-foreground/90">
                <span>{t("movementPlanner.stats.guidedMovements")}</span>
                <span aria-hidden="true">·</span>
                <span>{t("movementPlanner.stats.preLoadedSafetyTiers")}</span>
                <span aria-hidden="true">·</span>
                <span>{t("movementPlanner.stats.tenMinuteRoutines")}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-foreground" />
                  {t("movementPlanner.stats.freeToUse")}
                </span>
              </div>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 md:p-8 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movementPlanner.mobilityLabel")}</p>
                    <Select value={mobility} onValueChange={(v) => setMobility(v as MovementMobility)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOBILITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movementPlanner.focusLabel")}</p>
                    <Select value={focus || FOCUS_OPTIONS[0].value} onValueChange={setFocus}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FOCUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className={recipe ? "border border-white text-white hover:bg-white/10 bg-transparent sm:w-auto" : "bg-primary text-brand hover:bg-primary/90 border-0 sm:w-auto"} onClick={generateMovementPlan}>
                    {t("movementPlanner.generateCta")}
                  </Button>
                </div>
                <div className="rounded-xl bg-background/60 border border-foreground/10 p-4 md:p-6 space-y-3 min-h-[120px]">
                  <h3 className="text-lg font-bold text-foreground">{t("movementPlanner.yourMovementPlan")}</h3>
                  {recipe ? (
                    <>
                      <MovementRecipeTable />
                      <Button className="w-full border border-white text-white hover:bg-white/10 bg-transparent mt-2" onClick={startTryNow}>
                        {t("movementPlanner.tryNow")} <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </>
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
              </div>
              <div className="rounded-[21.6px] border border-white bg-[#c1c9ff] p-6 md:p-8 space-y-4 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-9">
                    <h3 className="text-xl font-bold text-brand">{t("movementPlanner.pickMovementTitle")}</h3>
                    <p className="text-xs text-brand">
                      {t("movementPlanner.pickMovementBodyPrefix")}
                      <button
                        type="button"
                        onClick={() =>
                          openModal(
                            t("modal.joinPilot.title"),
                            t("modal.joinPilot.description"),
                            Users,
                            t("modal.joinPilot.cta"),
                            EXTERNAL_LINKS.pilotForm,
                          )
                        }
                        className="font-medium text-brand underline underline-offset-4 hover:text-brand"
                      >
                        {t("movementPlanner.pickMovementBodyLink")}
                      </button>
                      {t("movementPlanner.pickMovementBodySuffix")}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <Button variant="outline" className="w-full mt-4 bg-foreground text-brand border-brand shadow-md" onClick={() => navigate("/movements")}>
                      {t("movementPlanner.pickMovementCta")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
              <>
                <h3 className="mt-[50px] text-xl font-bold text-foreground">{t("movementPlanner.whatIsTitle")}</h3>
                <p className="mt-2 text-foreground/90">
                  {t("movementPlanner.whatIsBodyPart1")}
                  <strong>{t("movementPlanner.whatIsBodyBold1")}</strong>
                  {t("movementPlanner.whatIsBodyPart2")}
                  <strong>{t("movementPlanner.whatIsBodyBold2")}</strong>
                  {t("movementPlanner.whatIsBodyPart3")}
                  <strong>{t("movementPlanner.whatIsBodyBold3")}</strong>
                  {t("movementPlanner.whatIsBodyPart4")}
                  <strong>{t("movementPlanner.whatIsBodyBold4")}</strong>
                  {t("movementPlanner.whatIsBodyPart5")}
                </p>
              </>
              <div className="mt-[50px]">
                <BenefitsOfMovement />
              </div>
              <>
                <h3 className="mt-[50px] text-xl font-bold text-foreground">{t("movementPlanner.resultsTitle")}</h3>
                <p className="mt-2 text-foreground/90">
                  {t("movementPlanner.resultsBodyPart1")}
                  <strong>{t("movementPlanner.resultsBodyBold1")}</strong>
                  {t("movementPlanner.resultsBodyPart2")}
                  <strong>{t("movementPlanner.resultsBodyBold2")}</strong>
                  {t("movementPlanner.resultsBodyPart3")}
                  <strong>{t("movementPlanner.resultsBodyBold3")}</strong>
                  {t("movementPlanner.resultsBodyPart4")}
                  <strong>{t("movementPlanner.resultsBodyBold4")}</strong>
                  {t("movementPlanner.resultsBodyPart5")}
                  <strong>{t("movementPlanner.resultsBodyBold5")}</strong>
                  {t("movementPlanner.resultsBodyPart6")}
                  <strong>{t("movementPlanner.resultsBodyBold6")}</strong>
                  {t("movementPlanner.resultsBodyPart7")}
                  <strong>{t("movementPlanner.resultsBodyBold7")}</strong>
                  {t("movementPlanner.resultsBodyPart8")}
                  <strong>{t("movementPlanner.resultsBodyBold8")}</strong>
                  {t("movementPlanner.resultsBodyPart9")}
                  <strong>{t("movementPlanner.resultsBodyBold9")}</strong>
                  {t("movementPlanner.resultsBodyPart10")}
                </p>
              </>
              <>
                <h3 className="mt-[50px] text-xl font-bold text-foreground">{t("movementPlanner.howToTitle")}</h3>
                <ol className="list-decimal space-y-3 pl-6 text-foreground/90 mt-2">
                  <li>
                    <strong className="text-foreground">{t("movementPlanner.howToStep1Bold")}</strong>{" "}
                    {t("movementPlanner.howToStep1Rest")}
                  </li>
                  <li>
                    <strong className="text-foreground">{t("movementPlanner.howToStep2Bold")}</strong>{" "}
                    {t("movementPlanner.howToStep2Rest")}
                  </li>
                  <li>
                    <strong className="text-foreground">{t("movementPlanner.howToStep3Bold")}</strong>{" "}
                    {t("movementPlanner.howToStep3Rest")}
                  </li>
                </ol>
              </>
              <div className="mt-[50px]">
                <ExercisesForCondition />
              </div>
              <>
                <h3 className="mt-[50px] text-xl font-bold text-foreground">{t("movementPlanner.faqTitle")}</h3>
                <Accordion type="multiple" className="mt-2 w-full">
                  {FAQ_ITEMS.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="mb-2 rounded-sm bg-secondary shadow-md overflow-hidden transition-colors hover:bg-secondary/70">
                      <AccordionTrigger className="px-4 text-base font-semibold text-foreground hover:no-underline">
                        {t(item.questionKey)}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 text-sm text-foreground/90">
                        {t(item.answerKey)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
          </div>
        </section>
      </main>
      <Footer />
      <Modal
        config={modalConfig}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      />
    </div>
  );
};
export default MovementPlanner;
