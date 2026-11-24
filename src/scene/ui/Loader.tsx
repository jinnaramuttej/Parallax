"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AlarmClockShape } from "../props/AlarmClock";

/** Fired on window once the loading screen has gone. */
export const READY_EVENT = "scene:ready";

/**
 * Short loading screen with the ringing alarm clock. Holds the page at the
 * top until fonts are in (and at least ~0.9 s), then fades away.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const lenis = useLenis();

  useEffect(() => {
    if (lenis && !done.current) lenis.stop();
  }, [lenis]);

  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const minTime = new Promise((r) => setTimeout(r, 900));
    let cancelled = false;
    Promise.all([document.fonts.ready, minTime]).then(() => {
      if (cancelled) return;
      done.current = true;
      lenisRef.current?.start();
      ScrollTrigger.refresh();
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(el, {
        autoAlpha: 0,
        duration: reduce ? 0.01 : 0.6,
        ease: "power2.out",
        onComplete: () => {
          el.setAttribute("data-done", "");
          window.dispatchEvent(new Event(READY_EVENT));
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={ref} className="loader" data-loader role="status" aria-live="polite">
      <svg viewBox="-70 -60 140 120" className="loader-clock" aria-hidden>
        <AlarmClockShape ringing />
      </svg>
      <p className="loader-text">Setting the alarm for 5:59</p>
    </div>
  );
}
