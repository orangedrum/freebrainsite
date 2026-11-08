import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CHALLENGE_LIMIT_MS,
  getBeatIntervalMs,
  useBunnyChallenge,
} from "./useBunnyChallenge";

const advanceCountdown = (): void => {
  for (let second = 0; second < 3; second += 1) {
    act(() => vi.advanceTimersByTime(1000));
  }
};

describe("useBunnyChallenge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down before starting the timer", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    expect(result.current.phase).toBe("intro");
    act(() => result.current.startChallenge());
    expect(result.current.phase).toBe("countdown");

    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(999));
    expect(result.current.phase).toBe("countdown");
    expect(result.current.countdownValue).toBe(1);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.phase).toBe("playing");
    expect(result.current.elapsedMs).toBe(0);
  });

  it("freezes elapsed time and shows the result when stopped", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    advanceCountdown();
    act(() => vi.advanceTimersByTime(1200));
    act(() => result.current.stopChallenge());

    expect(result.current.phase).toBe("result");
    expect(result.current.elapsedMs).toBe(1200);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.elapsedMs).toBe(1200);

    act(() => result.current.resetChallenge());
    expect(result.current.phase).toBe("intro");
    expect(result.current.elapsedMs).toBe(0);
  });

  it("alternates the poses on an accelerating rhythm and stops changing after STOP", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    advanceCountdown();
    expect(result.current.phase).toBe("playing");
    expect(result.current.pattern).toBe("bunnyRight");

    act(() => vi.advanceTimersByTime(4999));
    expect(result.current.pattern).toBe("bunnyRight");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.pattern).toBe("bunnyLeft");

    act(() => vi.advanceTimersByTime(4000));
    expect(result.current.pattern).toBe("bunnyRight");
    act(() => vi.advanceTimersByTime(3750));
    expect(result.current.pattern).toBe("bunnyLeft");
    // The original rhythm is preserved beat-for-beat up to the 30s mark.
    expect(getBeatIntervalMs(0)).toBe(5000);
    expect(getBeatIntervalMs(1)).toBe(4000);
    expect(getBeatIntervalMs(2)).toBe(3750);
    expect(getBeatIntervalMs(3)).toBe(3500);
    expect(getBeatIntervalMs(4)).toBe(3300);
    expect(getBeatIntervalMs(5)).toBe(3000);
    expect(getBeatIntervalMs(6)).toBe(3000);
    expect(getBeatIntervalMs(8)).toBe(3000);
    // Past 30s it eases down monotonically toward a 0.5s flip at the 90s cap.
    expect(getBeatIntervalMs(9)).toBe(2933);
    expect(getBeatIntervalMs(10)).toBe(2807);
    expect(getBeatIntervalMs(10)).toBeLessThan(getBeatIntervalMs(9));
    expect(getBeatIntervalMs(30)).toBe(1163);
    expect(getBeatIntervalMs(100)).toBe(500);

    act(() => result.current.stopChallenge());
    const stoppedPattern = result.current.pattern;
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.pattern).toBe(stoppedPattern);
  });

  it("eases the flip interval down after 30s and never exceeds 3000ms again", () => {
    let previous = getBeatIntervalMs(8);
    for (let beatIndex = 9; beatIndex < 60; beatIndex += 1) {
      const interval = getBeatIntervalMs(beatIndex);
      expect(interval).toBeLessThanOrEqual(previous);
      expect(interval).toBeLessThanOrEqual(3000);
      previous = interval;
    }
    expect(previous).toBe(500);
  });

  it("auto-stops at the 90s limit and freezes the time exactly on it", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    advanceCountdown();
    expect(result.current.phase).toBe("playing");

    act(() => vi.advanceTimersByTime(CHALLENGE_LIMIT_MS + 500));

    expect(result.current.phase).toBe("result");
    expect(result.current.elapsedMs).toBe(CHALLENGE_LIMIT_MS);

    // Time stays frozen at the cap rather than ticking past it.
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.elapsedMs).toBe(CHALLENGE_LIMIT_MS);
    expect(result.current.phase).toBe("result");
  });
});
