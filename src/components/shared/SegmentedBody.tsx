import { useTranslation } from "react-i18next";

interface SegmentedBodyProps {
  /** i18n base key, e.g. "movementPlanner.whatIsBody" → Part1/Bold1/Part2… */
  baseKey: string;
  /** Number of plain segments; bold segment i follows part i (except the last). */
  parts: number;
  className?: string;
}

/** Body copy rendered as alternating plain/bold translated segments. */
export const SegmentedBody = ({ baseKey, parts, className }: SegmentedBodyProps) => {
  const { t } = useTranslation();

  return (
    <p className={className}>
      {Array.from({ length: parts }, (_, i) => (
        <span key={i}>
          {t(`${baseKey}Part${i + 1}`)}
          {i < parts - 1 && <strong>{t(`${baseKey}Bold${i + 1}`)}</strong>}
        </span>
      ))}
    </p>
  );
};
