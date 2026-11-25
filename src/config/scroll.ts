import { ACTS } from "./acts";

/**
 * How scroll maps to day progress.
 *
 * The scene's scroll track is SCROLL_VH small-viewport heights long, plus
 * one viewport for the sticky stage: 1200vh of page in total.
 *
 * Each act has a linger span (acts.ts). Inside it, scrolling advances the
 * day LINGER times more slowly, so the important moments hold; between
 * acts the day travels faster. Resistance eases in and out over RAMP so the
 * change in pace is never felt as a bump.
 */
export const SCROLL_VH = 1100;
export const LINGER = 2.4;
const RAMP = 0.012;
/** No act may get less scroll than this. */
export const MIN_ACT_VH = 60;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Scroll needed per unit of progress at a given progress (1 = travel speed). */
function resistance(p: number) {
  let w = 1;
  for (const act of ACTS) {
    const [s, e] = act.linger;
    const k = smoothstep(s - RAMP, s, p) * (1 - smoothstep(e, e + RAMP, p));
    w = Math.max(w, 1 + (LINGER - 1) * k);
  }
  return w;
}

// Cumulative scroll at evenly spaced progress samples, normalised to 0-1.
const N = 4000;
const CUM = (() => {
  const c = new Float64Array(N + 1);
  for (let i = 1; i <= N; i++) {
    const p = (i - 0.5) / N;
    c[i] = c[i - 1] + resistance(p) / N;
  }
  const total = c[N];
  for (let i = 0; i <= N; i++) c[i] /= total;
  return c;
})();

/** Scroll fraction of the track (0-1) at which a day progress is reached. */
export function scrollFromProgress(progress: number) {
  const x = Math.min(1, Math.max(0, progress)) * N;
  const i = Math.min(N - 1, Math.floor(x));
  return CUM[i] + (CUM[i + 1] - CUM[i]) * (x - i);
}

/** Day progress (0-1) for a scroll fraction of the track (0-1). */
export function progressFromScroll(scroll: number) {
  const s = Math.min(1, Math.max(0, scroll));
  let lo = 0;
  let hi = N;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (CUM[mid] <= s) lo = mid;
    else hi = mid;
  }
  const span = CUM[hi] - CUM[lo] || 1;
  return (lo + (s - CUM[lo]) / span) / N;
}

/** Scroll length of each act, in vh (for checks and reports). */
export const ACT_SCROLL_VH = ACTS.map((act) => ({
  id: act.id,
  vh: (scrollFromProgress(act.endProgress) - scrollFromProgress(act.startProgress)) * SCROLL_VH,
}));

if (process.env.NODE_ENV !== "production") {
  for (const { id, vh } of ACT_SCROLL_VH) {
    if (vh < MIN_ACT_VH) console.warn(`[scroll] act "${id}" only gets ${vh.toFixed(0)}vh of scroll (min ${MIN_ACT_VH})`);
  }
}
