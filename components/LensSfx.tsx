"use client";

import { useEffect } from "react";
import { playLensFocus } from "@/lib/audio";

/* Delegated hover listener for the lens blip, so individual images only need a
   `data-lens` attribute rather than their own handlers. */
export default function LensSfx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Touch devices fire synthetic mouse events on tap — the blip would land
       after the fact and read as a random noise. */
    if (!window.matchMedia("(hover: hover)").matches) return;

    let current: Element | null = null;

    const onOver = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.("[data-lens]");
      if (!target || target === current) return;
      current = target;
      playLensFocus();
    };

    const onOut = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.("[data-lens]");
      if (target && target === current) {
        const next = event.relatedTarget as Element | null;
        if (!next || !target.contains(next)) current = null;
      }
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return null;
}
