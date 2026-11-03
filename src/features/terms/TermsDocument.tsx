import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import termsEn from "@/locales/en/terms.json";
import { TERMS_DATE, TERMS_VERSION } from "@/lib/terms";

/** Version stamp referenced by signup acceptance records (see terms/master-terms.md §10). */
export { TERMS_DATE, TERMS_VERSION };

type TermsSectionData = {
  title: string;
  note?: string;
  clauses: Record<string, string>;
};
type TermsSections = Record<string, TermsSectionData>;

const clauseAnchor = (id: string): string => `clause-${id.replace("_", "-")}`;
const clauseLabel = (id: string): string => id.replace("_", ".");

/** Renders **bold** markers from the legal text as <strong> elements. */
const renderText = (text: string): ReactNode[] =>
  text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );

const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Full Terms & Services document. Body text comes from the `terms` i18n
 * namespace (English-canonical; untranslated locales fall back to English),
 * so every clause is translatable per locale without code changes.
 */
export const TermsDocument = () => {
  const { t } = useTranslation("terms");
  const sections = t("sections", {
    returnObjects: true,
    defaultValue: termsEn.sections as unknown as string,
  }) as unknown as TermsSections;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t("meta.heading")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("meta.versionLine", { version: TERMS_VERSION, date: TERMS_DATE })}
        </p>
        <p className="text-foreground/90">{renderText(t("meta.provider"))}</p>
        <p className="text-foreground/90">{renderText(t("meta.contact"))}</p>
        <p className="rounded-xl border border-foreground/10 bg-secondary p-4 text-sm text-muted-foreground">
          {renderText(t("meta.stamp"))}
        </p>
      </header>

      <nav
        aria-label={t("meta.contents")}
        className="rounded-2xl border border-foreground/10 bg-secondary p-6"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("meta.contents")}
        </p>
        <ol className="space-y-1.5 text-sm">
          {Object.entries(sections).map(([id, section]) => (
            <li key={id}>
              <a
                href={`#section-${id}`}
                className="text-foreground/90 underline-offset-4 hover:text-primary hover:underline"
              >
                {id}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {Object.entries(sections).map(([id, section]) => (
        <section key={id} className="space-y-4" aria-labelledby={`section-${id}`}>
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id={`section-${id}`}
              className="scroll-mt-24 text-xl font-bold text-foreground md:text-2xl"
            >
              {id}. {section.title}
            </h2>
            <button
              type="button"
              onClick={scrollToTop}
              className="shrink-0 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {t("meta.backToTop")}
            </button>
          </div>
          {section.note && (
            <p className="rounded-xl border border-foreground/10 bg-secondary/60 p-4 text-sm italic text-muted-foreground">
              {section.note}
            </p>
          )}
          {Object.entries(section.clauses).map(([clauseId, text]) => (
            <p
              key={clauseId}
              id={clauseAnchor(clauseId)}
              className="scroll-mt-24 text-foreground/90"
            >
              <a
                href={`#${clauseAnchor(clauseId)}`}
                className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {clauseLabel(clauseId)}
              </a>{" "}
              {renderText(text)}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
};
