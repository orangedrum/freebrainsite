import { useState, useRef, type MouseEvent } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  rotationClass?: string;
  orientation?: "vertical" | "horizontal";
  playable?: boolean;
}

/** Video player with a translucent play button overlay that hides on play. */
export const VideoPlayer = ({
  src,
  poster,
  rotationClass = "",
  orientation = "vertical",
  playable = true,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const frameClasses =
    orientation === "horizontal"
      ? "w-full max-w-2xl aspect-video"
      : "w-full max-w-[320px] aspect-[9/16]";

  const togglePlay = (event: MouseEvent<HTMLVideoElement>): void => {
    if (!playable) return;
    const video = event.currentTarget;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className={`relative mx-auto ${playable ? "group cursor-pointer" : "cursor-pointer"} ${frameClasses} ${rotationClass}`}>
      <div className="absolute inset-0 bg-foreground/10 rounded-[2rem] transform scale-105 -z-10"></div>
      <div className="relative rounded-[2rem] overflow-hidden border border-foreground/10 shadow-xl h-full bg-background/20">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
        {!isPlaying && (
          <div className={`absolute inset-0 flex items-center justify-center bg-background/20 transition-colors ${playable ? "hover:bg-background/10 pointer-events-none" : "pointer-events-none"}`}>
            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-foreground/25 backdrop-blur-md text-foreground border border-foreground/40 shadow-2xl ${playable ? "group-hover:scale-110 transition-transform" : ""}`}>
              <Play className="h-8 w-8 fill-foreground ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
