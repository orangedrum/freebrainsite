import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourcesMenu } from "@/components/layout/ResourcesMenu";
import { LOGO_URL, EXTERNAL_LINKS } from "@/lib/constants";
import { scrollToSection } from "@/lib/navigation";
import type { OpenModalFn } from "@/types";

interface HeaderProps {
  onOpenModal: OpenModalFn;
}

/** Sticky site navigation header with logo, mobile drawer, and CTAs. */
export const Header = ({ onOpenModal }: HeaderProps) => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);
  };

  const handleGetInvolved = (): void => {
    scrollToSection("get-involved");
    setMobileOpen(false);
  };

  const mobileLinks = (
    <nav aria-label={t("header.primaryNavigation")} className="flex flex-col gap-3 px-4 pb-4 pt-2 lg:hidden">
      <Link
        to="/team"
        onClick={() => setMobileOpen(false)}
        className="text-foreground hover:text-primary transition-colors"
      >
        {t("header.team")}
      </Link>
      <ResourcesMenu />
      <Button variant="ghost" className="w-full justify-start" onClick={openJoinCommunity}>
        {t("header.joinCommunity")}
      </Button>
      <Button variant="default" className="w-full justify-start bg-primary text-brand" onClick={handleGetInvolved}>
        {t("header.getInvolved")}
      </Button>
      <Button
        asChild
        className="w-full justify-start border border-foreground/20 bg-brand text-white shadow-md hover:bg-brand-hover"
        onClick={() => setMobileOpen(false)}
      >
        <Link to="/bunny-challenge">{t("header.tryBunnyDemo")}</Link>
      </Button>
    </nav>
  );

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

        <div className="flex items-center gap-2">
          <nav aria-label={t("header.primaryNavigation")} className="hidden items-center gap-1 lg:flex">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-foreground/10 hover:text-foreground"
              asChild
            >
              <Link to="/team">{t("header.team")}</Link>
            </Button>
            <ResourcesMenu />
            <Button
              variant="ghost"
              className="text-foreground hover:bg-foreground/10 hover:text-foreground"
              onClick={openJoinCommunity}
            >
              {t("header.joinCommunity")}
            </Button>
            <Button
              className="bg-primary text-brand transition-opacity hover:bg-primary/90"
              onClick={handleGetInvolved}
            >
              {t("header.getInvolved")}
            </Button>
            <Button
              asChild
              className="border border-foreground/20 bg-brand text-white shadow-md hover:bg-brand-hover"
            >
              <Link to="/bunny-challenge">{t("header.tryBunnyDemo")}</Link>
            </Button>
          </nav>

          <Button
            variant="ghost"
            className="p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileOpen && mobileLinks}
    </header>
  );
};