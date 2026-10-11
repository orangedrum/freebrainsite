import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Smoothly scrolls to the top on every route change. */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};
