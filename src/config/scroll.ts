/**
 * How scroll maps to day progress. The scene's scroll track is SCROLL_VH
 * small-viewport heights long (plus one viewport for the sticky stage).
 */
export const SCROLL_VH = 1000;

/** Day progress (0-1) for a scroll fraction of the track (0-1). */
export function progressFromScroll(scroll: number) {
  return Math.min(1, Math.max(0, scroll));
}

/** Scroll fraction of the track (0-1) at which a day progress is reached. */
export function scrollFromProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}
