"use client";

import { useEffect, useRef } from "react";
import { dayStore } from "../dayStore";
import { clockAt, formatClock, TOTAL } from "../timing";

/** Fixed clock + counters. Writes text straight to the DOM on progress. */
export function Hud() {
  const timeRef = useRef<HTMLSpanElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);

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
    update(dayStore.get());
    return dayStore.subscribe(update);
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
              <rect x="2" y="3" width="12" height="19" rx="3" fill="var(--can)" />
              <rect x="3" y="1" width="10" height="3" rx="1.5" fill="var(--can-dark)" />
              <path d="M9 7 5.5 13H8l-1 5 3.5-6H8z" fill="var(--paper)" />
            </svg>
            Cans
          </dt>
          <dd data-counter="cans">0</dd>
        </div>
        <div className="hud-counter">
          <dt>
            <svg viewBox="0 0 24 24" aria-hidden className="hud-icon">
              <path d="M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
            Commits
          </dt>
          <dd data-counter="commits">0</dd>
        </div>
      </dl>
    </div>
  );
}
