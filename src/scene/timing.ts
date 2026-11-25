/**
 * Story time. Scroll maps linearly onto "units"; the master timeline's
 * duration is TOTAL units. Each stop has a hold (the scene lingers, little
 * changes) and a transition to the next stop (most of the motion and most
 * of the clock time happens there).
 */

export const TRANSITION = 1.5;
const HOLDS = [1.0, 1.2, 1.2, 1.2, 1.2, 2.0];

/** Scroll distance per unit, in small-viewport heights. */
export const UNIT_VH = 65;

export type Stop = {
  index: number;
  /** Label for the scrubber and placeholders. */
  time: string;
  name: string;
  holdStart: number;
  holdEnd: number;
  /** Where "jump to this stop" lands. */
  anchor: number;
};

const META = [
  { time: "5:59 AM", name: "Alarm", anchorAt: 0.25 },
  { time: "7 AM", name: "Wake up + coffee", anchorAt: 0.45 },
  { time: "1 PM", name: "Deep focus", anchorAt: 0.45 },
  { time: "6 PM", name: "Golden hour + bug", anchorAt: 0.45 },
  { time: "11 PM", name: "Fridge run", anchorAt: 0.45 },
  { time: "3 AM", name: "Deploy", anchorAt: 0.6 },
];

export const STOPS: Stop[] = (() => {
  let t = 0;
  return HOLDS.map((hold, index) => {
    const holdStart = t;
    const holdEnd = t + hold;
    t = holdEnd + TRANSITION;
    return {
      index,
      time: META[index].time,
      name: META[index].name,
      holdStart,
      holdEnd,
      anchor: holdStart + hold * META[index].anchorAt,
    };
  });
})();

export const TOTAL = STOPS[STOPS.length - 1].holdEnd;

/** Transition i runs from the end of stop i's hold to the start of stop i+1's. */
export function transition(i: number) {
  return { start: STOPS[i].holdEnd, end: STOPS[i + 1].holdStart };
}
