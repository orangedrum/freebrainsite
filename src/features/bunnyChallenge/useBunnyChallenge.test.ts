import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getBeatIntervalMs, useBunnyChallenge } from "./useBunnyChallenge";

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
    expect(getBeatIntervalMs(0)).toBe(5000);
    expect(getBeatIntervalMs(1)).toBe(4000);
    expect(getBeatIntervalMs(2)).toBe(3750);
    expect(getBeatIntervalMs(3)).toBe(3500);
    expect(getBeatIntervalMs(4)).toBe(3300);
    expect(getBeatIntervalMs(5)).toBe(3000);
    expect(getBeatIntervalMs(6)).toBe(3000);
    expect(getBeatIntervalMs(10)).toBe(3000);
    expect(getBeatIntervalMs(11)).toBe(2800);
    expect(getBeatIntervalMs(21)).toBe(1000);
    expect(getBeatIntervalMs(30)).toBe(1000);

    act(() => result.current.stopChallenge());
    const stoppedPattern = result.current.pattern;
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.pattern).toBe(stoppedPattern);
  });
});
