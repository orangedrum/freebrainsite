import { useRef, useState } from "react";
import { ArrowDownToLine, Check, Copy, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BUNNY_CHALLENGE_URL,
  createChallengeCaption,
  formatChallengeElapsedTime,
} from "./bunnyChallengeSharing";

interface BunnyChallengeShareProps {
  elapsedMs: number;
  videoUrl: string | null;
  mimeType: string | null;
}

export const BunnyChallengeShare = ({
  elapsedMs,
  videoUrl,
  mimeType,
}: BunnyChallengeShareProps) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const elapsedLabel = `${formatChallengeElapsedTime(elapsedMs)} ${t("bunnyChallenge.secondsShort")}`;
  const caption = createChallengeCaption(
    elapsedLabel,
    BUNNY_CHALLENGE_URL,
    t("bunnyChallenge.shareCaption"),
  );

  const copyCaption = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopyStatus("copied");
    } catch {
      captionRef.current?.focus();
      captionRef.current?.select();
      setCopyStatus("error");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="mt-5 min-h-12 w-full">
          <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
          {t("bunnyChallenge.shareOpen")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto border-foreground/10 bg-background">
        <DialogTitle className="pr-8 text-foreground">
          {t("bunnyChallenge.shareModalTitle")}
        </DialogTitle>
        <DialogDescription className="text-left">
          {t("bunnyChallenge.shareInstructions")}
        </DialogDescription>
        <ol className="space-y-3 rounded-xl bg-secondary/70 p-4 text-sm">
          {videoUrl && (
            <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">1</span>
            <span className="pt-1 text-foreground">{t("bunnyChallenge.shareStepDownload")}</span>
            </li>
          )}
          {videoUrl && (
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">2</span>
              <span className="pt-1 text-foreground">{t("bunnyChallenge.shareStepUpload")}</span>
            </li>
          )}
          <li className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">{videoUrl ? "3" : "1"}</span>
            <span className="pt-1 text-foreground">{t("bunnyChallenge.shareStepCaption")}</span>
          </li>
        </ol>
        <label
          htmlFor="bunny-challenge-share-caption"
          className="block text-sm font-semibold text-foreground"
        >
          {t("bunnyChallenge.shareCaptionLabel")}
        </label>
        <textarea
          ref={captionRef}
          id="bunny-challenge-share-caption"
          readOnly
          value={caption}
          rows={5}
          className="w-full resize-none rounded-md border border-foreground/20 bg-background p-3 text-sm text-foreground"
        />
        {videoUrl && (
          <Button asChild type="button" className="w-full">
            <a
              href={videoUrl}
              download={`freebrain-bunny-challenge.${mimeType?.includes("mp4") ? "mp4" : "webm"}`}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("bunnyChallenge.recordingDownload")}
            </a>
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
          <p className="text-sm text-danger" role="status">
            {t("bunnyChallenge.shareCopyFailed")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
