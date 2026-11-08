import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AnnouncementCardProps {
  /** Badge above the headline, e.g. "Partnership announcement". */
  pill: string;
  /** Headline. Use `titleAs="p"` when the card sits above the page's H1. */
  title: string;
  titleAs?: "h2" | "p";
  /** Portrait announcement loop — plays silently, like the story GIFs. */
  videoSrc: string;
  /** Which side the announcement video sits on. Copy stays first in the DOM. */
  mediaSide?: "left" | "right";
  /** Body copy: paragraphs, inline links, whatever the announcement needs. */
  children: ReactNode;
  /** Optional band under the header row (extra players, captions). */
  footer?: ReactNode;
  /** Closing call to action, styled like the home page's Lisbon Pilot link. */
  cta?: { label: string; to?: string };
}

/**
 * White-surface announcement card.
 *
 * Every other surface on the brand-blue pages (`--background` #3F3CD5) carries
 * white copy, so an announcement video with a white frame would disappear into
 * the background. This card flips the palette — white panel, ink copy, brand
 * blue for the badge and links — so the video keeps its own white frame and
 * the block reads as a distinct, reusable news item anywhere on the site.
 */
export const AnnouncementCard = ({
  pill,
  title,
  titleAs = "h2",
  videoSrc,
  mediaSide = "right",
  children,
  footer,
  cta,
}: AnnouncementCardProps) => {
  const TitleTag = titleAs;

  const media = (
    <figure className="overflow-hidden rounded-2xl bg-white">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        className="aspect-[3/4] w-full object-cover"
      />
    </figure>
  );

  return (
    <div
      data-surface="white"
      className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_24px_60px_-28px_rgba(6,8,40,0.55)]"
    >
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-2 md:items-center md:gap-10 md:p-9">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground">
            {pill}
          </span>
          <TitleTag className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            {title}
          </TitleTag>
          <div className="space-y-3 leading-relaxed text-neutral-700">{children}</div>
        </div>
        <div className={mediaSide === "left" ? "md:order-first" : undefined}>{media}</div>
      </div>

      {(footer || cta) && (
        <div className="space-y-4 border-t border-neutral-200 bg-neutral-50 p-5 sm:p-7 md:p-9">
          {footer}
          {cta && (
            <Link
              to={cta.to ?? "/lisbon-pilot"}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

/** Inline link on the white card: brand blue instead of the page's white. */
export const ANNOUNCEMENT_LINK_CLASS =
  "font-semibold text-primary-foreground underline underline-offset-4 transition-colors hover:text-primary-foreground/80";
