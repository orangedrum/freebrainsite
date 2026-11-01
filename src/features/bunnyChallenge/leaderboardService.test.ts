import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchLeaderboard,
  getNormalizedInitials,
  isValidElapsedTime,
  isValidInitials,
  LeaderboardServiceError,
  submitLeaderboardScore,
} from "./leaderboardService";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Bunny Challenge leaderboard validation", () => {
  it("normalizes and validates one to three initials", () => {
    expect(getNormalizedInitials(" ab ")).toBe("AB");
    expect(isValidInitials("A")).toBe(true);
    expect(isValidInitials("ABC")).toBe(true);
    expect(isValidInitials("ABCD")).toBe(false);
    expect(isValidInitials("A1")).toBe(false);
  });

  it("accepts only positive safe-integer elapsed times up to one day", () => {
    expect(isValidElapsedTime(1)).toBe(true);
    expect(isValidElapsedTime(86_400_000)).toBe(true);
    expect(isValidElapsedTime(0)).toBe(false);
    expect(isValidElapsedTime(86_400_001)).toBe(false);
    expect(isValidElapsedTime(1.5)).toBe(false);
  });

  it("loads only the public initials and elapsed-time fields", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "public-test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ initials: "AB", elapsed_ms: 12500 }]), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchLeaderboard()).resolves.toEqual([
      { initials: "AB", elapsed_ms: 12500 },
    ]);
    expect(fetchMock.mock.calls[0][0]).toContain("select=initials%2Celapsed_ms");
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      apikey: "public-test-key",
      Authorization: "Bearer public-test-key",
    });
  });

  it("accepts the publishable-key environment variable", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "publishable-test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchLeaderboard()).resolves.toEqual([]);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      apikey: "publishable-test-key",
    });
  });

  it("submits only validated initials and elapsed time", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "public-test-key");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await submitLeaderboardScore(" ab ", 12500);

    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual({
      initials: "AB",
      elapsed_ms: 12500,
    });
    await expect(submitLeaderboardScore("BAD!", 12500)).rejects.toMatchObject({
      code: "leaderboardSubmitFailed",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces API failures and missing project configuration", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "public-test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(fetchLeaderboard()).rejects.toBeInstanceOf(LeaderboardServiceError);

    vi.stubEnv("VITE_SUPABASE_URL", "");
    await expect(fetchLeaderboard()).rejects.toMatchObject({
      code: "leaderboardNotConfigured",
    });
  });
});
