export const BUNNY_CHALLENGE_URL = "https://www.freethebrains.com/bunny-challenge";

export const createChallengeCaption = (
  elapsedLabel: string,
  challengeUrl: string,
  captionTemplate: string,
): string =>
  captionTemplate
    .replace("{{time}}", elapsedLabel)
    .replace("{{url}}", challengeUrl);

export const formatChallengeElapsedTime = (elapsedMs: number): string => {
  const tenths = Math.floor(elapsedMs / 100);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor(tenths / 10) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths % 10}`;
};
