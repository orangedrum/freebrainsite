import type { BunnyChallengePattern, BunnyChallengePhase } from "./useBunnyChallenge";

export interface BunnyChallengeRecordingScene {
  pattern: BunnyChallengePattern;
  phase: BunnyChallengePhase;
  countdownValue: number;
  beatSeconds: string;
  elapsedMs: number;
  bunnyLabel: string;
  gunLabel: string;
  patternLabel: string;
  cueLabel: string;
  readyLabel: string;
  countdownLabel: string;
  factLabel: string;
}

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;
const CAMERA_HEIGHT = 760;

const getThemeColor = (token: string): string => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return `hsl(${value})`;
};

const drawCamera = (
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
): void => {
  if (!video.videoWidth || !video.videoHeight) return;

  const scale = Math.max(
    CANVAS_WIDTH / video.videoWidth,
    CAMERA_HEIGHT / video.videoHeight,
  );
  const drawWidth = video.videoWidth * scale;
  const drawHeight = video.videoHeight * scale;
  const offsetX = (CANVAS_WIDTH - drawWidth) / 2;
  const offsetY = (CAMERA_HEIGHT - drawHeight) / 2;

  context.save();
  context.translate(CANVAS_WIDTH, 0);
  context.scale(-1, 1);
  context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
  context.restore();
};

const drawPose = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  isMirrored: boolean,
): void => {
  if (!image.complete || !image.naturalWidth) return;

  context.save();
  if (isMirrored) {
    context.translate(x + 150, y);
    context.scale(-1, 1);
    context.drawImage(image, 0, 0, 150, 150);
  } else {
    context.drawImage(image, x, y, 150, 150);
  }
  context.restore();
};

const getCueText = (scene: BunnyChallengeRecordingScene): string => {
  if (scene.phase === "countdown") {
    return scene.countdownLabel.replace("__COUNT__", String(scene.countdownValue));
  }
  if (scene.phase === "playing") {
    return scene.cueLabel.replace("__SECONDS__", scene.beatSeconds);
  }
  return scene.readyLabel;
};

export const drawBunnyChallengeVideoFrame = (
  context: CanvasRenderingContext2D,
  camera: HTMLVideoElement,
  bunnyImage: HTMLImageElement,
  gunImage: HTMLImageElement,
  scene: BunnyChallengeRecordingScene,
): void => {
  const foreground = getThemeColor("--foreground");
  context.fillStyle = getThemeColor("--background");
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawCamera(context, camera);

  context.fillStyle = foreground;
  context.textAlign = "center";
  context.font = "bold 30px sans-serif";

  const bunnyX = scene.pattern === "bunnyRight" ? 460 : 110;
  const gunX = scene.pattern === "bunnyRight" ? 110 : 460;
  drawPose(context, bunnyImage, bunnyX, 800, false);
  drawPose(context, gunImage, gunX, 800, scene.pattern === "bunnyLeft");

  context.font = "bold 23px sans-serif";
  context.fillText(scene.bunnyLabel, bunnyX + 75, 970, 220);
  context.fillText(scene.gunLabel, gunX + 75, 970, 220);

  context.font = "bold 28px sans-serif";
  context.fillText(scene.patternLabel, CANVAS_WIDTH / 2, 1020, 680);
  context.fillText(getCueText(scene), CANVAS_WIDTH / 2, 1080, 680);

  const tenths = Math.floor(scene.elapsedMs / 100);
  const timer = `${String(Math.floor(tenths / 600)).padStart(2, "0")}:${String(
    Math.floor(tenths / 10) % 60,
  ).padStart(2, "0")}.${tenths % 10}`;
  context.font = "bold 40px sans-serif";
  context.fillText(timer, CANVAS_WIDTH / 2, 1140);

  context.font = "20px sans-serif";
  context.fillText(scene.factLabel, CANVAS_WIDTH / 2, 1220, 680);
};
