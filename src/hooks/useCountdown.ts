import { useEffect, useState } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasPassed: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Ticks every second toward target date; flags once the date has passed. */
export const useCountdown = (target: Date): Countdown => {
  const [countdown, setCountdown] = useState<Countdown>(() => computeCountdown(target));

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(computeCountdown(target)), SECOND);
    return () => window.clearInterval(timer);
  }, [target]);

  return countdown;
};

const computeCountdown = (target: Date): Countdown => {
  const remaining = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    hasPassed: remaining <= 0,
  };
};
