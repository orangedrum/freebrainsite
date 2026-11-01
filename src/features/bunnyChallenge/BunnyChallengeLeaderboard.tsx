import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  fetchLeaderboard,
  getNormalizedInitials,
  isValidElapsedTime,
  isValidInitials,
  LeaderboardServiceError,
  submitLeaderboardScore,
  type LeaderboardEntry,
} from "./leaderboardService";

type LoadStatus = "loading" | "ready" | "error";
type SubmitStatus = "idle" | "loading" | "success" | "error";

interface BunnyChallengeLeaderboardProps {
  elapsedMs: number;
}

const formatLeaderboardTime = (elapsedMs: number): string => {
  const tenths = Math.floor(elapsedMs / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths % 10}`;
};

const getErrorTranslation = (error: unknown, fallback: string): string => {
  if (error instanceof LeaderboardServiceError) {
    return `bunnyChallenge.${error.code}`;
  }
  return fallback;
};

export const BunnyChallengeLeaderboard = ({
  elapsedMs,
}: BunnyChallengeLeaderboardProps) => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [loadErrorKey, setLoadErrorKey] = useState("bunnyChallenge.leaderboardLoadFailed");
  const [initials, setInitials] = useState("");
  const [hasPublicConsent, setHasPublicConsent] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitErrorKey, setSubmitErrorKey] = useState("bunnyChallenge.leaderboardSubmitFailed");
  const [hasValidationError, setHasValidationError] = useState(false);

  const loadScores = useCallback(async (): Promise<void> => {
    setLoadStatus("loading");
    try {
      setEntries(await fetchLeaderboard());
      setLoadStatus("ready");
    } catch (error) {
      setLoadErrorKey(getErrorTranslation(error, "bunnyChallenge.leaderboardLoadFailed"));
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadScores();
  }, [loadScores]);

  const submitScore = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const normalizedInitials = getNormalizedInitials(initials);
    const scoreElapsedMs = Math.round(elapsedMs);
    if (!isValidInitials(normalizedInitials) || !isValidElapsedTime(scoreElapsedMs)) {
      setHasValidationError(true);
      return;
    }
    if (!hasPublicConsent) return;

    setSubmitStatus("loading");
    setHasValidationError(false);
    try {
      await submitLeaderboardScore(normalizedInitials, scoreElapsedMs);
      setSubmitStatus("success");
      setInitials("");
      setHasPublicConsent(false);
      await loadScores();
    } catch (error) {
      setSubmitErrorKey(
        getErrorTranslation(error, "bunnyChallenge.leaderboardSubmitFailed"),
      );
      setSubmitStatus("error");
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-foreground/10 bg-secondary/60 p-4 text-left md:p-5">
      <h4 className="text-lg font-bold text-foreground">
        {t("bunnyChallenge.leaderboardTitle")}
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("bunnyChallenge.leaderboardDescription")}
      </p>

      <div className="mt-4" aria-live="polite">
        {loadStatus === "loading" && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("bunnyChallenge.leaderboardLoading")}
          </p>
        )}
        {loadStatus === "error" && (
          <div className="space-y-2" role="alert">
            <p className="text-sm text-danger">{t(loadErrorKey)}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadScores()}>
              {t("bunnyChallenge.leaderboardRetry")}
            </Button>
          </div>
        )}
        {loadStatus === "ready" && entries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("bunnyChallenge.leaderboardEmpty")}
          </p>
        )}
        {loadStatus === "ready" && entries.length > 0 && (
          <ol className="space-y-1">
            {entries.map((entry, index) => (
              <li
                key={`${entry.initials}-${entry.elapsed_ms}-${index}`}
                className="flex items-center justify-between gap-4 rounded-md bg-background/70 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-foreground">
                  {index + 1}. {entry.initials}
                </span>
                <span className="tabular-nums text-foreground">
                  {formatLeaderboardTime(entry.elapsed_ms)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <form className="mt-5 space-y-3 border-t border-foreground/10 pt-4" onSubmit={(event) => void submitScore(event)}>
        <p className="text-sm font-semibold text-foreground">
          {t("bunnyChallenge.leaderboardConsentTitle")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("bunnyChallenge.leaderboardConsentDetails")}
        </p>
        <label htmlFor="bunny-leaderboard-initials" className="block text-sm font-medium text-foreground">
          {t("bunnyChallenge.leaderboardInitialsLabel")}
        </label>
        <Input
          id="bunny-leaderboard-initials"
          value={initials}
          onChange={(event) => {
            setInitials(event.target.value.toUpperCase().slice(0, 3));
            setHasValidationError(false);
          }}
          maxLength={3}
          autoComplete="off"
          autoCapitalize="characters"
          aria-invalid={hasValidationError}
          aria-describedby={hasValidationError ? "bunny-leaderboard-validation" : undefined}
        />
        {hasValidationError && (
          <p id="bunny-leaderboard-validation" className="text-sm text-danger" role="alert">
            {t("bunnyChallenge.leaderboardInvalid")}
          </p>
        )}
        <div className="flex items-start gap-3">
          <Checkbox
            id="bunny-leaderboard-consent"
            checked={hasPublicConsent}
            onCheckedChange={(checked) => setHasPublicConsent(checked === true)}
            aria-label={t("bunnyChallenge.leaderboardConsentCheckbox")}
          />
          <label htmlFor="bunny-leaderboard-consent" className="cursor-pointer text-sm text-foreground">
            {t("bunnyChallenge.leaderboardConsentCheckbox")}
          </label>
        </div>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={!hasPublicConsent || initials.trim().length === 0 || submitStatus === "loading"}
        >
          {submitStatus === "loading"
            ? t("bunnyChallenge.leaderboardSubmitting")
            : t("bunnyChallenge.leaderboardSubmit")}
        </Button>
        {submitStatus === "success" && (
          <p className="text-sm text-success" role="status">
            {t("bunnyChallenge.leaderboardSubmitted")}
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-sm text-danger" role="alert">
            {t(submitErrorKey)}
          </p>
        )}
      </form>
    </section>
  );
};
