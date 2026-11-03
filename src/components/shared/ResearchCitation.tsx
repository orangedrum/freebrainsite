import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface ResearchCitationProps {
  /** Target for the research-team link. Hash links render as plain anchors. */
  href?: string;
}

/**
 * Research citation line ("FreeBrain Research Team · Reviewed … · N Citations").
 * Renders directly below the medical alert on every content page — this is the
 * default layout for all page templates.
 */
export const ResearchCitation = ({ href = "/team" }: ResearchCitationProps) => {
  const { t } = useTranslation();
  const linkClass = "font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground";

  return (
    <p className="text-xs text-muted-foreground">
      {href.startsWith("#") ? (
        <a href={href} className={linkClass}>
          {t("movementPlanner.researchTeam")}
        </a>
      ) : (
        <Link to={href} className={linkClass}>
          {t("movementPlanner.researchTeam")}
        </Link>
      )}
      {" · "}
      {t("movementPlanner.researchedMeta")}
    </p>
  );
};
