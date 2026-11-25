"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { ACTS, actAt } from "@/config/acts";
import { scrollFromProgress } from "@/config/scroll";
import { dayStore } from "../dayStore";

/** "6:00 wake" -> time "6:00" (always shown) + word "wake" (hidden on phones). */
function chipParts(label: string) {
  const m = label.match(/^(\d{1,2}(?::\d{2})?(?:\s?[AP]M)?)\s*(.*)$/);
  return m ? { time: m[1], word: m[2] } : { time: label, word: "" };
}

const easeInOutCubic =(t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Scroll position (px) at which the scene reaches a day progress. */
export function scrollYForProgress(progress: number) {
  const track = document.querySelector<HTMLElement>(".scene-track");
  if (!track) return 0;
  const top = track.getBoundingClientRect().top + window.scrollY;
  return top + scrollFromProgress(progress) * (track.offsetHeight - window.innerHeight);
}

/** HUD chips: one per act (from src/config/acts.ts); the current act is highlighted. */
export function Scrubber() {
  const lenis = useLenis();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let current = "";
    const update = (p: number) => {
      const next = actAt(p).id;
      if (next === current) return;
      current = next;
      buttons.current.forEach((b, i) => {
        if (!b) return;
        if (ACTS[i].id === next) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
    };
    update(dayStore.get());
    return dayStore.subscribe(update);
  }, []);

  const go = (i: number) => {
    const y = scrollYForProgress(ACTS[i].anchor);
    if (lenis) {
      const distance = Math.abs(y - window.scrollY);
      lenis.scrollTo(y, { duration: 1 + Math.min(2.6, distance / 4500), easing: easeInOutCubic });
    } else {
      window.scrollTo({ top: y });
    }
  };

  return (
    <nav className="scrubber" aria-label="Skip to a time of day">
      {ACTS.map((act, i) => (
        <button
          key={act.id}
          ref={(b) => {
            buttons.current[i] = b;
          }}
          type="button"
          className="scrubber-stop"
          data-act={act.id}
          onClick={() => go(i)}
          aria-label={`Skip to ${act.label}`}
        >
          <span className="scrubber-dot" aria-hidden />
          <span className="scrubber-time">{chipParts(act.label).time}</span>
          {chipParts(act.label).word && (
            <span className="scrubber-word">{chipParts(act.label).word}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
