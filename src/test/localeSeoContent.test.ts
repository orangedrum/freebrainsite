import { describe, expect, it } from "vitest";
import de from "@/locales/de/common.json";
import en from "@/locales/en/common.json";
import es from "@/locales/es/common.json";
import pt from "@/locales/pt/common.json";

const locales = { en, es, de, pt };

describe("localized SEO FAQ content", () => {
  it("keeps Lisbon Pilot FAQs translated and in sync across locales", () => {
    const expectedKeys = Object.keys(en.lisbonPilot.faq).sort();

    Object.values(locales).forEach((locale) => {
      expect(Object.keys(locale.lisbonPilot.faq).sort()).toEqual(expectedKeys);
      Object.values(locale.lisbonPilot.faq).forEach((copy) => {
        expect(copy.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it("keeps Exercise Finder FAQ answers complete in every locale for FAQPage markup", () => {
    const expectedKeys = Object.keys(en.movements.faq).sort();

    Object.values(locales).forEach((locale) => {
      expect(Object.keys(locale.movements.faq).sort()).toEqual(expectedKeys);
      Object.values(locale.movements.faq).forEach((copy) => {
        expect(copy.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
