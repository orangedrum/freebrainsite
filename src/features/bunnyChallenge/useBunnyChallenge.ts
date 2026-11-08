import { useEffect, useRef, useState } from "react";

export type BunnyChallengePhase =
  | "intro"
  | "countdown"
  | "playing"
  | "result";

export type BunnyChallengePattern = "bunnyLeft" | "bunnyRight";

const COUNTDOWN_START = 3;

/** Hard stop for both the challenge and its recording. */
export const CHALLENGE_LIMIT_MS = 90_000;
/** The original rhythm is kept verbatim until this mark… */
const RAMP_START_MS = 30_000;
/** …then eases from this interval down to RAMP_END_INTERVAL_MS… */
const RAMP_START_INTERVAL_MS = 3000;
const RAMP_END_INTERVAL_MS = 500;
/**
 * …reaching it just before the limit rather than exactly on it. Anchoring the
 * ease to the cap itself would leave the final scheduled beat at ~513ms, since
 * the schedule stops generating once it passes the limit; easing to 88s lets
 * the run actually sit at 500ms for the last stretch before it ends.
 */
const RAMP_END_MS = 88_000;

const BASE_BEAT_INTERVALS_MS = [
  5000, 4000, 3750, 3500, 3300, 3000, 2800, 2600, 2400, 2200, 2000, 1800, 1600,
  1400, 1200, 1000,
];
const THREE_SECOND_BEATS = 5;

const getBaseIntervals = (): number[] => {
  const firstThreeSecondBeatIndex = BASE_BEAT_INTERVALS_MS.indexOf(3000);
  return [
    ...BASE_BEAT_INTERVALS_MS.slice(0, firstThreeSecondBeatIndex + 1),
    ...Array.from({ length: THREE_SECOND_BEATS }, () => 3000),
    ...BASE_BEAT_INTERVALS_MS.slice(firstThreeSecondBeatIndex + 1),
  ];
};

/** Interval for a beat that starts at `elapsedMs`, once past the 30s mark. */
const getRampIntervalMs = (elapsedMs: number): number => {
  const progress = Math.min(
    Math.max((elapsedMs - RAMP_START_MS) / (RAMP_END_MS - RAMP_START_MS), 0),
    1,
  );
  return Math.round(
    RAMP_START_INTERVAL_MS + (RAMP_END_INTERVAL_MS - RAMP_START_INTERVAL_MS) * progress,
  );
};

/**
 * Builds the full schedule up to the 90s limit: the original accelerating
 * rhythm while the clock is under 30s, then a linear ease down to a 0.5s flip
 * just before the limit. Solved forward from elapsed time so the ramp stays
 * anchored to the clock rather than to a beat count.
 */
const buildBeatIntervals = (): number[] => {
  const baseIntervals = getBaseIntervals();
  const intervals: number[] = [];
  let elapsedMs = 0;
  let baseIndex = 0;

  while (elapsedMs < CHALLENGE_LIMIT_MS) {
    const interval =
      elapsedMs < RAMP_START_MS
        ? baseIntervals[Math.min(baseIndex, baseIntervals.length - 1)]
        : getRampIntervalMs(elapsedMs);
    intervals.push(interval);
    elapsedMs += interval;
    baseIndex += 1;
  }

  return intervals;
};
const CHALLENGE_BEAT_INTERVALS_MS = buildBeatIntervals();

export const getBeatIntervalMs = (beatIndex: number): number => {
  return CHALLENGE_BEAT_INTERVALS_MS[
    Math.min(beatIndex, CHALLENGE_BEAT_INTERVALS_MS.length - 1)
  ];
};

export const useBunnyChallenge = () => {
  const [phase, setPhase] = useState<BunnyChallengePhase>("intro");
  const [pattern, setPattern] = useState<BunnyChallengePattern>("bunnyRight");
  const [beatIndex, setBeatIndex] = useState(0);
  const [countdownValue, setCountdownValue] = useState(COUNTDOWN_START);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "countdown") return;

    const timeoutId = window.setTimeout(() => {
      if (countdownValue <= 1) {
        startedAtRef.current = performance.now();
        setCountdownValue(0);
        setPhase("playing");
        return;
      }

      setCountdownValue((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [countdownValue, phase]);

  useEffect(() => {
    const startedAt = startedAtRef.current;
    if (phase !== "playing" || startedAt === null) return;

    const intervalId = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const timeoutId = window.setTimeout(() => {
      setPattern((currentPattern) =>
        currentPattern === "bunnyRight" ? "bunnyLeft" : "bunnyRight",
      );
      setBeatIndex((currentBeatIndex) => currentBeatIndex + 1);
    }, getBeatIntervalMs(beatIndex));

    return () => window.clearTimeout(timeoutId);
  }, [beatIndex, phase]);

  // Hard stop at the 90s limit: ends the run and freezes the displayed time
  // exactly at the cap instead of drifting a few tenths past it.
  useEffect(() => {
    if (phase !== "playing" || elapsedMs < CHALLENGE_LIMIT_MS) return;
    stopChallenge();
    // stopChallenge reads phase/startedAtRef only; both are stable here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedMs, phase]);

  const startChallenge = (): void => {
    setElapsedMs(0);
    setPattern("bunnyRight");
    setBeatIndex(0);
    setCountdownValue(COUNTDOWN_START);
    setPhase("countdown");
  };

  const stopChallenge = (): void => {
    if (phase !== "playing" || startedAtRef.current === null) return;

    setElapsedMs(
      Math.min(performance.now() - startedAtRef.current, CHALLENGE_LIMIT_MS),
    );
    setPhase("result");
  };

  const resetChallenge = (): void => {
    startedAtRef.current = null;
    setElapsedMs(0);
    setCountdownValue(COUNTDOWN_START);
    setPattern("bunnyRight");
    setBeatIndex(0);
    setPhase("intro");
  };

  return {
    countdownValue,
    elapsedMs,
    pattern,
    beatIndex,
    phase,
    resetChallenge,
    startChallenge,
    stopChallenge,
  };
};
