import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Modal } from "@/components/shared/Modal";
import { useModalState } from "@/hooks/useModalState";
import { TermsDocument } from "@/features/terms/TermsDocument";

/** FreeBrain Terms & Services — stable short URL linked from checkboxes and the footer. */
const Terms = () => {
  const { t } = useTranslation("terms");
  const { modalConfig, openModal, closeModal } = useModalState();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <link rel="canonical" href="https://www.freethebrains.com/terms" />
      </Helmet>
      <Header onOpenModal={openModal} />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
          <TermsDocument />
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

export default Terms;
