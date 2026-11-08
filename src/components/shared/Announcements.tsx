import { useTranslation } from "react-i18next";
import {
  AnnouncementCard,
  ANNOUNCEMENT_LINK_CLASS,
} from "@/components/shared/AnnouncementCard";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXTERNAL_LINKS } from "@/lib/constants";

/** The two Lisbon partners, as the same white card used on the About page. */

export const CentroAnnouncementCard = () => {
  const { t } = useTranslation();

  return (
    <AnnouncementCard
      pill={t("about.announcement.centro.pill")}
      title={t("about.announcement.centro.title")}
      videoSrc="/announce_centrofisioterapialisboa.mp4"
      mediaSide="right"
      cta={{
        label: t("about.announcement.centro.cta"),
        to: "/lisbon-pilot",
      }}
    >
      <p>{t("about.announcement.centro.body1")}</p>
      <p>{t("about.announcement.centro.body2")}</p>
      <p>
        <a
          href={EXTERNAL_LINKS.centroFisioterapia}
          target="_blank"
          rel="noopener noreferrer"
          className={ANNOUNCEMENT_LINK_CLASS}
        >
          {t("about.announcement.centro.visitLabel")}
        </a>
      </p>
    </AnnouncementCard>
  );
};

export const SantaCasaAnnouncementCard = () => {
  const { t } = useTranslation();

  return (
    <AnnouncementCard
      pill={t("about.announcement.santaCasa.pill")}
      title={t("about.announcement.santaCasa.title")}
      titleAs="p"
      videoSrc="/announce_santacasa.mp4"
      mediaSide="left"
      cta={{
        label: t("about.announcement.santaCasa.cta"),
        to: "/lisbon-pilot",
      }}
      footer={
        <div className="grid gap-5 md:grid-cols-[minmax(0,300px)_1fr] md:items-center">
          <VideoPlayer
            src="/1minworkshopsample_lisbon.mp4"
            previewFrame
            useIntrinsicAspectRatio
          />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-neutral-900">
              {t("about.announcement.santaCasa.sampleTitle")}
            </p>
            <p className="text-sm text-neutral-600">
              {t("about.announcement.santaCasa.sampleCaption")}
            </p>
          </div>
        </div>
      }
    >
      <p>{t("about.announcement.santaCasa.body1")}</p>
      <p>{t("about.announcement.santaCasa.body2")}</p>
    </AnnouncementCard>
  );
};

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * "both" — the two-tab dialog behind the global banner.
   * "santaCasa" — the single card behind the Our Story button.
   */
  variant?: "both" | "santaCasa";
}

/**
 * Brand-blue dialog carrying the white announcement cards.
 *
 * The panel keeps `--background` blue so the cards read exactly as they do on
 * the page, and the tab bar reuses the About page's rounded-full triggers.
 */
export const AnnouncementDialog = ({
  open,
  onOpenChange,
  variant = "both",
}: AnnouncementDialogProps) => {
  const { t } = useTranslation();
  const isBoth = variant === "both";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-foreground/20 bg-background p-5 text-foreground sm:max-w-4xl sm:p-6">
        <DialogTitle className="pr-8 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {isBoth ? t("announcementBanner.modalTitle") : t("announcementBanner.storyCta")}
        </DialogTitle>
        <DialogDescription className="text-sm text-foreground/80">
          {t("announcementBanner.modalDescription")}
        </DialogDescription>

        {isBoth ? (
          <Tabs defaultValue="santaCasa">
            <TabsList className="rounded-full border border-foreground/20 bg-muted p-1">
              <TabsTrigger
                value="santaCasa"
                className="rounded-full px-4 text-sm font-semibold text-foreground/80 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {t("announcementBanner.tabSantaCasa")}
              </TabsTrigger>
              <TabsTrigger
                value="centro"
                className="rounded-full px-4 text-sm font-semibold text-foreground/80 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {t("announcementBanner.tabCentro")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="santaCasa" className="mt-5">
              <SantaCasaAnnouncementCard />
            </TabsContent>
            <TabsContent value="centro" className="mt-5">
              <CentroAnnouncementCard />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-1">
            <SantaCasaAnnouncementCard />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
