import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Instagram, Facebook, ArrowUp } from "lucide-react";
import { LOGO_URL, FIREFLY_LOGO_URL, EXTERNAL_LINKS } from "@/lib/constants";
import { TikTokIcon } from "@/components/shared/TikTokIcon";
import { scrollToSection } from "@/lib/navigation";

/** Site footer — brand, explore + resources columns, socials, incubator badge. */
export const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // On the home page the section is right there; anywhere else (e.g. /about)
  // navigate first so the anchor exists to scroll to.
  const handleGetInvolved = (): void => {
    if (pathname === "/") {
      scrollToSection("get-involved");
      return;
    }
    navigate("/#get-involved");
  };

  return (
    <footer className="border-t border-foreground/10 bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2" aria-label="FreeBrain home">
            <img src={LOGO_URL} alt="FreeBrain Logo" width={128} height={120} className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold text-foreground">FreeBrain</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm">{t("footer.tagline")}</p>
          <div className="pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {t("footer.incubatorLabel")}
            </p>
            <img
              src={FIREFLY_LOGO_URL}
              alt="Firefly Innovations"
              width={400}
              height={125}
              loading="lazy"
              className="h-8 w-auto object-contain rounded opacity-75"
            />
          </div>
          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {t("footer.webSummitLabel")}
            </p>
            <a
              href={EXTERNAL_LINKS.webSummit}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("websummit.cta")}
              className="inline-block rounded-xl bg-primary px-4 py-2 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <img
                src="/Web-Summit-Lisbon-9-12-2026-logo-coloured-768x137.png"
                alt="Web Summit Lisbon 2026"
                width={768}
                height={137}
                loading="lazy"
                className="h-8 w-auto object-contain"
              />
            </a>
          </div>
        </div>

        <nav aria-label={t("footer.explore")} className="space-y-4">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {t("footer.explore")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.links.home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("header.about")}
              </Link>
            </li>
            <li>
              <Link
                to="/team"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("header.team")}
              </Link>
            </li>
            <li>
              <Link
                to="/lisbon-pilot"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.links.lisbonPilot")}
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("footer.links.terms")}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleGetInvolved}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("header.getInvolved")}
              </button>
            </li>
          </ul>
        </nav>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {t("footer.resources")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/movement-planner"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("header.movementPlanner")}
              </Link>
            </li>
            <li>
              <Link
                to="/movements"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("header.sampleExercises")}
              </Link>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              {t("footer.podcast")}
              <span className="rounded-full border border-brand-accent bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground">
                {t("footer.soon")}
              </span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              {t("footer.resourceCenter")}
              <span className="rounded-full border border-brand-accent bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground">
                {t("footer.soon")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={EXTERNAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href={EXTERNAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href={EXTERNAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <TikTokIcon className="h-5 w-5" />
              <span className="sr-only">TikTok</span>
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors md:hidden"
            >
              <ArrowUp className="h-4 w-4" />
              {t("footer.backToTop")}
            </button>
            {/* Bottom-right credit — the studio behind FreeBrain */}
            <a
              href={EXTERNAL_LINKS.productShift}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <span className="text-xs">{t("footer.productOf")}</span>
              <img
                src="/productshiftLogo.png"
                alt="ProductShift"
                width={200}
                height={200}
                loading="lazy"
                className="h-6 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
