export const supportsNativeShare = (
  shareFunction: Navigator["share"] | undefined,
): boolean => typeof shareFunction === "function";

export const createShareData = (
  baseData: ShareData,
  videoFile: File | null,
  canShareData: Navigator["canShare"] | undefined,
): ShareData => {
  if (!videoFile || !canShareData) return baseData;
  const fileData: ShareData = { ...baseData, files: [videoFile] };
  try {
    return canShareData(fileData) ? fileData : baseData;
  } catch {
    return baseData;
  }
};

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
