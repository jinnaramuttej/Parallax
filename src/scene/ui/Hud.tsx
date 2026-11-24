"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { bonusCansStore, dayStore } from "../dayStore";
import { CAN_EVENTS, COMMIT_EVENTS } from "../story";
import { clockAt, formatClock, TOTAL } from "../timing";

const countAt = (events: number[], unit: number) =>
  events.reduce((n, at) => (unit >= at ? n + 1 : n), 0);

/** Swap the number and give it a small pop (realtime, not scrubbed). */
function popTo(el: HTMLElement | null, value: number, animate: boolean) {
  if (!el || el.textContent === String(value)) return;
  el.textContent = String(value);
  if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.fromTo(el, { scale: 1.7 }, { scale: 1, duration: 0.45, ease: "back.out(3)", overwrite: true });
}

/** Fixed clock + counters. Writes text straight to the DOM on progress. */
export function Hud() {
  const timeRef = useRef<HTMLSpanElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const cansRef = useRef<HTMLElement>(null);
  const commitsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let last = "";
    const update = (p: number) => {
      const { time, period } = formatClock(clockAt(p * TOTAL));
      const label = time + period;
      if (label === last) return;
      last = label;
      if (timeRef.current) timeRef.current.textContent = time;
      if (periodRef.current) periodRef.current.textContent = period;
    };
    let ready = false;
    const counters = () => {
      const unit = dayStore.get() * TOTAL;
      popTo(cansRef.current, countAt(CAN_EVENTS, unit) + bonusCansStore.get(), ready);
      popTo(commitsRef.current, countAt(COMMIT_EVENTS, unit), ready);
    };
    update(dayStore.get());
    counters();
    ready = true;
    const offDay = dayStore.subscribe((p) => {
      update(p);
      counters();
    });
    const offBonus = bonusCansStore.subscribe(counters);
    return () => {
      offDay();
      offBonus();
    };
  }, []);

  return (
    <div className="hud" data-el="hud">
      <p className="hud-clock" aria-label="Time of day">
        <span ref={timeRef}>5:59</span>
        <span ref={periodRef} className="hud-period">
          AM
        </span>
      </p>
      <dl className="hud-counters">
        <div className="hud-counter">
          <dt>
            <svg viewBox="0 0 16 24" aria-hidden className="hud-icon">
              <rect
                x="2"
                y="3"
                width="12"
                height="19"
                rx="3"
                fill="var(--can)"
              />
              <rect
                x="3"
                y="1"
                width="10"
                height="3"
                rx="1.5"
                fill="var(--can-dark)"
              />
              <path d="M9 7 5.5 13H8l-1 5 3.5-6H8z" fill="var(--paper)" />
            </svg>
            Cans
          </dt>
          <dd ref={cansRef} data-counter="cans">
            0
          </dd>
        </div>
        <div className="hud-counter">
          <dt>
            <svg viewBox="0 0 24 24" aria-hidden className="hud-icon">
              <path
                d="M2 12h6M16 12h6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            </svg>
            Commits
          </dt>
          <dd ref={commitsRef} data-counter="commits">
            0
          </dd>
        </div>
      </dl>
    </div>
  );
}
