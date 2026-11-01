import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { BunnyChallengePattern } from "./useBunnyChallenge";
import { BunnyChallengeRecordingControls } from "./BunnyChallengeRecordingControls";
import type { useBunnyChallengeRecording } from "./useBunnyChallengeRecording";

const PLAY_MESSAGE_KEYS = [
  "bunnyChallenge.playMessageA",
  "bunnyChallenge.playMessageB",
  "bunnyChallenge.playMessageC",
  "bunnyChallenge.playMessageD",
  "bunnyChallenge.playMessageE",
];

type RecordingController = ReturnType<typeof useBunnyChallengeRecording>;

interface BunnyChallengePlayScreenProps {
  controller: RecordingController;
  countdownValue: number;
  factIndex: number;
  elapsedMs: number;
  pattern: BunnyChallengePattern;
  onStop: () => void;
}

const formatElapsedTime = (elapsedMs: number): string => {
  const tenths = Math.floor(elapsedMs / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  const deciseconds = tenths % 10;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${deciseconds}`;
};

export const BunnyChallengePlayScreen = ({
  controller,
  countdownValue,
  factIndex,
  elapsedMs,
  pattern,
  onStop,
}: BunnyChallengePlayScreenProps) => {
  const { t } = useTranslation();
  const isBunnyOnRight = pattern === "bunnyRight";

  if (countdownValue > 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-background/70 p-5 text-center md:p-8">
        <p
          className="text-6xl font-bold tabular-nums text-foreground md:text-7xl"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {countdownValue}
        </p>
        <p className="mt-3 text-lg font-semibold text-foreground">
          {t("bunnyChallenge.countdownHandsFree")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-[min(74vh,760px)] max-w-5xl rounded-2xl border border-foreground/10 bg-secondary p-3 text-center sm:p-6">
      <div className="grid min-h-[min(54vh,560px)] grid-cols-2 items-center gap-2 pt-24 sm:gap-4">
        <figure
          className="flex h-full flex-col items-center justify-center transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{
            transform: isBunnyOnRight
              ? "translateX(calc(100% + 0.5rem))"
              : "translateX(0)",
          }}
        >
          <img
            src="/handgesture_bunny.svg"
            alt={t("bunnyChallenge.pose1Alt")}
            className="h-[min(42vh,380px)] w-full max-w-[42vw] object-contain sm:max-w-[36vw] md:max-w-[360px]"
          />
        </figure>
        <figure
          className="flex h-full flex-col items-center justify-center transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{
            transform: isBunnyOnRight
              ? "translateX(calc(-100% - 0.5rem))"
              : "translateX(0)",
          }}
        >
          <img
            src="/handgesture_gun.svg"
            alt={t("bunnyChallenge.pose2Alt")}
            className="h-[min(42vh,380px)] w-full max-w-[42vw] object-contain sm:max-w-[36vw] md:max-w-[360px]"
            style={{ transform: isBunnyOnRight ? "none" : "scaleX(-1)" }}
          />
        </figure>
      </div>
      <p className="mx-auto -mt-2 min-h-10 max-w-3xl text-base font-semibold text-foreground sm:text-lg md:text-xl">
        {t(PLAY_MESSAGE_KEYS[factIndex])}
      </p>
      <p
        className="mt-1 text-xl font-bold tabular-nums text-foreground"
        aria-label={t("bunnyChallenge.elapsedLabel")}
        aria-live="off"
      >
        {formatElapsedTime(elapsedMs)}
      </p>
      <Button
        type="button"
        variant="destructive"
        onClick={onStop}
        className="mt-3 min-h-12 min-w-40 px-8 text-lg"
      >
        {t("bunnyChallenge.stop")}
      </Button>
      <BunnyChallengeRecordingControls
        controller={controller}
        mode="live"
      />
    </div>
  );
};
