import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider, Helmet } from "react-helmet-async";

// jsdom without pretendToBeVisual has no rAF; Helmet defers head commits to rAF.
if (typeof window.requestAnimationFrame !== "function") {
  window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0)) as typeof window.requestAnimationFrame;
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => window.requestAnimationFrame(() => resolve()));

/**
 * Regression guard for SEO meta (CLAUDE.md checklist): Helmet must commit
 * title/description/canonical to document.head once a frame is rendered.
 */
describe("react-helmet-async head commits", () => {
  it("applies title, meta description and canonical from <Helmet>", async () => {
    render(
      <HelmetProvider>
        <Helmet>
          <title>Terms &amp; Services | FreeBrain</title>
          <meta name="description" content="FreeBrain Terms & Services." />
          <link rel="canonical" href="https://www.freethebrains.com/terms" />
        </Helmet>
      </HelmetProvider>,
    );

    await nextFrame();

    expect(document.title).toBe("Terms & Services | FreeBrain");
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      "FreeBrain Terms & Services.",
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      "https://www.freethebrains.com/terms",
    );
  });
});
