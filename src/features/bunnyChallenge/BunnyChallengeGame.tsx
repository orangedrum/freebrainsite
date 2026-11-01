import { useEffect, useRef, useState } from "react";
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
  const challengeFrameRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (phase !== "countdown") return;

    const scrollFrame = window.requestAnimationFrame(() => {
      challengeFrameRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(scrollFrame);
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
      ref={challengeFrameRef}
      aria-label={
        phase === "intro"
          ? t("bunnyChallenge.prepareTitle")
          : phase === "countdown"
            ? t("bunnyChallenge.countdownHandsFree")
            : phase === "playing"
              ? t("bunnyChallenge.title")
              : t("bunnyChallenge.resultTitle")
      }
      className="scroll-mt-24 rounded-2xl border border-foreground/10 bg-secondary p-2 sm:p-3"
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
        width={540}
        height={960}
        aria-hidden="true"
        className="hidden"
      />
    </section>
  );
};
