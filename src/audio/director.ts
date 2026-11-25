import { HUM_SPAN, SFX_CUES, TYPING_SPANS } from "@/config/sfx";
import { VOICE, type VoiceLine } from "@/config/voice";
import { dayStore } from "@/scene/dayStore";
import { hideBalloon, showBalloon } from "@/scene/timeline/captions";
import { audio } from "./AudioManager";

/** A line is skipped when the day moves through its trigger faster than this (progress per second). */
const FAST = 0.06;
/** Window after a trigger in which entering it still fires the line. */
const WINDOW = 0.006;
/** A queued line is dropped if the day has moved this far past its trigger. */
const STALE = 0.03;
/** One progress jump bigger than this (a chip jump) fires nothing. */
const JUMP = 0.02;

export type VoiceLog = {
  id: string;
  at: number;
  started: number;
  ended?: number;
  completed?: boolean;
  via?: string;
  skipped?: "fast" | "stale";
};

declare global {
  interface Window {
    __audio?: {
      state: () => { unlocked: boolean; wantsSound: boolean; playing: string | null; queue: string[] };
      log: VoiceLog[];
      /** For checks: pretend these voice files exist (scripts/audio.mjs). */
      setVoiceFiles: (files: string[]) => void;
    };
  }
}

/**
 * Keeps sound in sync with the day: voice lines fire once per pass when the
 * scroll enters their trigger (queued, never overlapping; skipped when the
 * visitor scrolls past fast), their balloons show while they play, and the
 * effect cues and typing clicks follow the scroll. Works the same with
 * sound off: balloons still show for as long as the line takes to say.
 */
export function startAudioDirector() {
  const a = audio();
  const fired = new Set<string>();
  const queue: { line: VoiceLine; at: number }[] = [];
  const log: VoiceLog[] = [];
  let playing: { id: string; stop: () => void } | null = null;
  let last = dayStore.get();
  let lastTime = performance.now();
  let lastKeys = 0;
  let speed = 0;

  function next() {
    if (playing) return;
    const progress = dayStore.get();
    while (queue.length) {
      const item = queue.shift()!;
      if (progress - item.line.trigger.at > STALE || progress < item.line.trigger.at - 0.01) {
        log.push({ id: item.line.id, at: item.line.trigger.at, started: performance.now(), skipped: "stale" });
        continue;
      }
      const entry: VoiceLog = { id: item.line.id, at: item.line.trigger.at, started: performance.now() };
      log.push(entry);
      const balloon = showBalloon(item.line.balloon);
      const playback = a.playVoice(item.line);
      playing = { id: item.line.id, stop: playback.stop };
      void playback.done.then((r) => {
        entry.ended = performance.now();
        entry.completed = r.completed;
        entry.via = r.via;
        balloon.hide();
        playing = null;
        next();
      });
      return;
    }
  }

  function onProgress(p: number) {
    const now = performance.now();
    const dt = Math.max(1, now - lastTime) / 1000;
    const delta = p - last;
    // Smoothed speed that forgets quickly: a pause resets it.
    speed += (Math.abs(delta) / dt - speed) * (1 - Math.exp(-dt / 0.12));
    const forward = delta > 0 && delta < JUMP;

    for (const line of VOICE) {
      const at = line.trigger.at;
      // A new pass: scrolling back above the trigger re-arms the line.
      if (p < at - 0.004) fired.delete(line.id);
      if (fired.has(line.id)) continue;
      if (forward && last < at + WINDOW && p >= at && p <= at + WINDOW) {
        fired.add(line.id);
        if (speed > FAST) {
          log.push({ id: line.id, at, started: now, skipped: "fast" });
          continue;
        }
        queue.push({ line, at });
        next();
      } else if (p > at + WINDOW && last < at) {
        // Moved clean over it in one step (fast scroll or a chip jump).
        fired.add(line.id);
        log.push({ id: line.id, at, started: now, skipped: "fast" });
      }
    }

    if (forward && speed < FAST * 3) {
      for (const cue of SFX_CUES) if (last < cue.at && p >= cue.at) a.sfx(cue.sfx);
      const typing = TYPING_SPANS.some(([s, e]) => p >= s && p <= e);
      if (typing && now - lastKeys > 140) {
        lastKeys = now;
        a.sfx("keys");
      }
    }
    if (p >= HUM_SPAN[0] && p <= HUM_SPAN[1]) a.startFridgeHum();
    else a.stopFridgeHum();

    last = p;
    lastTime = now;
  }

  const off = dayStore.subscribe(onProgress);
  window.__audio = {
    state: () => ({ unlocked: a.unlocked, wantsSound: a.wantsSound, playing: playing?.id ?? null, queue: queue.map((q) => q.line.id) }),
    log,
    setVoiceFiles: (files) => a.setVoiceFiles(files),
  };
  return () => {
    off();
    playing?.stop();
    queue.length = 0;
    hideBalloon();
    a.stopFridgeHum();
  };
}
