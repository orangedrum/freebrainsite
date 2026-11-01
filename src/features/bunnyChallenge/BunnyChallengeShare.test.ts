import { describe, expect, it, vi } from "vitest";
import {
  createChallengeCaption,
  createShareData,
  formatChallengeElapsedTime,
  supportsNativeShare,
} from "./bunnyChallengeSharing";

describe("Bunny Challenge sharing", () => {
  it("formats the exact displayed elapsed time", () => {
    expect(formatChallengeElapsedTime(12_590)).toBe("00:12.5");
  });

  it("creates the caption with the challenge URL and score", () => {
    expect(
      createChallengeCaption(
        "00:08.3 sec",
        "https://freebrainsite-fani4x4mh-jeans-projects-3cddd625.vercel.app/bunny-challenge",
        "I just did the FreeBrain Bunny Challenge and lasted {{time}}! Can you beat me? Try gamified neuro health for every neurological and cognitive condition: {{url}} #freethebrains",
      ),
    ).toBe(
      "I just did the FreeBrain Bunny Challenge and lasted 00:08.3 sec! Can you beat me? Try gamified neuro health for every neurological and cognitive condition: https://freebrainsite-fani4x4mh-jeans-projects-3cddd625.vercel.app/bunny-challenge #freethebrains",
    );
  });

  it("detects when the native share sheet is unavailable", () => {
    expect(supportsNativeShare(undefined)).toBe(false);
    expect(supportsNativeShare(vi.fn())).toBe(true);
  });

  it("shares the video file only when the browser supports file sharing", () => {
    const file = new File(["video"], "challenge.webm", { type: "video/webm" });
    const baseData: ShareData = { text: "caption https://example.com" };
    const canShareFiles = vi.fn(() => true);

    expect(createShareData(baseData, file, canShareFiles)).toEqual({
      ...baseData,
      files: [file],
    });
    expect(createShareData(baseData, file, vi.fn(() => false))).toEqual(baseData);
    expect(createShareData(baseData, file, undefined)).toEqual(baseData);
    expect(createShareData(baseData, null, canShareFiles)).toEqual(baseData);
    expect(createShareData(baseData, file, vi.fn(() => {
      throw new Error("unsupported");
    }))).toEqual(baseData);
    expect(canShareFiles).toHaveBeenCalledWith({
      ...baseData,
      files: [file],
    });
  });
});
