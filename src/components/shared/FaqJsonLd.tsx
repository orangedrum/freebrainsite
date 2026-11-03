import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface FaqJsonLdProps {
  items: { questionKey: string; answerKey: string }[];
}

/**
 * FAQPage JSON-LD structured data rendered from translated FAQ keys.
 * Renders its own <Helmet> so it must be a sibling of, not nested inside,
 * another <Helmet> element.
 */
export const FaqJsonLd = ({ items }: FaqJsonLdProps) => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(({ questionKey, answerKey }) => ({
            "@type": "Question",
            name: t(questionKey),
            acceptedAnswer: { "@type": "Answer", text: t(answerKey) },
          })),
        })}
      </script>
    </Helmet>
  );
};
