"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Tiny store so any client component can grab the Lenis instance
// (e.g. lenis.scrollTo for "jump to 9 AM") without prop drilling.
let current: Lenis | null = null;
const listeners = new Set<() => void>();

function setLenis(instance: Lenis | null) {
  current = instance;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/**
 * Lenis smooth scroll driven by GSAP's ticker, so Lenis and ScrollTrigger
 * share one rAF loop and never drift apart. Skipped entirely when the user
 * prefers reduced motion (native scroll still drives ScrollTrigger).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000); // gsap time is in seconds
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP default
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return children;
}
