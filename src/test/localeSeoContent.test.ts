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

  it("keeps the whole About page — story, audiences and announcements — translated", () => {
    const leaves = (value: unknown, prefix = ""): Array<[string, string]> => {
      if (value && typeof value === "object") {
        return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
          leaves(child, prefix ? `${prefix}.${key}` : key),
        );
      }
      return [[prefix, String(value)]];
    };

    const expected = leaves(en.about);
    expect(expected.length).toBeGreaterThan(80);

    Object.entries(locales).forEach(([lang, locale]) => {
      const actual = leaves((locale as { about: unknown }).about);
      expect(actual.map(([path]) => path), lang).toEqual(expected.map(([path]) => path));
      actual.forEach(([path, copy]) => {
        expect(copy.trim().length, `${lang}:${path}`).toBeGreaterThan(0);
      });
    });
  });
});
