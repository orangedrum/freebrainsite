// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import english from "@/locales/en/common.json";
import { PilotSignupForm } from "./PilotSignupForm";
import { isTangoSignup } from "./pilotSignupFormUtils";

const testI18n = createInstance();

const renderForm = (isTangoProgram = false) =>
  render(
    <I18nextProvider i18n={testI18n}>
      <MemoryRouter>
        <PilotSignupForm isTangoProgram={isTangoProgram} />
      </MemoryRouter>
    </I18nextProvider>,
  );

beforeAll(async () => {
  await testI18n.init({
    lng: "en",
    resources: { en: { translation: english } },
    interpolation: { escapeValue: false },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PilotSignupForm", () => {
  it("uses the tango program flag only when the query parameter is exactly enabled", () => {
    expect(isTangoSignup("")).toBe(false);
    expect(isTangoSignup("?program=tango")).toBe(true);
    expect(isTangoSignup("?program=other")).toBe(false);
  });

  it("shows tango consent only when enabled for the form context", () => {
    const { rerender } = renderForm();
    expect(screen.queryByRole("checkbox", { name: /four free tango sessions/i })).toBeNull();

    rerender(
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter>
          <PilotSignupForm isTangoProgram />
        </MemoryRouter>
      </I18nextProvider>,
    );
    const tangoOptIn = screen.getByRole("checkbox", { name: /four free tango sessions/i });
    const mediaConsent = screen.getByRole("checkbox", { name: /photos and videos of me/i });
    const brandingConsent = screen.getByRole("checkbox", {
      name: /using my institution's name/i,
    });
    expect(tangoOptIn).toBeInTheDocument();
    expect(mediaConsent).toBeDisabled();
    expect(brandingConsent).toBeDisabled();

    fireEvent.click(tangoOptIn);
    expect(mediaConsent).toBeEnabled();
    expect(mediaConsent).toHaveAttribute("aria-required", "true");
    fireEvent.click(mediaConsent);
    fireEvent.click(tangoOptIn);
    expect(mediaConsent).toBeDisabled();
    expect(mediaConsent).toHaveAttribute("data-state", "unchecked");
  });

  it("requires Terms acceptance and sends the localized consent fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "emails_queued" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { container } = renderForm(true);

    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+351 912 345 678" },
    });

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please accept the Terms");
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("checkbox", { name: /I have read and agree/i }));
    fireEvent.submit(form!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      termsAccepted: true,
      tangoOptIn: false,
      mediaConsent: false,
      brandingConsent: false,
      locale: "en",
    });
    expect(await screen.findByText(/your signup was received/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book your four sessions/i })).toHaveAttribute(
      "href",
      "https://calendly.com/jean-kaluza/app-idea-day-1-facilitation-clone",
    );
  });

  it("explains when a local preview returns the Vite HTML 404 instead of the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<!doctype html>", {
          status: 404,
          headers: { "content-type": "text/html" },
        }),
      ),
    );
    const { container } = renderForm();
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+351 912 345 678" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /I have read and agree/i }));

    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "signup API isn't available at this address",
    );
    expect(screen.getByRole("link", { name: /contact Jean on WhatsApp/i })).toHaveAttribute(
      "href",
      "https://wa.me/351913515202",
    );
  });

  it("explains when the local API is running without email credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "email_service_unavailable" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const { container } = renderForm();
    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+351 912 345 678" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /I have read and agree/i }));
    fireEvent.submit(container.querySelector("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "email service isn't configured for this preview",
    );
    expect(screen.getByRole("link", { name: /contact Jean on WhatsApp/i })).toBeInTheDocument();
  });
});
