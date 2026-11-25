import { gsap } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";
import { ACTS } from "@/config/acts";
import { VOICE } from "@/config/voice";
import { voiceBusy } from "@/audio/director";
import { dayStore } from "@/scene/dayStore";
import { glideTo, scrollYForProgress, setScroll } from "@/scene/navigate";

export type AutoplayState = "idle" | "playing" | "paused" | "done";

/** Travel speed between stops, in viewport heights per second. */
const SPEED_VH = 0.1;
/** After a voice line ends, hold this long before moving on. */
const AFTER_LINE_MS = 600;
/** Every stop holds at least this long; none holds longer than MAX_DWELL_MS. */
const MIN_DWELL_MS = 1100;
const MAX_DWELL_MS = 14000;

/**
 * Where autoplay stops and holds: just past each act's voice line trigger
 * (so the line plays and finishes), or a beat in acts without one, then the
 * end of the day.
 */
const STOPS: number[] = (() => {
  const beats: Record<string, number> = { dark: 0.03, focus: 0.372 };
  const out: number[] = [];
  for (const act of ACTS) {
    const line = VOICE.find((v) => v.trigger.act === act.id);
    if (line) out.push(line.trigger.at + 0.0025);
    else if (beats[act.id] !== undefined) out.push(beats[act.id]);
  }
  out.push(1);
  return out.sort((a, b) => a - b);
})();

let state: AutoplayState = "idle";
const listeners = new Set<() => void>();
const pos = { y: 0 };
let travel: gsap.core.Tween | null = null;
let dwellTimer = 0;
let token = 0;
let lastY = 0;
let lastT = 0;
let velocity = 0;
let offInput: (() => void) | null = null;

function set(next: AutoplayState) {
  if (state === next) return;
  state = next;
  listeners.forEach((fn) => fn());
}

export const autoplay = {
  get state() {
    return state;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  stops: STOPS,
};

function stopMotion() {
  travel?.kill();
  travel = null;
  window.clearTimeout(dwellTimer);
  token++;
}

function stageEnd() {
  const stats = document.querySelector<HTMLElement>(".stats");
  return stats ? stats.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
}

/** Hold at a stop until the voice line (if any) is done, then move on. */
function dwell(index: number) {
  const my = token;
  const arrived = performance.now();
  let quietSince = 0;
  const check = () => {
    if (my !== token || state !== "playing") return;
    const now = performance.now();
    const busy = voiceBusy();
    if (busy) quietSince = 0;
    else quietSince ||= now;
    const held = now - arrived;
    const quietFor = quietSince ? now - quietSince : 0;
    if ((held >= MIN_DWELL_MS && quietFor >= AFTER_LINE_MS) || held >= MAX_DWELL_MS) travelTo(index + 1);
    else dwellTimer = window.setTimeout(check, 100);
  };
  dwellTimer = window.setTimeout(check, 150);
}

function travelTo(index: number) {
  if (state !== "playing") return;
  const my = ++token;
  const end = index >= STOPS.length;
  const target = end ? stageEnd() : scrollYForProgress(STOPS[index]);
  pos.y = window.scrollY;
  const distance = Math.abs(target - pos.y);
  const duration = Math.max(1.2, distance / (window.innerHeight * SPEED_VH));
  travel = gsap.to(pos, {
    y: target,
    duration,
    ease: end ? "power2.inOut" : "sine.inOut",
    onUpdate: () => {
      const now = performance.now();
      velocity = (pos.y - lastY) / Math.max(1, now - lastT);
      lastY = pos.y;
      lastT = now;
      setScroll(pos.y);
    },
    onComplete: () => {
      if (my !== token) return;
      travel = null;
      if (end) {
        set("done");
        detachInput();
      } else dwell(index);
    },
  });
}

/** The first stop ahead of where the day is now. */
function nextStop() {
  const p = dayStore.get();
  const i = STOPS.findIndex((s) => s > p + 0.0015);
  return i === -1 ? STOPS.length : i;
}

/** Pause on any input that scrolls (wheel, touch, scroll keys). */
function attachInput() {
  if (offInput) return;
  const lenis = getLenis();
  const onUser = () => pause(false);
  const onKey = (e: KeyboardEvent) => {
    if (["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) pause(false);
  };
  const offLenis = lenis?.on("virtual-scroll", onUser);
  window.addEventListener("wheel", onUser, { passive: true });
  window.addEventListener("touchstart", onUser, { passive: true });
  window.addEventListener("keydown", onKey);
  offInput = () => {
    offLenis?.();
    window.removeEventListener("wheel", onUser);
    window.removeEventListener("touchstart", onUser);
    window.removeEventListener("keydown", onKey);
    offInput = null;
  };
}
function detachInput() {
  offInput?.();
}

/** Start (or resume) playing from wherever the day is. */
export function play() {
  if (state === "playing") return;
  if (state === "done" || dayStore.get() >= 0.999) return replay();
  set("playing");
  attachInput();
  stopMotion();
  travelTo(nextStop());
}

/**
 * Pause. `smooth`: ease out of the current motion (pause button, space);
 * otherwise stop at once and let the visitor's own scroll take over.
 */
export function pause(smooth = true) {
  if (state !== "playing") return;
  const wasTravelling = Boolean(travel);
  stopMotion();
  set("paused");
  detachInput();
  if (smooth && wasTravelling && Math.abs(velocity) > 0.01) {
    pos.y = window.scrollY;
    travel = gsap.to(pos, {
      y: pos.y + velocity * 320,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setScroll(pos.y),
      onComplete: () => {
        travel = null;
      },
    });
  }
}

export function toggle() {
  if (state === "playing") pause(true);
  else play();
}

/** Back to the top of the day, then play it again. */
export function replay() {
  stopMotion();
  set("playing");
  attachInput();
  const my = token;
  glideTo(0, () => {
    if (my !== token || state !== "playing") return;
    travelTo(nextStop());
  });
}

/** Tear down (unmount). */
export function resetAutoplay() {
  stopMotion();
  detachInput();
  set("idle");
}
