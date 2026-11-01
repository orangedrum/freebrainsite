import type { BunnyChallengePattern, BunnyChallengePhase } from "./useBunnyChallenge";

export interface BunnyChallengeRecordingScene {
  pattern: BunnyChallengePattern;
  phase: BunnyChallengePhase;
  countdownValue: number;
  elapsedMs: number;
  instructionLabel: string;
  countdownLabel: string;
  factLabel: string;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const themeColors = new Map<string, string>();
const backgroundGradients = new WeakMap<
  CanvasRenderingContext2D,
  { width: number; height: number; gradient: CanvasGradient }
>();

const getThemeToken = (token: string): string => {
  const cachedColor = themeColors.get(token);
  if (cachedColor) return cachedColor;
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  themeColors.set(token, color);
  return color;
};

const getThemeColor = (token: string): string => {
  return `hsl(${getThemeToken(token)})`;
};

const getOverlayGradient = (
  context: CanvasRenderingContext2D,
  bandY: number,
  height: number,
): CanvasGradient => {
  const cachedGradient = backgroundGradients.get(context);
  if (
    cachedGradient?.width === context.canvas.width &&
    cachedGradient.height === context.canvas.height
  ) {
    return cachedGradient.gradient;
  }
  const gradient = context.createLinearGradient(0, bandY, 0, height);
  gradient.addColorStop(0, `hsl(${getThemeToken("--background")} / 0)`);
  gradient.addColorStop(0.22, `hsl(${getThemeToken("--background")} / 0.78)`);
  gradient.addColorStop(1, `hsl(${getThemeToken("--background")} / 0.9)`);
  backgroundGradients.set(context, {
    width: context.canvas.width,
    height: context.canvas.height,
    gradient,
  });
  return gradient;
};

const drawCamera = (
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  rectangle: Rectangle,
): void => {
  context.fillStyle = getThemeColor("--background");
  context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  if (!video.videoWidth || !video.videoHeight) return;

  const scale = Math.max(
    rectangle.width / video.videoWidth,
    rectangle.height / video.videoHeight,
  );
  const drawWidth = video.videoWidth * scale;
  const drawHeight = video.videoHeight * scale;
  const offsetX = rectangle.x + (rectangle.width - drawWidth) / 2;
  const offsetY = rectangle.y + (rectangle.height - drawHeight) / 2;

  context.save();
  context.beginPath();
  context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  context.clip();
  context.translate(rectangle.x * 2 + rectangle.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
  context.restore();
};

const drawChallengeOverlay = (
  context: CanvasRenderingContext2D,
  scene: BunnyChallengeRecordingScene,
  isPortrait: boolean,
  bunnyImage: HTMLImageElement,
  gunImage: HTMLImageElement,
): void => {
  const { width, height } = context.canvas;
  const bandHeight = height * (isPortrait ? 1 / 3 : 2 / 3);
  const bandY = height - bandHeight;
  context.fillStyle = getOverlayGradient(context, bandY, height);
  context.fillRect(0, bandY, width, bandHeight);

  const foreground = getThemeColor("--foreground");
  context.fillStyle = foreground;
  context.textAlign = "center";
  context.shadowColor = getThemeColor("--background");
  context.shadowBlur = 4;

  if (scene.phase === "countdown") {
    context.font = `bold ${isPortrait ? 72 : 60}px sans-serif`;
    context.fillText(
      scene.countdownLabel.replace("__COUNT__", String(scene.countdownValue)),
      width / 2,
      bandY + bandHeight * 0.55,
      width - 48,
    );
    context.font = `${isPortrait ? 22 : 20}px sans-serif`;
    context.fillText(
      scene.instructionLabel,
      width / 2,
      bandY + bandHeight * 0.7,
      width - 48,
    );
    context.shadowBlur = 0;
    return;
  }

  const poseSize = Math.min(
    bandHeight * 0.62,
    width * (isPortrait ? 0.34 : 0.31),
  );
  const poseY = bandY + bandHeight * 0.035;
  const centerX = width / 2;
  const poseGap = width * 0.035;
  const leftX = centerX - poseSize - poseGap / 2;
  const rightX = centerX + poseGap / 2;
  const bunnyX = scene.pattern === "bunnyRight" ? rightX : leftX;
  const gunX = scene.pattern === "bunnyRight" ? leftX : rightX;

  drawPose(context, bunnyImage, bunnyX, poseY, poseSize, false);
  drawPose(context, gunImage, gunX, poseY, poseSize, scene.pattern === "bunnyLeft");

  context.shadowBlur = 0;
  context.font = `bold ${isPortrait ? 30 : 26}px sans-serif`;
  context.fillText(getTimerText(scene.elapsedMs), centerX, bandY + bandHeight * 0.76);
  context.font = `${isPortrait ? 17 : 18}px sans-serif`;
  const maxTextWidth = width * 0.9;
  const lines: string[] = [];
  let line = "";
  for (const word of scene.factLabel.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxTextWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  const lineHeight = isPortrait ? 23 : 24;
  const firstLineY = height - lines.length * lineHeight - bandHeight * 0.04;
  lines.forEach((text, index) => {
    context.fillText(text, centerX, firstLineY + index * lineHeight, maxTextWidth);
  });
};

function drawPose(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  isMirrored: boolean,
): void {
  if (!image.complete || !image.naturalWidth) return;
  context.save();
  if (isMirrored) {
    context.translate(x + size, y);
    context.scale(-1, 1);
    context.drawImage(image, 0, 0, size, size);
  } else {
    context.drawImage(image, x, y, size, size);
  }
  context.restore();
}

function getTimerText(elapsedMs: number): string {
  const tenths = Math.floor(elapsedMs / 100);
  return `${String(Math.floor(tenths / 600)).padStart(2, "0")}:${String(
    Math.floor(tenths / 10) % 60,
  ).padStart(2, "0")}.${tenths % 10}`;
}

export const drawBunnyChallengeVideoFrame = (
  context: CanvasRenderingContext2D,
  camera: HTMLVideoElement,
  bunnyImage: HTMLImageElement,
  gunImage: HTMLImageElement,
  scene: BunnyChallengeRecordingScene,
): void => {
  const { width, height } = context.canvas;
  const isPortrait = height > width;
  drawCamera(context, camera, { x: 0, y: 0, width, height });
  drawChallengeOverlay(context, scene, isPortrait, bunnyImage, gunImage);
};
