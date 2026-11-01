import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  createChallengeCaption,
  createShareData,
  formatChallengeElapsedTime,
  supportsNativeShare,
} from "./bunnyChallengeSharing";

interface BunnyChallengeShareProps {
  elapsedMs: number;
  videoBlob: Blob | null;
  mimeType: string | null;
}

export const BunnyChallengeShare = ({
  elapsedMs,
  videoBlob,
  mimeType,
}: BunnyChallengeShareProps) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [shareError, setShareError] = useState(false);
  const elapsedLabel = `${formatChallengeElapsedTime(elapsedMs)} ${t("bunnyChallenge.secondsShort")}`;
  const challengeUrl = `${window.location.origin}/bunny-challenge`;
  const caption = createChallengeCaption(
    elapsedLabel,
    challengeUrl,
    t("bunnyChallenge.shareCaption"),
  );
  const canUseNativeShare = supportsNativeShare(navigator.share);
  const videoFile = videoBlob
    ? new File(
        [videoBlob],
        `freebrain-bunny-challenge.${mimeType?.includes("mp4") ? "mp4" : "webm"}`,
        { type: mimeType || videoBlob.type },
      )
    : null;
  const shareData = createShareData(
    {
      title: t("bunnyChallenge.shareTitle"),
      text: caption,
      url: challengeUrl,
    },
    videoFile,
    navigator.canShare?.bind(navigator),
  );
  const canShareVideo = Boolean(shareData.files?.length);

  const shareChallenge = (): void => {
    if (!navigator.share) return;
    setShareError(false);
    void navigator.share(shareData).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError(true);
    });
  };

  const copyCaption = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <section className="mt-5 space-y-3 rounded-xl border border-foreground/10 bg-secondary/60 p-4 text-left">
      <p className="text-sm text-foreground/90">
        {canUseNativeShare
          ? videoBlob && !canShareVideo
            ? t("bunnyChallenge.shareFileFallbackNote")
            : t("bunnyChallenge.shareDestinationNote")
          : t("bunnyChallenge.shareFallbackNote")}
      </p>
      <label htmlFor="bunny-challenge-share-caption" className="block text-sm font-semibold text-foreground">
        {t("bunnyChallenge.shareCaptionLabel")}
      </label>
      <textarea
        id="bunny-challenge-share-caption"
        readOnly
        value={caption}
        rows={4}
        className="w-full resize-none rounded-md border border-foreground/20 bg-background p-3 text-sm text-foreground"
      />
      {canUseNativeShare && (
        <Button type="button" className="w-full" onClick={shareChallenge}>
          <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
          {canShareVideo
            ? t("bunnyChallenge.shareNative")
            : t("bunnyChallenge.shareNativeLink")}
        </Button>
      )}
      <Button type="button" variant="outline" className="w-full" onClick={() => void copyCaption()}>
        {copyStatus === "copied" ? (
          <Check className="mr-2 h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
        )}
        {copyStatus === "copied"
          ? t("bunnyChallenge.shareCopied")
          : t("bunnyChallenge.shareCopy")}
      </Button>
      {copyStatus === "error" && (
        <p className="text-sm text-danger" role="alert">
          {t("bunnyChallenge.shareCopyFailed")}
        </p>
      )}
      {shareError && (
        <p className="text-sm text-danger" role="alert">
          {t("bunnyChallenge.shareFailed")}
        </p>
      )}
    </section>
  );
};
