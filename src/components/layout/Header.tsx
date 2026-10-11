import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOGO_URL, EXTERNAL_LINKS } from "@/lib/constants";
import { scrollToSection } from "@/lib/navigation";
import type { OpenModalFn } from "@/types";

interface HeaderProps {
  onOpenModal: OpenModalFn;
}

/** Sticky site navigation header with logo, community link, and CTA. */
export const Header = ({ onOpenModal }: HeaderProps) => {
  const { t } = useTranslation();

  const openJoinCommunity = (): void => {
    onOpenModal(
      t("modal.joinCommunity.title"),
      t("modal.joinCommunity.description"),
      Users,
      t("modal.joinCommunity.whatsappCta"),
      EXTERNAL_LINKS.whatsapp,
      t("modal.joinCommunity.pilotCta"),
      EXTERNAL_LINKS.mailingList,
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="FreeBrain home">
          <img
            src={LOGO_URL}
            alt="FreeBrain Logo"
            className="h-8 w-auto rounded object-cover"
          />
          <span className="text-xl font-bold text-foreground">FreeBrain</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden md:inline-flex text-foreground hover:bg-foreground/10 hover:text-foreground"
            asChild
          >
            <Link to="/team">{t("header.team")}</Link>
          </Button>
          <Button
            variant="ghost"
            className="hidden md:inline-flex text-foreground hover:bg-foreground/10 hover:text-foreground"
            onClick={openJoinCommunity}
          >
            {t("header.joinCommunity")}
          </Button>
          <Button
            className="bg-primary text-brand hover:bg-primary/90 transition-opacity border-0"
            onClick={() => scrollToSection("get-involved")}
          >
            {t("header.getInvolved")}
          </Button>
        </div>
      </div>
    </header>
  );
};
