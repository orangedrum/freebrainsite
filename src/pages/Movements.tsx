import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { useModalState } from "@/hooks/useModalState";
import type { MovementItem, MovementMobility, OpenModalFn } from "@/types";


const MOVEMENTS_BY_MOBILITY: Record<MovementMobility, MovementItem[]> = {
  seated: [
    {
      id: "seated-generic",
      src: "/tangoworkshop.mp4",
      style: "generic",
      mobility: "seated",
      titleKey: "movement.seatedGeneric.title",
      descriptionKey: "movement.seatedGeneric.description",
      minutes: 10,
    },
    {
      id: "seated-tango",
      src: "/tangoworkshop.mp4",
      style: "tango",
      mobility: "seated",
      titleKey: "movement.seatedTango.title",
      descriptionKey: "movement.seatedTango.description",
      minutes: 10,
    },
  ],
  assistedStanding: [
    {
      id: "assisted-generic",
      src: "/tangoworkshop.mp4",
      style: "generic",
      mobility: "assistedStanding",
      titleKey: "movement.assistedGeneric.title",
      descriptionKey: "movement.assistedGeneric.description",
      minutes: 10,
    },
    {
      id: "assisted-tango",
      src: "/tangoworkshop.mp4",
      style: "tango",
      mobility: "assistedStanding",
      titleKey: "movement.assistedTango.title",
      descriptionKey: "movement.assistedTango.description",
      minutes: 10,
    },
  ],
  independent: [
    {
      id: "independent-generic",
      src: "/tangoworkshop.mp4",
      style: "generic",
      mobility: "independent",
      titleKey: "movement.independentGeneric.title",
      descriptionKey: "movement.independentGeneric.description",
      minutes: 10,
    },
    {
      id: "independent-tango",
      src: "/tangoworkshop.mp4",
      style: "tango",
      mobility: "independent",
      titleKey: "movement.independentTango.title",
      descriptionKey: "movement.independentTango.description",
      minutes: 10,
    },
  ],
};

export const Movements = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { modalConfig, openModal, closeModal } = useModalState();

  const movements: MovementItem[] = [];
  if (location.state?.mobility) {
    movements.push(...(MOVEMENTS_BY_MOBILITY[location.state.mobility] ?? []));
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32 z-0">
          <div className="relative z-10 w-full px-4 md:px-6">
            <div className="w-full space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">{t("movements.title")}</h2>
                <p className="text-lg text-muted-foreground">{t("movements.subtitle")}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {movements.map((movement) => (
                  <div key={movement.id} className="flex flex-col items-center text-center gap-4 rounded-2xl bg-secondary border border-foreground/10 p-6">
                    <VideoPlayer src={movement.src} poster="/tangoworkshop.png" />
                    <h3 className="text-lg font-bold text-foreground">{t(movement.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{t(movement.descriptionKey)}</p>
                    <span className="text-sm font-medium text-foreground">{movement.minutes} min</span>
                  </div>
                ))}
              </div>
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

export default Movements;
