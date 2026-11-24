import { STOPS, transition } from "./timing";

export type Copy = {
  title: string;
  sub: string;
  /** Clear zone the copy sits in, away from the guy and the monitor. */
  zone: "left" | "right";
  /** Sticky-note colour (palette variable). */
  note: string;
  /** Slight hand-stuck tilt, in degrees. */
  tilt: number;
};

export const COPY: Copy[] = [
  { title: "Day 1. Zero commits.", sub: "5:59 AM. The alarm wins round one.", zone: "right", note: "var(--sun)", tilt: 2 },
  { title: "Coffee first. Code second.", sub: "The kettle is the real first build step.", zone: "right", note: "var(--paper)", tilt: -1.5 },
  { title: "Flow state. Do not disturb.", sub: "Headphones on, notifications off, commits flowing.", zone: "left", note: "var(--window-cool)", tilt: -2 },
  { title: "It worked on my machine.", sub: "Golden hour outside. Red terminal inside.", zone: "left", note: "var(--sun)", tilt: 1.5 },
  { title: "One more can.", sub: "The fridge light is the only light left on.", zone: "left", note: "var(--paper)", tilt: -1 },
  { title: "Shipped.", sub: "3 AM. Green build. Nobody tell the alarm.", zone: "right", note: "var(--can)", tilt: 2.5 },
];

const [, , s2, s3, s4, s5] = STOPS;
const [, , t2, t3, t4] = [0, 1, 2, 3, 4].map(transition);

/** Story units at which the Cans counter goes up. */
export const CAN_EVENTS = [
  s2.holdStart + 0.35,
  s3.holdStart + 0.15,
  s4.holdStart + 0.5,
  s5.holdStart - 0.3,
];

/** Story units at which the Commits counter goes up. */
export const COMMIT_EVENTS = [
  s2.holdStart + 0.15,
  s2.holdStart + 0.4,
  s2.holdStart + 0.65,
  s2.holdStart + 0.9,
  t2.start + 0.3,
  t2.start + 0.7,
  t3.start + 0.6,
  t4.start + 1.2,
  t4.start + 1.32,
  t4.start + 1.44,
  s5.holdStart + 0.25,
  s5.holdStart + 0.62,
];

/** Camera shot per stop. depth > 1 spreads the parallax layers apart, < 1 calms them. */
export type Shot = { fx: number; fy: number; zoom: number; rot: number; depth: number };

export const SHOTS: Shot[] = [
  { fx: 280, fy: 580, zoom: 1.12, rot: -0.8, depth: 1 },
  { fx: 520, fy: 520, zoom: 1.04, rot: 0, depth: 1.1 },
  { fx: 790, fy: 520, zoom: 1.16, rot: 0, depth: 0.6 },
  { fx: 700, fy: 500, zoom: 1.06, rot: 1.2, depth: 1.4 },
  { fx: 1280, fy: 560, zoom: 1.12, rot: -0.8, depth: 1.2 },
  { fx: 760, fy: 470, zoom: 1, rot: 0, depth: 1.5 },
];

/** Story unit at which the deploy goes green (confetti fires here). */
export const DEPLOY_SUCCESS_AT = s5.holdStart + 0.62;

/** Story units during which the fridge door is held open by the story. */
export const FRIDGE_OPEN: [number, number] = [s4.holdStart - 0.2, t4.start + 0.2];
