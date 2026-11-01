import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getBeatIntervalMs, useBunnyChallenge } from "./useBunnyChallenge";

describe("useBunnyChallenge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down before starting the timer", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    expect(result.current.phase).toBe("countdown");

    act(() => vi.advanceTimersByTime(2999));
    expect(result.current.phase).toBe("countdown");
    expect(result.current.countdownValue).toBe(1);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.phase).toBe("playing");
    expect(result.current.elapsedMs).toBe(0);
  });

  it("freezes elapsed time when stopped and advances through result", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    act(() => vi.advanceTimersByTime(3000));
    act(() => vi.advanceTimersByTime(1200));
    act(() => result.current.stopChallenge());

    expect(result.current.phase).toBe("stopped");
    expect(result.current.elapsedMs).toBe(1200);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.elapsedMs).toBe(1200);

    act(() => result.current.showResult());
    expect(result.current.phase).toBe("result");

    act(() => result.current.resetChallenge());
    expect(result.current.phase).toBe("ready");
    expect(result.current.elapsedMs).toBe(0);
  });

  it("alternates the poses on an accelerating rhythm and stops changing after STOP", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBunnyChallenge());

    act(() => result.current.startChallenge());
    act(() => vi.advanceTimersByTime(3000));
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
    expect(getBeatIntervalMs(15)).toBe(1000);
    expect(getBeatIntervalMs(20)).toBe(1000);

    act(() => result.current.stopChallenge());
    const stoppedPattern = result.current.pattern;
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.pattern).toBe(stoppedPattern);
  });
});
