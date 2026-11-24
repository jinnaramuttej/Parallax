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

/**
 * Clock, in minutes since midnight of day one (values past 1440 are the
 * next day: 1620 = 3:00 AM). Each pair is the clock at hold start / end.
 */
const HOLD_CLOCK: [number, number][] = [
  [359, 359.9], // 5:59 AM, the alarm minute
  [420, 510], // 7:00 to 8:30 AM
  [765, 795], // 12:45 to 1:15 PM
  [1070, 1095], // 5:50 to 6:15 PM
  [1370, 1390], // 10:50 to 11:10 PM
  [1616, 1620], // 2:56 to 3:00 AM
];

const CLOCK_KEYS: [number, number][] = STOPS.flatMap((stop, i) => {
  const [a, b] = HOLD_CLOCK[i];
  if (i === STOPS.length - 1) {
    // The finale reaches 3:00 halfway through its hold, then stays there.
    const mid = (stop.holdStart + stop.holdEnd) / 2;
    return [
      [stop.holdStart, a],
      [mid, b],
      [stop.holdEnd, b],
    ] as [number, number][];
  }
  return [
    [stop.holdStart, a],
    [stop.holdEnd, b],
  ] as [number, number][];
});

function interpolate(keys: [number, number][], x: number, from = 0, to = 1) {
  if (x <= keys[0][from]) return keys[0][to];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (x <= b[from]) {
      const span = b[from] - a[from];
      const f = span === 0 ? 1 : (x - a[from]) / span;
      return a[to] + (b[to] - a[to]) * f;
    }
  }
  return keys[keys.length - 1][to];
}

/** Clock minutes at a given story unit. */
export function clockAt(unit: number) {
  return interpolate(CLOCK_KEYS, unit, 0, 1);
}

/** First story unit at which the clock reaches `minutes`. */
export function unitAtClock(minutes: number) {
  return interpolate(CLOCK_KEYS, minutes, 1, 0);
}

export function formatClock(minutes: number) {
  const total = Math.floor(minutes) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    time: `${h12}:${m.toString().padStart(2, "0")}`,
    period: h24 < 12 ? "AM" : "PM",
  };
}
