import { timeAt } from "./timeMap";
import type { ShotType } from "./shots";

/**
 * THE DIRECTOR'S SCRIPT. The day is a sequence of acts, each owning a slice
 * of day progress (0 = 5:59 AM, 1 = 3 AM). This array is the single source
 * of truth that scroll (linger zones, page length), the HUD chips and
 * counters, the camera, captions (src/config/captions.ts lists each act's),
 * autoplay and audio read from.
 *
 * Acts start exactly on time-map keys, so a chip jump lands on its label's
 * time (the 7 AM chip lands at 7:00).
 */

export type ActId =
  | "dark"
  | "alarm"
  | "coffee"
  | "boot"
  | "focus"
  | "break"
  | "multitask"
  | "bug"
  | "fridge"
  | "deploy";

/** A camera beat inside an act: move to new framing during `at`. */
export type CameraMove = {
  at: [number, number];
  focus?: [number, number];
  zoom?: number;
  rot?: number;
  depth?: number;
  ease?: string;
  /** Whip pan: motion blur (stretch + streaks) peaks mid-move. */
  whip?: boolean;
};

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
  /** Extra beats after arriving (close-ups, slides, whip pans, pull-backs). */
  moves?: CameraMove[];
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
  /** Voice line id (src/config/voice.ts), if the act has one. */
  voice: string;
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
    id: "dark",
    label: "5:59",
    startProgress: 0,
    endProgress: 0.046,
    linger: [0, 0.035],
    camera: { shot: "wide", focus: [760, 470], arrive: [0, 0] },
    voice: "",
    sfx: ["sfx.room-tone"],
  }),
  act({
    id: "alarm",
    label: "6:00",
    startProgress: 0.046,
    endProgress: 0.13,
    linger: [0.05, 0.11],
    camera: { shot: "pushIn", focus: [330, 560], arrive: [0.04, 0.058] },
    voice: "wake_1",
    sfx: ["sfx.alarm", "sfx.meow"],
  }),
  act({
    id: "coffee",
    label: "6:20",
    startProgress: 0.13,
    endProgress: 0.223,
    linger: [0.175, 0.215],
    camera: {
      shot: "follow",
      focus: [560, 520],
      arrive: [0.126, 0.172],
      moves: [{ at: [0.184, 0.198], focus: [650, 500], zoom: 1.22 }],
    },
    voice: "coffee_1",
    sfx: ["sfx.footsteps", "sfx.sip"],
  }),
  act({
    id: "boot",
    label: "7 AM",
    startProgress: 0.223,
    endProgress: 0.338,
    linger: [0.228, 0.325],
    camera: {
      shot: "pushIn",
      focus: [830, 520],
      arrive: [0.214, 0.232],
      moves: [
        { at: [0.236, 0.252], focus: [738, 516], zoom: 1.9, ease: "sine.inOut" },
        { at: [0.259, 0.276], focus: [940, 511], zoom: 1.75, ease: "sine.inOut" },
        { at: [0.283, 0.299], focus: [1111, 566], zoom: 1.9, ease: "sine.inOut" },
        { at: [0.305, 0.334], focus: [800, 520], zoom: 1.08 },
      ],
    },
    voice: "boot_1",
    sfx: ["sfx.boot", "sfx.keys"],
    events: { commits: [0.332] },
  }),
  act({
    id: "focus",
    label: "10 AM",
    startProgress: 0.338,
    endProgress: 0.415,
    linger: [0.345, 0.385],
    camera: { shot: "orbit", focus: [770, 500], arrive: [0.328, 0.346] },
    voice: "",
    sfx: ["sfx.keys-fast"],
    events: { commits: [0.36, 0.385, 0.405] },
  }),
  act({
    id: "break",
    label: "12:30",
    startProgress: 0.415,
    endProgress: 0.546,
    linger: [0.42, 0.478],
    camera: {
      shot: "pushIn",
      focus: [700, 520],
      arrive: [0.41, 0.422],
      moves: [
        { at: [0.432, 0.446], focus: [738, 516], zoom: 1.6, ease: "power2.inOut" },
        { at: [0.466, 0.474], focus: [940, 511], zoom: 1.3, ease: "power3.inOut", whip: true, rot: -1.2 },
        { at: [0.49, 0.51], focus: [770, 520], zoom: 1.08, rot: 0 },
      ],
    },
    voice: "anime_1",
    sfx: ["sfx.notify", "sfx.whoosh"],
    events: { commits: [0.52, 0.535] },
  }),
  act({
    id: "multitask",
    label: "3 PM",
    startProgress: 0.546,
    endProgress: 0.646,
    linger: [0.552, 0.622],
    camera: { shot: "split", focus: [760, 500], arrive: [0.54, 0.556] },
    voice: "multi_1",
    sfx: ["sfx.keys"],
    events: { cans: [0.56], commits: [0.6, 0.63] },
  }),
  act({
    id: "bug",
    label: "6 PM",
    startProgress: 0.646,
    endProgress: 0.777,
    linger: [0.652, 0.788],
    camera: { shot: "orbit", focus: [760, 520], arrive: [0.638, 0.652] },
    voice: "error_1",
    sfx: ["sfx.error", "sfx.meow"],
    events: { cans: [0.7], commits: [0.725] },
  }),
  act({
    id: "fridge",
    label: "11 PM",
    startProgress: 0.777,
    endProgress: 0.885,
    linger: [0.783, 0.877],
    camera: { shot: "whipPan", focus: [1280, 560], arrive: [0.745, 0.785] },
    voice: "can_1",
    sfx: ["sfx.fridge", "sfx.can-crack"],
    events: { cans: [0.82], commits: [0.86, 0.875] },
  }),
  act({
    id: "deploy",
    label: "3 AM",
    startProgress: 0.885,
    endProgress: 1,
    anchor: 1,
    linger: [0.935, 1],
    camera: {
      shot: "split",
      focus: [800, 480],
      arrive: [0.858, 0.9],
      moves: [{ at: [0.976, 1], focus: [780, 470], zoom: 1, depth: 1.7 }],
    },
    voice: "ship_1",
    sfx: ["sfx.deploy", "sfx.confetti"],
    events: { cans: [0.9], commits: [0.905, 0.93, 0.95, 0.966] },
  }),
];

/** Moments other UI listens for (confetti, fridge clicks, notifications). */
export const MOMENTS = {
  /** The deploy goes green: confetti fires here. */
  deploySuccess: 0.966,
  /** The story holds the fridge door open during this span. */
  fridgeDoorOpen: [0.79, 0.858] as [number, number],
  /** "Standup in 2 min" pops up over the anime. */
  standupPing: 0.455,
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
