import { isIP } from "node:net";
import {
  createPilotConfirmationEmail,
  createPilotRecordEmail,
  sendPilotEmail,
} from "./pilotSignupEmails.js";
import { validatePilotSignup } from "./pilotSignupValidation.js";

const MAX_BODY_LENGTH = 16_384;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 10_000;

interface RateLimitEntry {
  count: number;
  windowStartedAt: number;
}

const rateLimitByIp = new Map<string, RateLimitEntry>();

const getJsonResponse = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const readLimitedBody = async (request: Request): Promise<string | null> => {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_LENGTH) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bodyBytes);
};

const getClientIp = (request: Request): string | null => {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && isIP(realIp)) return realIp;

  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedIp && isIP(forwardedIp) ? forwardedIp : null;
};

const isAllowedOrigin = (request: Request): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

const allowRequest = (ipAddress: string, now: number): boolean => {
  const current = rateLimitByIp.get(ipAddress);
  if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    if (rateLimitByIp.size >= MAX_TRACKED_IPS) {
      for (const [trackedIp, entry] of rateLimitByIp) {
        if (now - entry.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
          rateLimitByIp.delete(trackedIp);
        }
      }
      if (rateLimitByIp.size >= MAX_TRACKED_IPS) return false;
    }
    rateLimitByIp.set(ipAddress, { count: 1, windowStartedAt: now });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
};

export const handlePilotSignup = async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return getJsonResponse(405, { error: "method_not_allowed" });
  }
  if (!isAllowedOrigin(request)) {
    return getJsonResponse(403, { error: "origin_not_allowed" });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return getJsonResponse(415, { error: "unsupported_media_type" });
  }

  const ipAddress = getClientIp(request);
  if (!ipAddress) return getJsonResponse(400, { error: "request_metadata_unavailable" });
  if (!allowRequest(ipAddress, Date.now())) {
    return getJsonResponse(429, { error: "rate_limited" });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_LENGTH) {
    return getJsonResponse(413, { error: "payload_too_large" });
  }

  let body: string | null;
  try {
    body = await readLimitedBody(request);
  } catch {
    return getJsonResponse(400, { error: "invalid_request_body" });
  }
  if (body === null) return getJsonResponse(413, { error: "payload_too_large" });

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return getJsonResponse(400, { error: "invalid_json" });
  }

  const submission = validatePilotSignup(payload);
  if (!submission) return getJsonResponse(400, { error: "invalid_submission" });

  const submittedAt = new Date().toISOString();

  // Written before any outbound email so a crash, a function timeout, or a
  // filtered notification can never silently drop a partner sign-up: the full
  // payload stays recoverable from Vercel -> Logs either way.
  console.log(
    JSON.stringify({
      event: "pilot_signup_received",
      submittedAt,
      ipAddress,
      submission,
    }),
  );

  const auditFailure = (outcome: string, detail?: string): void => {
    console.error(
      JSON.stringify({
        event: "pilot_signup_failed",
        outcome,
        ...(detail ? { detail } : {}),
        submittedAt,
        ipAddress,
      }),
    );
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    auditFailure("email_service_unavailable", "RESEND_API_KEY is not configured");
    return getJsonResponse(503, { error: "email_service_unavailable" });
  }

  try {
    const recordSent = await sendPilotEmail(
      apiKey,
      createPilotRecordEmail(submission, submittedAt, ipAddress),
    );
    if (!recordSent) {
      auditFailure("record_email_failed");
      return getJsonResponse(502, { error: "record_email_failed" });
    }

    const confirmationSent = await sendPilotEmail(
      apiKey,
      createPilotConfirmationEmail(submission),
    );
    if (!confirmationSent) {
      auditFailure("confirmation_email_failed_record_sent");
      return getJsonResponse(502, { error: "confirmation_email_failed_record_sent" });
    }
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    auditFailure("email_delivery_failed", errorName);
    return getJsonResponse(502, { error: "email_delivery_failed" });
  }

  return getJsonResponse(200, { status: "emails_queued" });
};
