import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** How long to keep looking for a hash target while a lazy route chunk loads. */
const HASH_LOOKUP_INTERVAL_MS = 50;
const HASH_LOOKUP_TIMEOUT_MS = 3000;

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls to the element referenced by the URL hash when there is one
 * (e.g. /bunny-challenge#bunny-escape-challenge), otherwise to the top.
 * Lazy-loaded routes need a moment before the target exists, so the lookup
 * retries briefly instead of failing on the first pass.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const targetId = hash.startsWith("#")
      ? decodeURIComponent(hash.slice(1))
      : "";

    if (!targetId) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return;
    }

    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const target = document.getElementById(targetId);
      if (target) {
        window.clearInterval(intervalId);
        target.scrollIntoView({ behavior, block: "start" });
        return;
      }
      if (Date.now() - startedAt >= HASH_LOOKUP_TIMEOUT_MS) {
        window.clearInterval(intervalId);
      }
    }, HASH_LOOKUP_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [pathname, hash]);

  return null;
};
