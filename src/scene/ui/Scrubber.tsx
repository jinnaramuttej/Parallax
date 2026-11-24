"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";
import { dayStore } from "../dayStore";
import { STOPS, TOTAL } from "../timing";

/** Index of the stop the scroll is currently at (or heading into). */
function activeStop(unit: number) {
  let active = 0;
  STOPS.forEach((s, i) => {
    if (unit >= s.holdStart - 0.6) active = i;
  });
  return active;
}

/** "Skip to a time of day": one button per stop, current stop highlighted. */
export function Scrubber() {
  const lenis = useLenis();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let current = -1;
    const update = (p: number) => {
      const next = activeStop(p * TOTAL);
      if (next === current) return;
      current = next;
      buttons.current.forEach((b, i) => {
        if (!b) return;
        if (i === next) b.setAttribute("aria-current", "step");
        else b.removeAttribute("aria-current");
      });
    };
    update(dayStore.get());
    return dayStore.subscribe(update);
  }, []);

  const go = (i: number) => {
    const track = document.querySelector<HTMLElement>(".scene-track");
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const length = track.offsetHeight - window.innerHeight;
    const y = top + (STOPS[i].anchor / TOTAL) * length;
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.2 + Math.min(2.4, Math.abs(y - window.scrollY) / 4000) });
    } else {
      window.scrollTo({ top: y });
    }
  };

  return (
    <nav className="scrubber" aria-label="Skip to a time of day">
      {STOPS.map((s, i) => (
        <button
          key={i}
          ref={(b) => {
            buttons.current[i] = b;
          }}
          type="button"
          className="scrubber-stop"
          onClick={() => go(i)}
          aria-label={`Skip to ${s.time}: ${s.name}`}
        >
          <span className="scrubber-dot" aria-hidden />
          <span className="scrubber-time">{s.time}</span>
        </button>
      ))}
    </nav>
  );
}
