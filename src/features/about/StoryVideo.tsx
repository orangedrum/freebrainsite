import { useEffect, useRef } from "react";

interface StoryVideoProps {
  src: string;
  poster: string;
  caption: string;
  /** Tailwind aspect class; defaults to a portrait card for the story grid. */
  aspectClass?: string;
}

/**
 * Silent story video with performance guards:
 * - `preload="none"` + poster, so nothing downloads until it nears the viewport
 * - plays only while visible (IntersectionObserver), pauses when it scrolls away
 * - muted + playsInline, so it autoplays on mobile without a gesture
 * - marked decorative: the visible caption carries the meaning
 */
export const StoryVideo = ({
  src,
  poster,
  caption,
  aspectClass = "aspect-[3/4]",
}: StoryVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="space-y-3">
      <div
        className={`${aspectClass} overflow-hidden rounded-2xl bg-secondary`}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <figcaption className="text-center text-sm font-medium text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
};
