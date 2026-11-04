import { describe, expect, it } from "vitest";
import { MOVEMENTS } from "./movementPageData";

describe("movement videos", () => {
  it("uses the standing video for Independent Standing and the hand exercise otherwise", () => {
    const independentResults = MOVEMENTS.filter(
      (movement) => movement.mobility === "independent",
    );
    const otherResults = MOVEMENTS.filter(
      (movement) => movement.mobility !== "independent",
    );

    expect(independentResults.length).toBeGreaterThan(0);
    expect(independentResults.every((movement) => movement.src === "/ex_standing.mp4")).toBe(true);
    expect(otherResults.length).toBeGreaterThan(0);
    expect(otherResults.every((movement) => movement.src === "/handexercise3.mp4")).toBe(true);
  });
});
