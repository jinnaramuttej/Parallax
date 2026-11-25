"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { audio } from "@/audio/AudioManager";
import { READY_EVENT } from "@/scene/ui/Loader";
import { play } from "./autoplay";

/**
 * The intro card over the dark room: the title, "Play the day" (turns sound
 * on, which unlocks audio, and starts autoplay) and the scroll hint. It
 * leaves on the first scroll or when play starts.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const gone = useRef(false);

  const hide = () => {
    const el = ref.current;
    if (!el || gone.current) return;
    gone.current = true;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { autoAlpha: 0, y: reduce ? 0 : 16, duration: reduce ? 0.01 : 0.4, ease: "power1.in", overwrite: true });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => {
      if (gone.current || window.scrollY > 24) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.fromTo(el, { autoAlpha: 0, y: reduce ? 0 : 16 }, { autoAlpha: 1, y: 0, duration: reduce ? 0.01 : 0.6, ease: "power2.out" });
    };
    const onScroll = () => {
      if (window.scrollY > 24) hide();
    };
    window.addEventListener(READY_EVENT, show);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (document.querySelector("[data-loader][data-done]")) show();
    return () => {
      window.removeEventListener(READY_EVENT, show);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const start = () => {
    const a = audio();
    a.unlock();
    a.setMuted(false);
    a.sfx("click");
    hide();
    play();
  };

  return (
    <div ref={ref} className="intro" style={{ visibility: "hidden", opacity: 0 }}>
      <h2 className="intro-title">24 Hours of a Dev</h2>
      <p className="intro-sub">One dev, one cat, one very long day.</p>
      <button type="button" className="intro-play" onClick={start}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
        </svg>
        Play the day
      </button>
      <p className="intro-hint" aria-hidden>
        or scroll to wake up
        <svg viewBox="0 0 24 24" className="intro-arrow">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>
    </div>
  );
}
