// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { beforeAll, describe, expect, it } from "vitest";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import english from "@/locales/en/common.json";
import About from "@/pages/About";

// jsdom without pretendToBeVisual has no rAF; Helmet defers head commits to rAF.
if (typeof window.requestAnimationFrame !== "function") {
  window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0)) as typeof window.requestAnimationFrame;
}

// Story videos observe viewport entry; jsdom has no IntersectionObserver.
if (typeof window.IntersectionObserver === "undefined") {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

const testI18n = createInstance();

beforeAll(async () => {
  await testI18n.init({
    lng: "en",
    resources: { en: { translation: english } },
    interpolation: { escapeValue: false },
  });
});

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

const renderAbout = async () => {
  const view = render(
    <HelmetProvider>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={["/about"]}>
          <About />
        </MemoryRouter>
      </I18nextProvider>
    </HelmetProvider>,
  );
  await nextFrame();
  return view;
};

describe("About page SEO", () => {
  it("commits its own title, description and canonical", async () => {
    await renderAbout();

    expect(document.title).toBe(
      "About FreeBrain: From Focal Dystonia to Movement Therapy",
    );
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toContain(
      "how to keep a parent with Parkinson's active at home",
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://www.freethebrains.com/about",
    );
  });

  it("renders exactly one H1 with no skipped heading levels", async () => {
    await renderAbout();

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const levels = Array.from(
      document.querySelectorAll("main h1, main h2, main h3"),
    ).map((heading) => Number(heading.tagName.charAt(1)));

    expect(levels[0]).toBe(1);
    levels.slice(1).forEach((level, index) => {
      expect(level).toBeLessThanOrEqual(levels[index] + 1);
    });
  });

  it("carries the long-tail keyword headlines from docs/growth-strategy.md", async () => {
    await renderAbout();

    const h2s = Array.from(document.querySelectorAll("main h2")).map(
      (heading) => heading.textContent?.replace(/\s+/g, " ").trim() ?? "",
    );

    [
      "How a Dystonia Diagnosis Led to Solving Problems Through Technology",
      "Accidentally Finding Medicine Through Movement Therapy",
      "Exercise as Medicine: Research on Movement and Neurological Conditions",
      "How to Keep a Parkinson's Patient Active at Home",
      "Why Movement Therapy Matters for 43% of the World's Population",
      "Movement Therapy for Neurological Conditions: FAQs",
    ].forEach((headline) => expect(h2s).toContain(headline));

    // The 43% section opens the "What is FreeBrain" tab, ahead of the evidence.
    expect(
      h2s.indexOf("Why Movement Therapy Matters for 43% of the World's Population"),
    ).toBeLessThan(
      h2s.indexOf("Exercise as Medicine: Research on Movement and Neurological Conditions"),
    );

    // Focus keyword from docs/growth-strategy.md, verbatim in the prose.
    const pageText = (document.querySelector("main")?.textContent ?? "").replace(
      /\s+/g,
      " ",
    );
    expect(pageText).toContain("how to help a parent with Parkinson's exercise safely");
  });

  it("renders both tabs and switches between them", async () => {
    await renderAbout();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(["What is FreeBrain", "Our Story"]);

    // forceMount keeps both panels in the DOM so crawlers see the full page;
    // the inactive one is hidden with data-[state=inactive]:hidden. The story
    // panel stays first in the DOM so the page's only H1 still fronts it —
    // the Santa Casa announcement above it is a styled paragraph, not a heading.
    const panels = screen.getAllByRole("tabpanel");
    expect(panels).toHaveLength(2);
    expect(panels[0].getAttribute("data-state")).toBe("inactive"); // Our Story
    expect(panels[1].getAttribute("data-state")).toBe("active"); // What is FreeBrain

    // Radix Tabs activate on mousedown (automatic activation mode).
    fireEvent.mouseDown(tabs[1]);
    fireEvent.click(tabs[1]); // switch to Our Story
    expect(tabs[1].getAttribute("data-state")).toBe("active");
    expect(panels[0].getAttribute("data-state")).toBe("active");
    expect(panels[1].getAttribute("data-state")).toBe("inactive");

    fireEvent.mouseDown(tabs[0]);
    fireEvent.click(tabs[0]); // back to What is FreeBrain
    expect(tabs[0].getAttribute("data-state")).toBe("active");
    expect(panels[1].getAttribute("data-state")).toBe("active");
    expect(panels[0].getAttribute("data-state")).toBe("inactive");
  });

  it("ships the CTA pair on both tabs — Join Pilot to the participation form", async () => {
    await renderAbout();

    const links = screen.getAllByRole("link");

    const joinPilot = links.filter((link) => link.textContent?.trim() === "Join Pilot");
    expect(joinPilot).toHaveLength(2);
    joinPilot.forEach((link) => {
      expect(link.getAttribute("href")).toContain("forms.app");
      expect(link.getAttribute("target")).toBe("_blank");
    });

    const getInvolved = links.filter((link) => link.textContent?.trim() === "Get Involved");
    expect(getInvolved).toHaveLength(2);
    getInvolved.forEach((link) => {
      expect(link.getAttribute("href")).toBe("/#get-involved");
    });
  });

  it("ships both announcements — the Lisbon clinic partnership and the Santa Casa workshops", async () => {
    await renderAbout();

    // The clinic partnership lives inline on the "What is FreeBrain" tab.
    const mainText = (document.querySelector("main")?.textContent ?? "").replace(
      /\s+/g,
      " ",
    );
    expect(mainText).toContain(
      "Centro de Fisioterapia de Lisboa becomes FreeBrain's first clinic in Lisbon",
    );
    expect(mainText).toContain("Gabriela Fonseca");
    expect(
      document.querySelector('main a[href="https://centrofisioterapialisboa.pt/"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('main video[src*="announce_centrofisioterapialisboa"]'),
    ).not.toBeNull();

    // Santa Casa moved out of the story tab and into a dialog behind this button.
    const trigger = screen.getByRole("button", {
      name: /Stoked to be working with Santa Casa/i,
    });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");

    fireEvent.click(trigger);

    const dialogText = (document.body.textContent ?? "").replace(/\s+/g, " ");
    expect(dialogText).toContain("Jean is personally volunteering with Santa Casa");
    expect(dialogText).toContain("A one-minute sample from one of Jean's workshops");
    expect(document.querySelector('video[src*="announce_santacasa"]')).not.toBeNull();
    expect(
      document.querySelector('video[src*="1minworkshopsample_lisbon"]'),
    ).not.toBeNull();

    // Both announcements now link to the Lisbon Pilot (the footer has its own).
    const pilotLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href="/lisbon-pilot"]'),
    ).filter(
      (link) =>
        (link.closest("main") || link.closest('[role="dialog"]')) &&
        /Lisbon Pilot|Piloto de Lisboa|Lissabon-Pilot/.test(link.textContent ?? ""),
    );
    expect(pilotLinks).toHaveLength(2);
  });

  it("keeps every link white — the page background is brand blue", async () => {
    await renderAbout();

    // `--background` is #3F3CD5, the same value as `text-brand`, so a brand-blue
    // link on this page renders blue-on-blue and disappears.
    const links = Array.from(document.querySelectorAll("main a"));
    expect(links.length).toBeGreaterThan(0);

    // CTA buttons carry their own background (white/blue), so they are exempt.
    const ctas = links.filter((link) =>
      /Join Pilot|Get Involved|Try Bunny Demo/.test(link.textContent ?? ""),
    );
    expect(ctas).toHaveLength(5);
    ctas.forEach((link) => expect(link.className).toMatch(/bg-(primary|secondary|brand)/));
    // The blue "Try Bunny Demo" CTA under the audiences copy.
    expect(
      document.querySelector('main a[href="/bunny-challenge#bunny-escape-challenge"]'),
    ).not.toBeNull();

    // Breadcrumb links sit in a muted nav row and rely on hover for contrast.
    const breadcrumb = document.querySelector('nav[aria-label="breadcrumb"] a');
    expect(breadcrumb).not.toBeNull();
    expect(breadcrumb?.className).toContain("hover:text-foreground");

    // The white announcement cards invert the rule — see below.
    const onWhiteCard = (link: Element) =>
      link.closest('[data-surface="white"]') !== null;

    const inline = links.filter(
      (link) =>
        !/Join Pilot|Get Involved|Try Bunny Demo/.test(link.textContent ?? "") &&
        !link.closest('nav[aria-label="breadcrumb"]') &&
        !onWhiteCard(link),
    );
    expect(inline.length).toBeGreaterThan(0);
    inline.forEach((link) => {
      expect(link.className).not.toContain("text-brand");
      // --muted-foreground is a near-white tint, so it stays readable too.
      expect(link.className).toMatch(/text-(foreground|muted-foreground)/);
      expect(link.className).toContain("underline");
    });

    // Same trap for the quote's accent stripe: brand blue on brand blue.
    const main = document.querySelector("main");
    const onBlueSurface = (element: Element) => !onWhiteCard(element);
    Array.from(main?.querySelectorAll("*") ?? [])
      .filter(
        (element) =>
          typeof element.className === "string" &&
          /text-brand|border-brand/.test(element.className),
      )
      .forEach((element) => expect(onBlueSurface(element)).toBe(true));

    // …but the announcement cards are white, so their links flip to brand blue.
    const cardLinks = links.filter(onWhiteCard);
    expect(cardLinks.length).toBeGreaterThan(0);
    cardLinks.forEach((link) => {
      const isButton = /bg-background|bg-primary/.test(link.className);
      if (isButton) {
        // Blue pill CTA: white label on the brand-blue fill.
        expect(link.className).toMatch(/text-foreground/);
      } else {
        expect(link.className).toMatch(/text-primary-foreground/);
        expect(link.className).toContain("underline");
      }
    });
  });

  it("lists the evidence citations as clickable sources in the page header", async () => {
    await renderAbout();

    // The two studies never appear inside the prose.
    const prose = Array.from(document.querySelectorAll("main p"))
      .map((p) => p.textContent ?? "")
      .join(" ");
    expect(prose).not.toContain("Noetel");
    expect(prose).not.toContain("Lötzke");

    const external = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("main ol a"),
    ).filter(
      (link) => link.href.includes("bmj.com") || link.href.includes("ncbi.nlm.nih.gov"),
    );

    expect(external).toHaveLength(2);
    const citationBlock = external[0].closest("ol");
    expect(citationBlock).not.toBeNull();
    // The shared byline from /movement-planner and /movements fronts the list.
    expect(citationBlock?.previousElementSibling?.textContent).toContain(
      "FreeBrain Research Team",
    );

    // The sources sit in the header: below the byline, above the tabs and H1.
    const tablist = document.querySelector('[role="tablist"]');
    const h1 = document.querySelector("main h1");
    expect(tablist).not.toBeNull();
    expect(h1).not.toBeNull();
    const FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;
    expect((citationBlock?.compareDocumentPosition(tablist) ?? 0) & FOLLOWING).toBeTruthy();
    expect((citationBlock?.compareDocumentPosition(h1) ?? 0) & FOLLOWING).toBeTruthy();

    external.forEach((link) => {
      expect(link.closest("p")).toBeNull();
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.className).toContain("text-foreground");
    });
  });

  it("ships FAQPage JSON-LD whose questions match the visible FAQ", async () => {
    await renderAbout();

    const faq = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((script) => {
        try {
          return JSON.parse(script.textContent ?? "null") as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .find((entry) => entry?.["@type"] === "FAQPage");

    const questions = (faq?.mainEntity as Array<{ name: string }>) ?? [];
    expect(questions.length).toBeGreaterThanOrEqual(4);

    const visibleTerms = (document.querySelector("main")?.textContent ?? "").replace(
      /\s+/g,
      " ",
    );
    questions.forEach((question) => {
      expect(visibleTerms).toContain(question.name);
      // long-tail buckets A/B/C from the growth strategy doc
      expect(
        /Parkinson|neurological|movement therapy/i.test(question.name),
      ).toBe(true);
    });
  });

  it("ships a Person JSON-LD for the founder", async () => {
    await renderAbout();

    const person = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((script) => {
        try {
          return JSON.parse(script.textContent ?? "null") as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .find((entry) => entry?.["@type"] === "Person");

    expect(person?.name).toBe("Jean");
    expect(person?.url).toBe("https://www.freethebrains.com/about");
  });
});
