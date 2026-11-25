import { timeAt } from "./timeMap";
import type { ShotType } from "./shots";

/**
 * THE DIRECTOR'S SCRIPT. The day is a sequence of acts, each owning a slice
 * of day progress (0 = 5:59 AM, 1 = 3 AM). This array is the single source
 * of truth that scroll (linger zones, page length), the HUD chips and
 * counters, the camera, captions, and later autoplay and audio read from.
 *
 * Acts start exactly on time-map keys, so a chip jump lands on its label's
 * time (7:00 desk lands at 7:00).
 */

export type ActId = "alarm" | "wake" | "desk" | "focus" | "bug" | "fridge" | "deploy";

export type ActCamera = {
  /** Preset from src/config/shots.ts. */
  shot: ShotType;
  /** Canvas point (1600x900 units) the shot centres on. */
  focus: [number, number];
  /**
   * Progress window in which the camera moves into this shot. It may start
   * in the previous act so the camera follows him (e.g. on a walk).
   */
  arrive: [number, number];
};

export type Act = {
  id: ActId;
  /** HUD chip text. */
  label: string;
  startProgress: number;
  endProgress: number;
  /** Where a chip jump lands (defaults to the act start). */
  anchor: number;
  /** Clock range in minutes since midnight, read from the time map. */
  clock: { start: number; end: number };
  /** Progress span inside the act where scrolling slows down. */
  linger: [number, number];
  camera: ActCamera;
  voice: string;
  caption: string;
  sfx: string[];
  /** Counter bumps (day progress). */
  events: { cans: number[]; commits: number[] };
};

type ActInput = Omit<Act, "clock" | "anchor" | "events"> & {
  anchor?: number;
  events?: Partial<Act["events"]>;
};

const act = (a: ActInput): Act => ({
  ...a,
  anchor: a.anchor ?? a.startProgress,
  clock: { start: timeAt(a.startProgress), end: timeAt(a.endProgress) },
  events: { cans: a.events?.cans ?? [], commits: a.events?.commits ?? [] },
});

export const ACTS: Act[] = [
  act({
    id: "alarm",
    label: "5:59",
    startProgress: 0,
    endProgress: 0.04,
    linger: [0, 0.035],
    camera: { shot: "pushIn", focus: [280, 580], arrive: [0, 0] },
    voice: "vo.alarm",
    caption: "cap.alarm",
    sfx: ["sfx.alarm-ring", "sfx.room-tone"],
  }),
  act({
    id: "wake",
    label: "6:00 wake",
    startProgress: 0.04,
    endProgress: 0.2,
    linger: [0.085, 0.13],
    camera: { shot: "wide", focus: [520, 520], arrive: [0.04, 0.09] },
    voice: "vo.wake",
    caption: "cap.wake",
    sfx: ["sfx.yawn", "sfx.footsteps"],
  }),
  act({
    id: "desk",
    label: "7:00 desk",
    startProgress: 0.2,
    endProgress: 0.46,
    linger: [0.2, 0.27],
    camera: { shot: "pushIn", focus: [740, 540], arrive: [0.14, 0.2] },
    voice: "vo.coffee",
    caption: "cap.desk",
    sfx: ["sfx.sip", "sfx.keys"],
    events: { commits: [0.33, 0.39, 0.44] },
  }),
  act({
    id: "focus",
    label: "1 PM",
    startProgress: 0.46,
    endProgress: 0.66,
    linger: [0.46, 0.53],
    camera: { shot: "pushIn", focus: [790, 520], arrive: [0.44, 0.47] },
    voice: "vo.focus",
    caption: "cap.focus",
    sfx: ["sfx.headphones", "sfx.keys-fast"],
    events: { cans: [0.475], commits: [0.48, 0.51, 0.55, 0.6] },
  }),
  act({
    id: "bug",
    label: "6 PM",
    startProgress: 0.66,
    endProgress: 0.8,
    linger: [0.66, 0.71],
    camera: { shot: "orbit", focus: [700, 500], arrive: [0.62, 0.665] },
    voice: "vo.bug",
    caption: "cap.bug",
    sfx: ["sfx.error", "sfx.paper"],
    events: { cans: [0.672], commits: [0.75] },
  }),
  act({
    id: "fridge",
    label: "11 PM",
    startProgress: 0.8,
    endProgress: 0.92,
    linger: [0.8, 0.845],
    camera: { shot: "whipPan", focus: [1280, 560], arrive: [0.735, 0.79] },
    voice: "vo.fridge",
    caption: "cap.fridge",
    sfx: ["sfx.fridge-open", "sfx.can-open"],
    events: { cans: [0.805], commits: [0.905] },
  }),
  act({
    id: "deploy",
    label: "3 AM",
    startProgress: 0.92,
    endProgress: 1,
    anchor: 1,
    linger: [0.94, 1],
    camera: { shot: "split", focus: [760, 470], arrive: [0.85, 0.895] },
    voice: "vo.ship",
    caption: "cap.ship",
    sfx: ["sfx.deploy", "sfx.confetti"],
    events: { cans: [0.93], commits: [0.915, 0.95, 0.966] },
  }),
];

/** Moments other UI listens for (confetti, fridge clicks). */
export const MOMENTS = {
  /** The deploy goes green: confetti fires here. */
  deploySuccess: 0.966,
  /** The story holds the fridge door open during this span. */
  fridgeDoorOpen: [0.783, 0.857] as [number, number],
};

export const CAN_EVENTS = ACTS.flatMap((a) => a.events.cans);
export const COMMIT_EVENTS = ACTS.flatMap((a) => a.events.commits);

export const actById = (id: ActId) => ACTS.find((a) => a.id === id)!;

/** The act a day progress falls in. */
export function actAt(progress: number) {
  for (let i = ACTS.length - 1; i >= 0; i--) {
    if (progress >= ACTS[i].startProgress - 1e-6) return ACTS[i];
  }
  return ACTS[0];
}
