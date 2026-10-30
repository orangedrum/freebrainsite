import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { useModalState } from "@/hooks/useModalState";
import type { MovementMobility, OpenModalFn } from "@/types";

interface MovementPlannerProps {
  onOpenModal: OpenModalFn;
}

const MOBILITY_OPTIONS: { value: MovementMobility; key: string }[] = [
  { value: "seated", key: "movementPlanner.mobility.seated" },
  { value: "assistedStanding", key: "movementPlanner.mobility.assistedStanding" },
  { value: "independent", key: "movementPlanner.mobility.independent" },
];

const FOCUS_OPTIONS: { value: string; key: string }[] = [
  { value: "freezingGait", key: "movementPlanner.focus.freezingGait" },
  { value: "tremor", key: "movementPlanner.focus.tremor" },
  { value: "posturalInstability", key: "movementPlanner.focus.posturalInstability" },
];

/** Movement Plan — generates a personalized 10-minute movement recipe. */
export const MovementPlanner = ({ onOpenModal }: MovementPlannerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { modalConfig, closeModal } = useModalState();
  const [mobility, setMobility] = useState<MovementMobility>("seated");
  const [focus, setFocus] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);

  const generateMovementPlan = (): void => {
    setRecipe(t("movementPlanner.recipe.text"));
  };

  const startTryNow = (): void => {
    navigate("/movements", { state: { mobility, focus } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header onOpenModal={onOpenModal} />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 z-0">
          <div className="container relative mx-auto px-4 md:px-6 z-10">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("movementPlanner.title")}</h2>
                <p className="text-lg text-muted-foreground">{t("movementPlanner.subtitle")}</p>
              </div>
              <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movementPlanner.mobilityLabel")}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {MOBILITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMobility(option.value)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                          mobility === option.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-foreground/10 bg-background/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t(option.key)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-foreground">{t("movementPlanner.focusLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFocus(option.value)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          focus === option.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-foreground/10 bg-background/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t(option.key)}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-primary text-brand hover:bg-primary/90 mt-4 border-0" onClick={generateMovementPlan}>
                  {t("movementPlanner.generateCta")}
                </Button>
              </div>
              {recipe && (
                <div className="rounded-2xl bg-secondary border border-foreground/10 p-6 md:p-8 space-y-4 text-center">
                  <h3 className="text-xl font-bold text-foreground">{t("movementPlanner.recipe.title")}</h3>
                  <p className="text-foreground/90">{recipe}</p>
                  <Button className="w-full bg-primary text-brand hover:bg-primary/90 mt-4 border-0" onClick={startTryNow}>
                    {t("movementPlanner.tryNow")}
                  </Button>
                </div>
              )}
            </div>
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
