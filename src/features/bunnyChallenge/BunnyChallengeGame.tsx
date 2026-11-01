import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { getBeatIntervalMs, useBunnyChallenge } from "./useBunnyChallenge";
import { BunnyChallengeRecordingControls } from "./BunnyChallengeRecordingControls";
import { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

const FACT_KEYS = [1, 2, 3, 4, 5, 6].map(
  (factNumber) => `movementPlanner.facts.f${factNumber}`,
);

const formatElapsedTime = (elapsedMs: number): string => {
  const tenths = Math.floor(elapsedMs / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  const deciseconds = tenths % 10;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${deciseconds}`;
};

export const BunnyChallengeGame = () => {
  const { t } = useTranslation();
  const [factIndex, setFactIndex] = useState(0);
  const {
    countdownValue,
    elapsedMs,
    pattern,
    beatIndex,
    phase,
    resetChallenge,
    showResult,
    startChallenge,
    stopChallenge,
  } = useBunnyChallenge();
  const isBunnyOnRight = pattern === "bunnyRight";
  const patternKey = isBunnyOnRight
    ? "bunnyChallenge.patternBunnyRight"
    : "bunnyChallenge.patternBunnyLeft";
  const currentBeatSeconds = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(getBeatIntervalMs(beatIndex) / 1000);
  const recording = useBunnyChallengeRecording({
    pattern,
    phase,
    countdownValue,
    beatSeconds: currentBeatSeconds,
    elapsedMs,
    bunnyLabel: t("bunnyChallenge.pose1Label"),
    gunLabel: t("bunnyChallenge.pose2Label"),
    patternLabel: t(patternKey),
    cueLabel: t("bunnyChallenge.cue", { seconds: "__SECONDS__" }),
    readyLabel: t("bunnyChallenge.ready"),
    countdownLabel: t("bunnyChallenge.countdown", { count: "__COUNT__" }),
    factLabel: t(FACT_KEYS[factIndex]),
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFactIndex((currentIndex) => (currentIndex + 1) % FACT_KEYS.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const isPlaying = phase === "playing";
  const isResult = phase === "result";
  const startWithRecording = async (): Promise<void> => {
    if (recording.isRecordingSelected && !(await recording.startRecording())) return;
    startChallenge();
  };
  const startWithoutRecording = (): void => {
    recording.setIsRecordingSelected(false);
    startChallenge();
  };
  const stopChallengeAndRecording = (): void => {
    stopChallenge();
    recording.stopRecording();
  };

  return (
    <section
      aria-labelledby="bunny-challenge-preview"
      className="rounded-2xl border border-foreground/10 bg-secondary p-6 md:p-8"
    >
      <h2 id="bunny-challenge-preview" className="text-xl font-bold text-foreground">
        {t("bunnyChallenge.previewTitle")}
      </h2>
      <p className="mt-2 text-foreground/90">{t("bunnyChallenge.simultaneousNotice")}</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <figure
          className="z-10 flex flex-col items-center gap-3 rounded-xl bg-background/70 p-4 text-center transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{ transform: isBunnyOnRight ? "translateX(calc(100% + 1rem))" : "translateX(0)" }}
        >
          <img
            src="/handgesture_bunny.svg"
            alt={t("bunnyChallenge.pose1Alt")}
            className="h-28 w-28 object-contain md:h-36 md:w-36"
          />
          <figcaption className="font-semibold text-foreground">
            {t("bunnyChallenge.pose1Label")}
          </figcaption>
        </figure>
        <figure
          className="z-10 flex flex-col items-center gap-3 rounded-xl bg-background/70 p-4 text-center transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{ transform: isBunnyOnRight ? "translateX(calc(-100% - 1rem))" : "translateX(0)" }}
        >
          <img
            src="/handgesture_gun.svg"
            alt={t("bunnyChallenge.pose2Alt")}
            className="h-28 w-28 object-contain md:h-36 md:w-36"
            style={{ transform: isBunnyOnRight ? "none" : "scaleX(-1)" }}
          />
          <figcaption className="font-semibold text-foreground">
            {t("bunnyChallenge.pose2Label")}
          </figcaption>
        </figure>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-foreground" aria-live="off">
        {t(isBunnyOnRight ? "bunnyChallenge.patternBunnyRight" : "bunnyChallenge.patternBunnyLeft")}
      </p>

      <div className="mt-6 rounded-xl bg-background/70 p-5 text-center">
        <p
          className={`font-semibold text-foreground ${phase === "countdown" ? "text-3xl tabular-nums" : ""} ${isPlaying ? "motion-safe:animate-pulse motion-reduce:animate-none" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {phase === "ready" && t("bunnyChallenge.ready")}
          {phase === "countdown" && t("bunnyChallenge.countdown", { count: countdownValue })}
          {isPlaying && t("bunnyChallenge.cue", { seconds: currentBeatSeconds })}
          {phase === "stopped" && t("bunnyChallenge.stopped")}
          {isResult && t("bunnyChallenge.resultTitle")}
        </p>

        {(phase === "stopped" || isResult) && (
          <p className="mt-2 text-sm text-muted-foreground">{t("bunnyChallenge.elapsedLabel")}</p>
        )}

        {(isPlaying || phase === "stopped" || isResult) && (
          <p
            className="mt-2 text-4xl font-bold tabular-nums text-foreground"
            aria-live={isPlaying ? "off" : "polite"}
            aria-label={t("bunnyChallenge.elapsedLabel")}
          >
            {formatElapsedTime(elapsedMs)}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {phase === "ready" && (
            <Button
              type="button"
              onClick={startWithRecording}
              disabled={recording.status === "requesting"}
              className="min-h-12 px-8"
            >
              {t(
                recording.isRecordingSelected
                  ? "bunnyChallenge.recordingStart"
                  : "bunnyChallenge.start",
              )}
            </Button>
          )}
          {isPlaying && (
            <Button
              type="button"
              onClick={stopChallengeAndRecording}
              variant="destructive"
              className="min-h-12 min-w-32 px-8 text-lg"
            >
              {t("bunnyChallenge.stop")}
            </Button>
          )}
          {phase === "stopped" && (
            <Button type="button" onClick={showResult} className="min-h-12 px-8">
              {t("bunnyChallenge.showResult")}
            </Button>
          )}
          {isResult && (
            <Button type="button" onClick={resetChallenge} className="min-h-12 px-8">
              {t("bunnyChallenge.playAgain")}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 min-h-20 text-center">
        <h3 className="font-semibold text-foreground">{t("bunnyChallenge.factsTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground" aria-live="off">{t(FACT_KEYS[factIndex])}</p>
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t("bunnyChallenge.selfReportedReminder")}
      </p>

      <BunnyChallengeRecordingControls
        controller={recording}
        canContinueWithoutRecording={phase === "ready"}
        onContinueWithoutRecording={startWithoutRecording}
      />
    </section>
  );
};
