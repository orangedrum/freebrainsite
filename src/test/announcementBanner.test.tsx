// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import english from "@/locales/en/common.json";
import { Header } from "@/components/layout/Header";

const testI18n = createInstance();

beforeAll(async () => {
  await testI18n.init({
    lng: "en",
    resources: { en: { translation: english } },
    interpolation: { escapeValue: false },
  });
});

const renderHeader = () =>
  render(
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    </I18nextProvider>,
  );

describe("partnership announcement banner", () => {
  it("sits under the nav with both partner logos and opens a two-tab dialog", () => {
    renderHeader();

    const banner = screen.getByRole("button", {
      name: /One month in Lisbon and already working with/i,
    });
    expect(banner.getAttribute("aria-haspopup")).toBe("dialog");

    // Soft diagonal wash, capped at 56px so it never outgrows the h-16 nav.
    expect(banner.className).toContain("announcement-wash");
    expect(banner.className).toContain("min-h-14");
    expect(banner.className).toContain("w-full");

    // One short white line, no "learn more" link.
    expect(banner.textContent).toContain(
      "One month in Lisbon and already working with",
    );
    expect(banner.textContent).not.toMatch(/learn more/i);
    const [glint, phrase] = Array.from(banner.querySelectorAll("span"));
    expect(glint.className).toContain("announcement-glint");
    expect(glint.getAttribute("aria-hidden")).toBe("true");
    expect(phrase.className).toContain("text-foreground");
    // Not bold.
    expect(phrase.className).not.toMatch(/font-(bold|semibold|extrabold)/);
    // 20% smaller than text-sm / sm:text-base.
    expect(phrase.className).toContain("text-[0.7rem]");
    expect(phrase.className).toContain("sm:text-[0.8rem]");

    const logos = Array.from(banner.querySelectorAll("img")).map((img) =>
      img.getAttribute("src"),
    );
    expect(logos).toEqual(["/logo_santacasa.svg", "/logo_centrofisioterapia.png"]);
    logos.forEach((src) => expect(src).not.toContain("http"));
    // The Santa Casa block mark gets rounded corners.
    expect(banner.querySelector("img")?.className).toContain("rounded-lg");

    // Both marks share one wrapper so they wrap as a unit — full width on
    // the second line below sm, never a lone logo left behind on line one.
    const logoGroup = banner.querySelector("img")?.parentElement;
    expect(logoGroup?.querySelectorAll("img")).toHaveLength(2);
    expect(logoGroup?.className).toContain("basis-full");
    expect(logoGroup?.className).toContain("sm:basis-auto");

    fireEvent.click(banner);

    const dialog = screen.getByRole("dialog");
    const tabs = within(dialog).getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Santa Casa",
      "Centro de Fisioterapia",
    ]);
    // Santa Casa leads, Centro de Fisioterapia follows.
    expect(tabs[0].getAttribute("data-state")).toBe("active");
    expect(within(dialog).getByText(/Jean is personally volunteering with Santa Casa/)).toBeTruthy();

    // Radix Tabs activate on mousedown (automatic activation mode).
    fireEvent.mouseDown(tabs[1]);
    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute("data-state")).toBe("active");
    expect(
      within(dialog).getByText(/becomes FreeBrain's first clinic in Lisbon/),
    ).toBeTruthy();
    expect(
      within(dialog).getByRole("link", { name: /Lisbon Pilot/i }).getAttribute("href"),
    ).toBe("/lisbon-pilot");
  });

  it("carries every announcement video across the two tabs", () => {
    renderHeader();

    fireEvent.click(
      screen.getByRole("button", { name: /One month in Lisbon and already working with/i }),
    );
    const dialog = screen.getByRole("dialog");

    // Tab 1 — Santa Casa card, with the workshop sample player in its footer.
    expect(dialog.querySelector('video[src*="announce_santacasa"]')).not.toBeNull();
    expect(dialog.querySelector('video[src*="1minworkshopsample_lisbon"]')).not.toBeNull();

    // Tab 2 — Centro de Fisioterapia card.
    const tabs = within(dialog).getAllByRole("tab");
    fireEvent.mouseDown(tabs[1]);
    fireEvent.click(tabs[1]);
    expect(dialog.querySelector('video[src*="announce_centrofisioterapialisboa"]')).not.toBeNull();
    expect(
      dialog.querySelector('a[href="https://centrofisioterapialisboa.pt/"]'),
    ).not.toBeNull();
  });
});
