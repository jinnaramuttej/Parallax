"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { audio } from "./AudioManager";

const TIP_KEY = "parallax:sound-tip";

const subscribe = (fn: () => void) => audio().subscribe(fn);
const isOn = () => audio().wantsSound;
const serverOff = () => false;

/**
 * Sound toggle, top right. Sound starts off; turning it on is the user
 * gesture that unlocks audio. An animated waveform shows when it is on.
 * First visit: a tooltip suggests turning it on (dismissed for good once
 * used). The site works fully with sound off.
 */
export function SoundButton() {
  const on = useSyncExternalStore(subscribe, isOn, serverOff);
  const tip = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TIP_KEY) === "seen";
    } catch {}
    if (!seen && !audio().wantsSound && tip.current) tip.current.hidden = false;
    // Any gesture unlocks audio for a visitor who chose sound on last time.
    const unlock = () => {
      if (audio().wantsSound) audio().unlock();
    };
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("touchend", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock, opts);
      window.removeEventListener("keydown", unlock, opts);
      window.removeEventListener("touchend", unlock, opts);
    };
  }, []);

  const dismissTip = () => {
    if (tip.current) tip.current.hidden = true;
    try {
      localStorage.setItem(TIP_KEY, "seen");
    } catch {}
  };

  const toggle = () => {
    const a = audio();
    a.unlock();
    a.setMuted(a.wantsSound);
    a.sfx("click");
    dismissTip();
  };

  return (
    <div className="sound" data-sound-button>
      <button
        type="button"
        className="sound-btn"
        data-on={on}
        aria-pressed={on}
        aria-label={on ? "Turn sound off" : "Turn sound on"}
        title={on ? "Sound on" : "Sound off"}
        onClick={toggle}
      >
        <span className="sound-wave" aria-hidden>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="sound-label">{on ? "Sound on" : "Sound off"}</span>
      </button>
      <span ref={tip} className="sound-tip" role="note" hidden>
        Turn sound on for the full experience.
        <button type="button" className="sound-tip-close" aria-label="Dismiss" onClick={dismissTip}>
          ×
        </button>
      </span>
    </div>
  );
}
