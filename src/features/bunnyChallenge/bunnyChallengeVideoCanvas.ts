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

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getThemeColor = (token: string): string => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return `hsl(${value})`;
};

const getLayout = (canvas: HTMLCanvasElement): {
  camera: Rectangle;
  challenge: Rectangle;
  isPortrait: boolean;
} => {
  const isPortrait = canvas.height > canvas.width;
  if (isPortrait) {
    const challengeHeight = canvas.height * 0.48;
    return {
      challenge: { x: 0, y: 0, width: canvas.width, height: challengeHeight },
      camera: {
        x: 0,
        y: challengeHeight,
        width: canvas.width,
        height: canvas.height - challengeHeight,
      },
      isPortrait,
    };
  }

  const challengeWidth = canvas.width * 0.56;
  return {
    challenge: { x: 0, y: 0, width: challengeWidth, height: canvas.height },
    camera: {
      x: challengeWidth,
      y: 0,
      width: canvas.width - challengeWidth,
      height: canvas.height,
    },
    isPortrait,
  };
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

const drawPose = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  isMirrored: boolean,
): void => {
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

const getTimerText = (elapsedMs: number): string => {
  const tenths = Math.floor(elapsedMs / 100);
  return `${String(Math.floor(tenths / 600)).padStart(2, "0")}:${String(
    Math.floor(tenths / 10) % 60,
  ).padStart(2, "0")}.${tenths % 10}`;
};

export const drawBunnyChallengeVideoFrame = (
  context: CanvasRenderingContext2D,
  camera: HTMLVideoElement,
  bunnyImage: HTMLImageElement,
  gunImage: HTMLImageElement,
  scene: BunnyChallengeRecordingScene,
): void => {
  const { challenge, camera: cameraArea, isPortrait } = getLayout(context.canvas);
  const foreground = getThemeColor("--foreground");
  context.fillStyle = getThemeColor("--background");
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = foreground;
  context.textAlign = "center";

  const poseSize = Math.min(
    isPortrait ? 150 : 145,
    challenge.width * (isPortrait ? 0.22 : 0.2),
  );
  const poseY = challenge.y + (isPortrait ? 24 : challenge.height * 0.18);
  const halfWidth = challenge.width / 2;
  const bunnyX =
    challenge.x +
    halfWidth * (scene.pattern === "bunnyRight" ? 1.5 : 0.5) -
    poseSize / 2;
  const gunX =
    challenge.x +
    halfWidth * (scene.pattern === "bunnyRight" ? 0.5 : 1.5) -
    poseSize / 2;

  const centerX = challenge.x + challenge.width / 2;
  if (scene.phase !== "playing") {
    context.font = `bold ${isPortrait ? 46 : 38}px sans-serif`;
    context.fillText(getCueText(scene), centerX, challenge.height / 2, challenge.width - 32);
    return;
  }

  drawCamera(context, camera, cameraArea);
  drawPose(context, bunnyImage, bunnyX, poseY, poseSize, false);
  drawPose(
    context,
    gunImage,
    gunX,
    poseY,
    poseSize,
    scene.pattern === "bunnyLeft",
  );
  context.font = `bold ${isPortrait ? 21 : 18}px sans-serif`;
  context.fillText(scene.bunnyLabel, bunnyX + poseSize / 2, poseY + poseSize + 28, halfWidth - 12);
  context.fillText(scene.gunLabel, gunX + poseSize / 2, poseY + poseSize + 28, halfWidth - 12);

  const patternY = poseY + poseSize + (isPortrait ? 80 : 65);
  context.font = `bold ${isPortrait ? 22 : 17}px sans-serif`;
  context.fillText(scene.patternLabel, centerX, patternY, challenge.width - 32);
  context.fillText(getCueText(scene), centerX, patternY + 48, challenge.width - 32);
  context.font = `bold ${isPortrait ? 32 : 27}px sans-serif`;
  context.fillText(getTimerText(scene.elapsedMs), centerX, patternY + 100);
  context.font = `${isPortrait ? 16 : 14}px sans-serif`;
  context.fillText(scene.factLabel, centerX, challenge.height - 24, challenge.width - 32);
};
