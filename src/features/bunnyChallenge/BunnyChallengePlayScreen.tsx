import { useTranslation } from "react-i18next";
import { getBeatIntervalMs } from "./useBunnyChallenge";
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
  beatIndex: number;
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
  beatIndex,
  factIndex,
  elapsedMs,
  pattern,
  onStop,
}: BunnyChallengePlayScreenProps) => {
  const { t } = useTranslation();
  const isBunnyOnRight = pattern === "bunnyRight";
  const beatSeconds = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(getBeatIntervalMs(beatIndex) / 1000);

  return (
    <div className="mx-auto max-w-6xl">
      {countdownValue > 0 && (
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
      )}
      {countdownValue === 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 md:items-stretch">
          <section
            aria-label={t("bunnyChallenge.previewTitle")}
            className="rounded-2xl border border-foreground/10 bg-secondary p-5 text-center md:p-7"
          >
            <div className="grid grid-cols-2 gap-3">
              <figure
                className="flex flex-col items-center gap-2 rounded-xl bg-background/70 p-3 transition-transform duration-500 ease-in-out motion-reduce:transition-none"
                style={{
                  transform: isBunnyOnRight
                    ? "translateX(calc(100% + 0.75rem))"
                    : "translateX(0)",
                }}
              >
                <img
                  src="/handgesture_bunny.svg"
                  alt={t("bunnyChallenge.pose1Alt")}
                  className="h-24 w-24 object-contain md:h-32 md:w-32"
                />
                <figcaption className="font-semibold text-foreground">
                  {t("bunnyChallenge.pose1Label")}
                </figcaption>
              </figure>
              <figure
                className="flex flex-col items-center gap-2 rounded-xl bg-background/70 p-3 transition-transform duration-500 ease-in-out motion-reduce:transition-none"
                style={{
                  transform: isBunnyOnRight
                    ? "translateX(calc(-100% - 0.75rem))"
                    : "translateX(0)",
                }}
              >
                <img
                  src="/handgesture_gun.svg"
                  alt={t("bunnyChallenge.pose2Alt")}
                  className="h-24 w-24 object-contain md:h-32 md:w-32"
                  style={{ transform: isBunnyOnRight ? "none" : "scaleX(-1)" }}
                />
                <figcaption className="font-semibold text-foreground">
                  {t("bunnyChallenge.pose2Label")}
                </figcaption>
              </figure>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground" aria-live="off">
              {t(
                isBunnyOnRight
                  ? "bunnyChallenge.patternBunnyRight"
                  : "bunnyChallenge.patternBunnyLeft",
              )}
            </p>
            <p className="mt-4 text-2xl font-bold text-foreground" role="status" aria-live="polite">
              {t("bunnyChallenge.cue", { seconds: beatSeconds })}
            </p>
            <p
              className="mt-2 text-3xl font-bold tabular-nums text-foreground"
              aria-label={t("bunnyChallenge.elapsedLabel")}
              aria-live="off"
            >
              {formatElapsedTime(elapsedMs)}
            </p>
            <p className="mt-5 min-h-12 text-sm font-medium text-foreground" aria-live="off">
              {t(PLAY_MESSAGE_KEYS[factIndex])}
            </p>
          </section>
          <BunnyChallengeRecordingControls
            controller={controller}
            mode="live"
            onStop={onStop}
          />
        </div>
      )}
    </div>
  );
};
