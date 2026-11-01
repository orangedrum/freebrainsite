import { describe, expect, it, vi } from "vitest";
import {
  createChallengeCaption,
  createShareData,
  formatChallengeElapsedTime,
  supportsNativeShare,
  supportsFileSharing,
} from "./bunnyChallengeSharing";

describe("Bunny Challenge sharing", () => {
  it("formats the exact displayed elapsed time", () => {
    expect(formatChallengeElapsedTime(12_590)).toBe("00:12.5");
  });

  it("creates the caption with the challenge URL and score", () => {
    expect(
      createChallengeCaption(
        "12s",
        "https://freethebrains.com/bunny-challenge",
        "I lasted {{time}}! Try it: {{url}} #freethebrains",
      ),
    ).toBe(
      "I lasted 12s! Try it: https://freethebrains.com/bunny-challenge #freethebrains",
    );
  });

  it("detects when the native share sheet is unavailable", () => {
    expect(supportsNativeShare(undefined)).toBe(false);
    expect(supportsNativeShare(vi.fn())).toBe(true);
  });

  it("shares the video file only when the browser supports file sharing", () => {
    const file = new File(["video"], "challenge.webm", { type: "video/webm" });
    const baseData: ShareData = { text: "caption", url: "https://example.com" };
    const canShareFiles = vi.fn(() => true);

    expect(createShareData(baseData, file, canShareFiles)).toEqual({
      ...baseData,
      files: [file],
    });
    expect(createShareData(baseData, file, vi.fn(() => false))).toEqual(baseData);
    expect(createShareData(baseData, file, undefined)).toEqual(baseData);
    expect(createShareData(baseData, null, canShareFiles)).toEqual(baseData);
    expect(supportsFileSharing(file, vi.fn(() => {
      throw new Error("unsupported");
    }))).toBe(false);
  });
});
