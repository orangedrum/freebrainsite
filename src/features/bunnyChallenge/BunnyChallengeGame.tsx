import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BunnyChallengeIntro } from "./BunnyChallengeIntro";
import { BunnyChallengePlayScreen } from "./BunnyChallengePlayScreen";
import { BunnyChallengeResultScreen } from "./BunnyChallengeResultScreen";
import { getBeatIntervalMs, useBunnyChallenge } from "./useBunnyChallenge";
import { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

const PLAY_MESSAGE_KEYS = [
  "bunnyChallenge.playMessageA",
  "bunnyChallenge.playMessageB",
  "bunnyChallenge.playMessageC",
  "bunnyChallenge.playMessageD",
  "bunnyChallenge.playMessageE",
];

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
    startChallenge,
    stopChallenge,
  } = useBunnyChallenge();
  const isBunnyOnRight = pattern === "bunnyRight";
  const patternKey = isBunnyOnRight
    ? "bunnyChallenge.patternBunnyRight"
    : "bunnyChallenge.patternBunnyLeft";
  const beatSeconds = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(getBeatIntervalMs(beatIndex) / 1000);
  const recording = useBunnyChallengeRecording({
    pattern,
    phase,
    countdownValue,
    beatSeconds,
    elapsedMs,
    bunnyLabel: t("bunnyChallenge.pose1Label"),
    gunLabel: t("bunnyChallenge.pose2Label"),
    patternLabel: t(patternKey),
    cueLabel: t("bunnyChallenge.cue", { seconds: "__SECONDS__" }),
    readyLabel: t("bunnyChallenge.ready"),
    countdownLabel: t("bunnyChallenge.countdown", { count: "__COUNT__" }),
    factLabel: t(PLAY_MESSAGE_KEYS[factIndex]),
  });

  useEffect(() => {
    if (phase !== "playing") return;
    const intervalId = window.setInterval(() => {
      setFactIndex((currentIndex) => (currentIndex + 1) % PLAY_MESSAGE_KEYS.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [phase]);

  const startChallengeFromIntro = async (): Promise<void> => {
    if (recording.isRecordingSelected && !(await recording.startRecording())) return;
    setFactIndex(0);
    startChallenge();
  };

  const startWithoutRecording = (): void => {
    recording.discardRecording();
    recording.setIsRecordingSelected(false);
    setFactIndex(0);
    startChallenge();
  };

  const stopChallengeAndRecording = (): void => {
    stopChallenge();
    recording.stopRecording();
  };

  const returnToIntro = (): void => {
    recording.discardRecording();
    resetChallenge();
  };

  return (
    <section
      aria-labelledby={phase !== "countdown" ? "bunny-challenge-preview" : undefined}
      aria-label={
        phase === "countdown" ? t("bunnyChallenge.countdownHandsFree") : undefined
      }
      className="rounded-2xl border border-foreground/10 bg-secondary p-5 md:p-8"
    >
      {phase !== "countdown" && (
        <h2
          id="bunny-challenge-preview"
          className="mb-6 text-center text-2xl font-bold text-foreground md:text-3xl"
        >
          {t("bunnyChallenge.previewTitle")}
        </h2>
      )}
      {phase === "intro" && (
        <BunnyChallengeIntro
          controller={recording}
          onGo={() => void startChallengeFromIntro()}
          onContinueWithoutRecording={startWithoutRecording}
        />
      )}
      {(phase === "countdown" || phase === "playing") && (
        <BunnyChallengePlayScreen
          controller={recording}
          countdownValue={phase === "countdown" ? countdownValue : 0}
          beatIndex={beatIndex}
          factIndex={factIndex}
          elapsedMs={elapsedMs}
          pattern={pattern}
          onStop={stopChallengeAndRecording}
        />
      )}
      {phase === "result" && (
        <BunnyChallengeResultScreen
          controller={recording}
          elapsedMs={elapsedMs}
          onTryAgain={returnToIntro}
        />
      )}
      <video
        ref={recording.cameraVideoRef}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className="hidden"
      />
      <canvas
        ref={recording.canvasRef}
        width={720}
        height={1280}
        aria-hidden="true"
        className="hidden"
      />
    </section>
  );
};
