// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import english from "@/locales/en/common.json";
import { BunnyChallengeRecordPrompt } from "./BunnyChallengeRecordPrompt";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

const testI18n = createInstance();

beforeAll(async () => {
  await testI18n.init({
    lng: "en",
    resources: { en: { translation: english } },
    interpolation: { escapeValue: false },
  });
});

const idleController = {
  status: "idle",
  error: null,
  support: { error: null },
} as unknown as RecordingController;

const controllerWith = (
  overrides: Partial<{
    status: RecordingController["status"];
    error: RecordingController["error"];
    support: { error: RecordingController["support"]["error"] };
  }>,
): RecordingController =>
  ({
    ...idleController,
    ...overrides,
    support: { ...idleController.support, ...overrides.support },
  }) as RecordingController;

const renderPrompt = (controller: RecordingController = idleController) => {
  const handlers = {
    onRecord: vi.fn(),
    onSkip: vi.fn(),
    onOpenChange: vi.fn(),
  };
  render(
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter>
        <BunnyChallengeRecordPrompt
          open
          controller={controller}
          {...handlers}
        />
      </MemoryRouter>
    </I18nextProvider>,
  );
  return handlers;
};

describe("BunnyChallengeRecordPrompt", () => {
  it("asks for the recording choice with the consent copy and terms link", () => {
    renderPrompt();

    expect(
      screen.getByRole("dialog", {
        name: "Option to record to share FreeBrain to your network",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Challenge your friends and help Free the Brains everywhere.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your camera and the challenge will be recorded without audio.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Terms & Service" }),
    ).toHaveAttribute("href", "/terms");
    expect(
      screen.getByRole("button", { name: "Record Me" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Don't Record Me" }),
    ).toBeInTheDocument();
  });

  it("routes each button to its own start path", () => {
    const { onRecord, onSkip } = renderPrompt();

    fireEvent.click(screen.getByRole("button", { name: "Record Me" }));
    expect(onRecord).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Don't Record Me" }));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onRecord).toHaveBeenCalledTimes(1);
  });

  it("locks the choice while the camera request is in flight", () => {
    const { onRecord, onSkip, onOpenChange } = renderPrompt(
      controllerWith({ status: "requesting" }),
    );

    expect(screen.getByText("Thanks! 💞")).toBeInTheDocument();
    expect(
      screen.getByText("Starting the camera and local recording…"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Record Me" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Don't Record Me" }),
    ).toBeDisabled();

    // Dismissing mid-request would start the run behind a closed modal.
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    expect(onRecord).not.toHaveBeenCalled();
    expect(onSkip).not.toHaveBeenCalled();
  });

  it("can still be dismissed once the request has settled", () => {
    const { onOpenChange } = renderPrompt();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps Don't Record Me live when the browser cannot record", () => {
    renderPrompt(
      controllerWith({
        support: { error: "recordingRecorderUnavailable" },
      }),
    );

    expect(
      screen.getByText(
        "This browser does not support video recording. You can still play without recording.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Record Me" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Don't Record Me" }),
    ).toBeEnabled();
  });

  it("surfaces a runtime recording error next to the choice", () => {
    renderPrompt(
      controllerWith({ error: "recordingPermissionDenied" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Camera permission was denied or blocked.",
    );
    expect(
      screen.getByRole("button", { name: "Don't Record Me" }),
    ).toBeEnabled();
  });
});
