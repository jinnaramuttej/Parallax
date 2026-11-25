/**
 * TIME MAP: the one place that decides what the clock says at each point of
 * the day. `at` is day progress (0 = 5:59 AM at the top of the scene, 1 = the
 * 3 AM finale), `time` is the wall clock.
 *
 * Everything time-of-day reads from timeAt(progress): the HUD clock, the sky,
 * sun and moon, skyline windows, room light and cloud drift. Nothing reads
 * raw scroll.
 *
 * Between keys the clock eases along a monotone cubic curve: smooth, never
 * runs backwards and never overshoots a key. A key can set `ease` to change
 * the segment that starts at it.
 *
 * This module has no imports so scripts (and Node) can load it directly.
 */

export type SegmentEase = "smooth" | "linear" | "inOut";
export type TimeKey = { at: number; time: string; ease?: SegmentEase };

export const TIME_MAP: TimeKey[] = [
  { at: 0.0, time: "05:59" },
  { at: 0.046, time: "06:00" },
  { at: 0.13, time: "06:20" },
  { at: 0.223, time: "07:00" },
  { at: 0.338, time: "10:00" },
  { at: 0.395, time: "12:00" },
  { at: 0.415, time: "12:30" },
  { at: 0.47, time: "13:00" },
  { at: 0.546, time: "15:00" },
  { at: 0.62, time: "17:00" },
  { at: 0.646, time: "18:00" },
  { at: 0.73, time: "18:45" },
  { at: 0.777, time: "23:00" },
  { at: 0.885, time: "02:30" },
  { at: 1.0, time: "03:00" },
];

/** "HH:MM" to minutes since midnight. */
export function parseTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Minutes keep counting past midnight (02:30 -> 1590) so the curve is monotone.
const XS = TIME_MAP.map((k) => k.at);
const YS: number[] = [];
TIME_MAP.forEach((k, i) => {
  let m = parseTime(k.time);
  while (i > 0 && m < YS[i - 1]) m += 1440;
  YS.push(m);
});

// Fritsch–Carlson tangents for monotone cubic Hermite interpolation.
const TANGENTS = (() => {
  const n = XS.length;
  const d = XS.slice(0, -1).map((x, i) => (YS[i + 1] - YS[i]) / (XS[i + 1] - x));
  const m = XS.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return m;
})();

/** Clock (minutes since midnight of day one, 1620 = 3:00 AM) at a day progress. */
export function timeAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < XS.length - 2 && p > XS[i + 1]) i++;
  const h = XS[i + 1] - XS[i];
  const t = (p - XS[i]) / h;
  const y0 = YS[i];
  const y1 = YS[i + 1];
  const ease = TIME_MAP[i].ease ?? "smooth";
  if (ease === "linear") return y0 + (y1 - y0) * t;
  if (ease === "inOut") return y0 + (y1 - y0) * (t * t * (3 - 2 * t));
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * y0 +
    (t3 - 2 * t2 + t) * h * TANGENTS[i] +
    (-2 * t3 + 3 * t2) * y1 +
    (t3 - t2) * h * TANGENTS[i + 1]
  );
}

/** First day progress at which the clock reaches `minutes` (inverse of timeAt). */
export function progressAtTime(minutes: number) {
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    if (timeAt(mid) < minutes) lo = mid;
    else hi = mid;
  }
  return hi;
}

/**
 * 12-hour display, e.g. { time: "5:59", period: "AM" }. Floors to the minute
 * with an 18-second tolerance, so landing a pixel short of a key (scroll is
 * whole pixels) still reads the key's time.
 */
export function formatClock(minutes: number) {
  const total = Math.floor(minutes + 0.3) % 1440;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { time: `${h12}:${m.toString().padStart(2, "0")}`, period: h24 < 12 ? "AM" : "PM" };
}
