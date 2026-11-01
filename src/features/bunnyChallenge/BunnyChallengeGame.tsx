import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BunnyChallengeIntro } from "./BunnyChallengeIntro";
import { BunnyChallengePlayScreen } from "./BunnyChallengePlayScreen";
import { BunnyChallengeResultScreen } from "./BunnyChallengeResultScreen";
import { useBunnyChallenge } from "./useBunnyChallenge";
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
    phase,
    resetChallenge,
    startChallenge,
    stopChallenge,
  } = useBunnyChallenge();
  const recording = useBunnyChallengeRecording({
    pattern,
    phase,
    countdownValue,
    elapsedMs,
    instructionLabel: t("bunnyChallenge.countdownHandsFree"),
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
      aria-labelledby={phase === "intro" ? "bunny-challenge-preview" : undefined}
      aria-label={
        phase === "countdown"
          ? t("bunnyChallenge.countdownHandsFree")
          : phase === "playing"
            ? t("bunnyChallenge.title")
            : phase === "result"
              ? t("bunnyChallenge.resultTitle")
              : undefined
      }
      className={`rounded-2xl border border-foreground/10 bg-secondary ${
        phase === "playing" ? "p-2 sm:p-3" : "p-5 md:p-8"
      }`}
    >
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
