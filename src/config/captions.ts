/** Sticky-note captions, referenced by id from each act in acts.ts. */
export type Caption = {
  title: string;
  sub: string;
  /** Clear zone the note sits in, away from the guy and the monitor. */
  zone: "left" | "right";
  /** Note colour (palette variable). */
  note: string;
  /** Slight hand-stuck tilt, in degrees. */
  tilt: number;
};

export const CAPTIONS: Record<string, Caption> = {
  "cap.alarm": { title: "Day 1. Zero commits.", sub: "5:59 AM. The alarm wins round one.", zone: "right", note: "var(--sun)", tilt: 2 },
  "cap.wake": { title: "Up. Mostly.", sub: "Stretch, yawn, find the glasses.", zone: "right", note: "var(--paper)", tilt: -2 },
  "cap.desk": { title: "Coffee first. Code second.", sub: "The kettle is the real first build step.", zone: "right", note: "var(--paper)", tilt: -1.5 },
  "cap.focus": { title: "Flow state. Do not disturb.", sub: "Headphones on, notifications off, commits flowing.", zone: "right", note: "var(--window-cool)", tilt: -2 },
  "cap.bug": { title: "It worked on my machine.", sub: "Golden hour outside. Red terminal inside.", zone: "left", note: "var(--sun)", tilt: 1.5 },
  "cap.fridge": { title: "One more can.", sub: "The fridge light is the only light left on.", zone: "left", note: "var(--paper)", tilt: -1 },
  "cap.ship": { title: "Shipped.", sub: "3 AM. Green build. Nobody tell the alarm.", zone: "right", note: "var(--can)", tilt: 2.5 },
};
