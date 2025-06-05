"use client";

import { useEffect } from "react";

export function DevCleanup() {
  useEffect(() => {
    const removeNextDevElements = () => {
      if (typeof window !== "undefined") {
        document.querySelectorAll("nextjs-portal").forEach((el) => el.remove());
        const devWrapper = document.getElementById("__next_dev_wrapper__");
        if (devWrapper) devWrapper.remove();
        const errorOverlay = document.querySelector("next-error-overlay");
        if (errorOverlay) errorOverlay.remove();
      }
    };

    if (process.env.NODE_ENV === "development") {
      removeNextDevElements();

      const observer = new MutationObserver(removeNextDevElements);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
