import { useEffect, useRef, useState } from "react";

export type BunnyChallengePhase =
  | "intro"
  | "countdown"
  | "playing"
  | "result";

export type BunnyChallengePattern = "bunnyLeft" | "bunnyRight";

const COUNTDOWN_START = 3;
const BEAT_INTERVALS_MS = [
  5000, 4000, 3750, 3500, 3300, 3000, 2800, 2600, 2400, 2200, 2000, 1800, 1600,
  1400, 1200, 1000,
];
const THREE_SECOND_BEATS = 5;

const getChallengeBeatIntervals = (): number[] => {
  const firstThreeSecondBeatIndex = BEAT_INTERVALS_MS.indexOf(3000);
  return [
    ...BEAT_INTERVALS_MS.slice(0, firstThreeSecondBeatIndex + 1),
    ...Array.from({ length: THREE_SECOND_BEATS }, () => 3000),
    ...BEAT_INTERVALS_MS.slice(firstThreeSecondBeatIndex + 1),
  ];
};
const CHALLENGE_BEAT_INTERVALS_MS = getChallengeBeatIntervals();

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

  const startChallenge = (): void => {
    setElapsedMs(0);
    setPattern("bunnyRight");
    setBeatIndex(0);
    setCountdownValue(COUNTDOWN_START);
    setPhase("countdown");
  };

  const stopChallenge = (): void => {
    if (phase !== "playing" || startedAtRef.current === null) return;

    setElapsedMs(performance.now() - startedAtRef.current);
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
