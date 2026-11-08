import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** How long to keep looking for a hash target while a lazy route chunk loads. */
const HASH_LOOKUP_INTERVAL_MS = 50;
const HASH_LOOKUP_TIMEOUT_MS = 3000;

/**
 * Routes that should land on a specific section instead of the page top when
 * no hash is present. `/bunny-challenge` is here so the bare URL works as a
 * QR-code target without needing `#bunny-escape-challenge` appended.
 */
const ROUTE_ANCHORS: Record<string, string> = {
  "/bunny-challenge": "bunny-escape-challenge",
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls to the element referenced by the URL hash when there is one
 * (e.g. /bunny-challenge#bunny-escape-challenge), to the route's default
 * anchor when it declares one, otherwise to the top. Lazy-loaded routes need a
 * moment before the target exists, so the lookup retries briefly instead of
 * failing on the first pass.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const hashTargetId = hash.startsWith("#")
      ? decodeURIComponent(hash.slice(1))
      : "";
    const targetId = hashTargetId || ROUTE_ANCHORS[pathname] || "";

    if (!targetId) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      return;
    }

    // A route's default anchor fires on page load (the /bunny-challenge QR
    // case), where the visitor has not interacted yet — land instantly instead
    // of gliding from the top. Explicit hash links keep the smooth motion.
    const behavior: ScrollBehavior =
      hashTargetId && !prefersReducedMotion() ? "smooth" : "auto";
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
