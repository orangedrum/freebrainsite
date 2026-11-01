export const supportsNativeShare = (
  shareFunction: Navigator["share"] | undefined,
): boolean => typeof shareFunction === "function";

export const supportsFileSharing = (
  file: File,
  canShareFiles: Navigator["canShare"] | undefined,
): boolean => {
  if (!canShareFiles) return false;
  try {
    return canShareFiles({ files: [file] });
  } catch {
    return false;
  }
};

export const createShareData = (
  baseData: ShareData,
  videoFile: File | null,
  canShareFiles: Navigator["canShare"] | undefined,
): ShareData => {
  if (!videoFile || !supportsFileSharing(videoFile, canShareFiles)) return baseData;
  return { ...baseData, files: [videoFile] };
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
