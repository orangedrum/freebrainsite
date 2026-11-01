import { useEffect, useRef, useState } from "react";

export type BunnyChallengePhase =
  | "ready"
  | "countdown"
  | "playing"
  | "stopped"
  | "result";

export type BunnyChallengePattern = "bunnyLeft" | "bunnyRight";

const COUNTDOWN_START = 3;
const BEAT_INTERVALS_MS = [
  5000, 4000, 3750, 3500, 3300, 3000, 2800, 2600, 2400, 2200, 2000, 1800, 1600,
  1400, 1200, 1000,
];

export const getBeatIntervalMs = (beatIndex: number): number => {
  return BEAT_INTERVALS_MS[Math.min(beatIndex, BEAT_INTERVALS_MS.length - 1)];
};

export const useBunnyChallenge = () => {
  const [phase, setPhase] = useState<BunnyChallengePhase>("ready");
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
    setPhase("stopped");
  };

  const showResult = (): void => {
    if (phase === "stopped") setPhase("result");
  };

  const resetChallenge = (): void => {
    startedAtRef.current = null;
    setElapsedMs(0);
    setCountdownValue(COUNTDOWN_START);
    setPhase("ready");
  };

  return {
    countdownValue,
    elapsedMs,
    pattern,
    beatIndex,
    phase,
    resetChallenge,
    showResult,
    startChallenge,
    stopChallenge,
  };
};
