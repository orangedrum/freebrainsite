import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnnouncementDialog } from "@/components/shared/Announcements";

/**
 * Global announcement strip, rendered directly under the site nav on every
 * page. It celebrates the two Lisbon partnerships and opens the shared
 * two-tab announcement dialog. Height is capped at `min-h-14` (56px) so it
 * never grows taller than the `h-16` nav above it.
 *
 * One short white line over a dark diagonal wash of the Web Summit palette
 * — magenta → violet → indigo → deep blue on near-black
 * (`.announcement-wash`) — with a looping glint (`.announcement-glint`)
 * passing behind the type. No pill: the whole strip is the affordance.
 */
export const PartnershipBanner = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="announcement-wash group relative flex min-h-14 w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 overflow-hidden border-b border-white/10 px-4 py-1.5 text-center"
      >
        <span
          aria-hidden="true"
          className="announcement-glint pointer-events-none absolute inset-0"
        />

        <span className="relative text-[0.7rem] text-foreground sm:text-[0.8rem]">
          {t("announcementBanner.phrase")}
        </span>{" "}

        {/* Both marks travel together: full-width on the second line below
            `sm`, side by side with the phrase from `sm` up — never a lone logo. */}
        <span className="relative flex basis-full items-center justify-center gap-3 sm:basis-auto">
          <img
            src="/logo_santacasa.svg"
            alt="Santa Casa da Misericórdia de Lisboa"
            className="h-7 w-auto rounded-lg sm:h-8"
          />
          <img
            src="/logo_centrofisioterapia.png"
            alt="Centro de Fisioterapia de Lisboa"
            className="h-6 w-auto sm:h-7"
          />
        </span>
      </button>

      <AnnouncementDialog open={open} onOpenChange={setOpen} variant="both" />
    </>
  );
};
