import { describe, expect, it } from "vitest";
import {
  BUNNY_CHALLENGE_URL,
  createChallengeCaption,
  formatChallengeElapsedTime,
} from "./bunnyChallengeSharing";

describe("Bunny Challenge sharing", () => {
  it("formats the exact displayed elapsed time", () => {
    expect(formatChallengeElapsedTime(12_590)).toBe("00:12.5");
  });

  it("creates the caption with the challenge URL and score", () => {
    expect(
      createChallengeCaption(
        "00:08.3 sec",
        BUNNY_CHALLENGE_URL,
        "I just did the FreeBrain Bunny Challenge and lasted {{time}}! Can you beat me? Try gamified neuro health for every neurological and cognitive condition: {{url}} #freethebrains",
      ),
    ).toBe(
      "I just did the FreeBrain Bunny Challenge and lasted 00:08.3 sec! Can you beat me? Try gamified neuro health for every neurological and cognitive condition: https://www.freethebrains.com/bunny-challenge #freethebrains",
    );
  });

  it("uses the permanent FreeBrain challenge URL", () => {
    expect(BUNNY_CHALLENGE_URL).toBe("https://www.freethebrains.com/bunny-challenge");
  });
});
