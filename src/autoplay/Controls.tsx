"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { audio } from "@/audio/AudioManager";
import { dayStore } from "@/scene/dayStore";
import { currentActIndex, goToAct } from "@/scene/navigate";
import { autoplay, pause, play, resetAutoplay, toggle, type AutoplayState } from "./autoplay";

const subscribe = (fn: () => void) => autoplay.subscribe(fn);
const getState = () => autoplay.state;
const serverState = (): AutoplayState => "idle";

declare global {
  interface Window {
    /** Read-only autoplay state for scripts (scripts/autoplay.mjs). */
    __autoplay?: { state: () => AutoplayState; stops: number[] };
  }
}

const LABELS: Record<AutoplayState, { text: string; aria: string }> = {
  idle: { text: "Play", aria: "Play the day" },
  playing: { text: "Pause", aria: "Pause autoplay" },
  paused: { text: "Resume", aria: "Resume autoplay" },
  done: { text: "Replay", aria: "Replay the day" },
};

/** Typing in a field or pressing a focused button keeps its own keys. */
function ownsKeys(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  return Boolean(el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName)));
}

/**
 * HUD transport: play / pause / resume / replay next to the act chips, a
 * thin progress bar for the day, and keyboard control (space: play/pause,
 * left/right arrows: previous/next act).
 */
export function AutoplayControls() {
  const state = useSyncExternalStore(subscribe, getState, serverState);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const set = (p: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    set(dayStore.get());
    const off = dayStore.subscribe(set);

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || ownsKeys(e.target)) return;
      if (e.key === " ") {
        e.preventDefault();
        audio().unlock();
        toggle();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        pause(false);
        goToAct(currentActIndex() + (e.key === "ArrowRight" ? 1 : -1));
      }
    };
    window.addEventListener("keydown", onKey);
    window.__autoplay = { state: () => autoplay.state, stops: autoplay.stops };
    return () => {
      off();
      window.removeEventListener("keydown", onKey);
      resetAutoplay();
    };
  }, []);

  const onClick = () => {
    audio().unlock();
    audio().sfx("click");
    if (state === "playing") pause(true);
    else play();
  };

  const label = LABELS[state];
  return (
    <>
      <div className="day-progress" aria-hidden>
        <div ref={bar} className="day-progress-fill" />
      </div>
      <button
        type="button"
        className="autoplay-controls"
        data-state={state}
        aria-label={label.aria}
        title={`${label.aria} (space)`}
        onClick={onClick}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="autoplay-icon">
          {state === "playing" ? (
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          ) : state === "done" ? (
            <path d="M12 5a7 7 0 1 1-6.6 4.7M5 4v5h5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          )}
        </svg>
        <span className="autoplay-label">{label.text}</span>
      </button>
    </>
  );
}
