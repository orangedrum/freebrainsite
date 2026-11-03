// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { handlePilotSignup } from "./pilotSignupApi";

const validSubmission = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+351 912 345 678",
  contactMethod: "whatsapp",
  title: "Director",
  institution: "Lisbon Clinic",
  termsAccepted: true,
  tangoOptIn: true,
  mediaConsent: true,
  brandingConsent: true,
  locale: "en",
};

const createRequest = (
  payload: unknown,
  ipAddress = "203.0.113.10",
  method = "POST",
): Request =>
  new Request("https://www.freethebrains.com/api/pilot-signup", {
    method,
    headers: {
      "content-type": "application/json",
      "x-real-ip": ipAddress,
    },
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });

const mockResend = (statuses: number[] = [200, 200]) => {
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
    const status = statuses.shift() ?? 200;
    return new Response(null, { status });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("handlePilotSignup", () => {
  it("sends a signed record and a confirmation with terms and Calendly links", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchMock = mockResend();

    const response = await handlePilotSignup(createRequest(validSubmission));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "emails_queued" });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const recordRequest = fetchMock.mock.calls[0]?.[1];
    const record = JSON.parse(String(recordRequest?.body));
    expect(record.to).toEqual(["jean@freethebrains.com"]);
    expect(record.text).toContain("IP address: 203.0.113.10");
    expect(record.text).toContain("Terms version: 1.0");
    expect(record.text).toContain("4 free tango sessions: Accepted");

    const confirmationRequest = fetchMock.mock.calls[1]?.[1];
    const confirmation = JSON.parse(String(confirmationRequest?.body));
    expect(confirmation.to).toEqual(["ada@example.com"]);
    expect(confirmation.text).toContain("https://www.freethebrains.com/terms");
    expect(confirmation.text).toContain(
      "https://calendly.com/jean-kaluza/app-idea-day-1-facilitation-clone",
    );
    expect(confirmation.text).toContain("Ada Lovelace");
    expect(record.text).toMatch(/Submitted at \(UTC\): .*Z/);
  });

  it("uses the chosen language and safely escapes submitted content in confirmation HTML", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchMock = mockResend();
    const response = await handlePilotSignup(
      createRequest(
        {
          ...validSubmission,
          fullName: "<Ada>",
          title: "<script>Director</script>",
          institution: "",
          tangoOptIn: false,
          mediaConsent: false,
          brandingConsent: false,
          locale: "pt",
        },
        "203.0.113.19",
      ),
    );

    expect(response.status).toBe(200);
    const confirmation = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));
    expect(confirmation.subject).toContain("Inscrição");
    expect(confirmation.html).toContain("&lt;Ada&gt;");
    expect(confirmation.html).toContain("&lt;script&gt;");
  });

  it("rejects submissions without terms or the complete tango consent cascade", async () => {
    const fetchMock = mockResend();
    const response = await handlePilotSignup(
      createRequest({ ...validSubmission, brandingConsent: false }, "203.0.113.11"),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_submission" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a filled honeypot without sending email", async () => {
    const fetchMock = mockResend();
    const response = await handlePilotSignup(
      createRequest({ ...validSubmission, website: "spam" }, "203.0.113.12"),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects cross-origin submissions", async () => {
    const response = await handlePilotSignup(
      new Request("https://www.freethebrains.com/api/pilot-signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://attacker.example",
          "x-real-ip": "203.0.113.22",
        },
        body: JSON.stringify(validSubmission),
      }),
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "origin_not_allowed" });
  });

  it("rejects a missing contact method and invalid international phone number", async () => {
    const response = await handlePilotSignup(
      createRequest({ ...validSubmission, contactMethod: "" }, "203.0.113.13"),
    );
    expect(response.status).toBe(400);

    const phoneResponse = await handlePilotSignup(
      createRequest({ ...validSubmission, phone: "12345" }, "203.0.113.21"),
    );
    expect(phoneResponse.status).toBe(400);
  });

  it("does not claim success when Resend rejects delivery", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    mockResend([500]);

    const response = await handlePilotSignup(createRequest(validSubmission, "203.0.113.14"));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "record_email_failed" });
  });

  it("reports partial delivery without presenting it as complete", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    const fetchMock = mockResend([200, 500]);

    const response = await handlePilotSignup(createRequest(validSubmission, "203.0.113.15"));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "confirmation_email_failed_record_sent",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid methods and missing email configuration", async () => {
    const methodResponse = await handlePilotSignup(
      createRequest(null, "203.0.113.16", "GET"),
    );
    expect(methodResponse.status).toBe(405);

    const configResponse = await handlePilotSignup(
      createRequest(validSubmission, "203.0.113.17"),
    );
    expect(configResponse.status).toBe(503);
  });

  it("rejects oversized requests before parsing", async () => {
    const request = new Request("https://www.freethebrains.com/api/pilot-signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": "20000",
        "x-real-ip": "203.0.113.20",
      },
      body: JSON.stringify(validSubmission),
    });

    const response = await handlePilotSignup(request);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: "payload_too_large" });
  });

  it("limits repeated submissions per IP for the current function instance", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-resend-key");
    mockResend();
    const ipAddress = "203.0.113.18";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await handlePilotSignup(createRequest(validSubmission, ipAddress));
    }
    const response = await handlePilotSignup(createRequest(validSubmission, ipAddress));

    expect(response.status).toBe(429);
  });
});
