export interface LeaderboardEntry {
  initials: string;
  elapsed_ms: number;
}

export type LeaderboardServiceErrorCode =
  | "leaderboardNotConfigured"
  | "leaderboardLoadFailed"
  | "leaderboardSubmitFailed";

export class LeaderboardServiceError extends Error {
  constructor(readonly code: LeaderboardServiceErrorCode) {
    super(code);
    this.name = "LeaderboardServiceError";
  }
}

const TABLE_NAME = "bunny_challenge_scores";
const MAX_ELAPSED_MS = 86_400_000;

const normalizeInitials = (value: string): string => value.trim().toUpperCase();

export const isValidInitials = (value: string): boolean =>
  /^[A-Z]{1,3}$/.test(normalizeInitials(value));

export const isValidElapsedTime = (elapsedMs: number): boolean =>
  Number.isSafeInteger(elapsedMs) && elapsedMs > 0 && elapsedMs <= MAX_ELAPSED_MS;

export const getNormalizedInitials = (value: string): string =>
  normalizeInitials(value);

const getSupabaseCredentials = (): { url: string; key: string } => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key =
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    throw new LeaderboardServiceError("leaderboardNotConfigured");
  }
  try {
    const parsedUrl = new URL(url);
    const isLocalHttp =
      parsedUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname);
    if (parsedUrl.protocol !== "https:" && !isLocalHttp) {
      throw new LeaderboardServiceError("leaderboardNotConfigured");
    }
  } catch (error) {
    if (error instanceof LeaderboardServiceError) throw error;
    throw new LeaderboardServiceError("leaderboardNotConfigured");
  }
  return { url, key };
};

const createHeaders = (key: string): HeadersInit => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
});

const isLeaderboardEntry = (value: unknown): value is LeaderboardEntry => {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.initials === "string" &&
    isValidInitials(entry.initials) &&
    typeof entry.elapsed_ms === "number" &&
    isValidElapsedTime(entry.elapsed_ms)
  );
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  let credentials: { url: string; key: string };
  try {
    credentials = getSupabaseCredentials();
  } catch (error) {
    if (error instanceof LeaderboardServiceError) throw error;
    throw new LeaderboardServiceError("leaderboardLoadFailed");
  }

  const query = new URLSearchParams({
    select: "initials,elapsed_ms",
    order: "elapsed_ms.asc",
    limit: "10",
  });

  try {
    const response = await fetch(
      `${credentials.url}/rest/v1/${TABLE_NAME}?${query.toString()}`,
      { headers: createHeaders(credentials.key) },
    );
    if (!response.ok) throw new LeaderboardServiceError("leaderboardLoadFailed");
    const result: unknown = await response.json();
    if (!Array.isArray(result) || !result.every(isLeaderboardEntry)) {
      throw new LeaderboardServiceError("leaderboardLoadFailed");
    }
    return result;
  } catch (error) {
    if (error instanceof LeaderboardServiceError) throw error;
    throw new LeaderboardServiceError("leaderboardLoadFailed");
  }
};

export const submitLeaderboardScore = async (
  initials: string,
  elapsedMs: number,
): Promise<void> => {
  const normalizedInitials = normalizeInitials(initials);
  if (!isValidInitials(normalizedInitials) || !isValidElapsedTime(elapsedMs)) {
    throw new LeaderboardServiceError("leaderboardSubmitFailed");
  }

  let credentials: { url: string; key: string };
  try {
    credentials = getSupabaseCredentials();
  } catch (error) {
    if (error instanceof LeaderboardServiceError) throw error;
    throw new LeaderboardServiceError("leaderboardSubmitFailed");
  }

  try {
    const response = await fetch(
      `${credentials.url}/rest/v1/${TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          ...createHeaders(credentials.key),
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ initials: normalizedInitials, elapsed_ms: elapsedMs }),
      },
    );
    if (!response.ok) {
      throw new LeaderboardServiceError("leaderboardSubmitFailed");
    }
  } catch (error) {
    if (error instanceof LeaderboardServiceError) throw error;
    throw new LeaderboardServiceError("leaderboardSubmitFailed");
  }
};
