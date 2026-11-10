// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import english from "@/locales/en/common.json";
import { BunnyChallengeIntro } from "./BunnyChallengeIntro";

const testI18n = createInstance();

beforeAll(async () => {
  await testI18n.init({
    lng: "en",
    resources: { en: { translation: english } },
    interpolation: { escapeValue: false },
  });
});

const renderIntro = () => {
  const onGo = vi.fn();
  render(
    <I18nextProvider i18n={testI18n}>
      <BunnyChallengeIntro onGo={onGo} />
    </I18nextProvider>,
  );
  return { onGo };
};

describe("BunnyChallengeIntro", () => {
  it("keeps the hands setup and the Begin Challenge step", () => {
    renderIntro();

    expect(screen.getByRole("heading", { name: "Prepare Yourself" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "You'll Need Both Hands" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Begin Challenge" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Go/ })).toBeInTheDocument();
  });

  it("no longer shows the record opt-in — that choice moved to the prompt", () => {
    renderIntro();

    expect(screen.queryByText(/Option to record/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your camera and the challenge will be recorded without audio.",
      ),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("hands the Go press to the record prompt", () => {
    const { onGo } = renderIntro();

    fireEvent.click(screen.getByRole("button", { name: /Go/ }));
    expect(onGo).toHaveBeenCalledTimes(1);
  });
});
