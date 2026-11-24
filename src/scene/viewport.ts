/** Design canvas size, in scene units. All scene art is drawn on this canvas. */
export const CANVAS_W = 1600;
export const CANVAS_H = 900;
/** Narrowest slice of the canvas we always keep visible (portrait phones). */
const MIN_VISIBLE_W = 560;

export const viewport = { w: 0, h: 0, s: 1 };

/**
 * Scale the canvas to cover the stage, but never zoom in so far that less
 * than MIN_VISIBLE_W units are visible. Bleed art fills any leftover space.
 * Called on mount and on ScrollTrigger refreshInit (resize), never per frame.
 */
export function measureViewport(stage: HTMLElement) {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const s = Math.max(w / CANVAS_W, Math.min(h / CANVAS_H, w / MIN_VISIBLE_W));
  viewport.w = w;
  viewport.h = h;
  viewport.s = s;
  stage.style.setProperty("--s", s.toFixed(5));
}

/** Absolutely position an HTML box on the canvas, in canvas units. */
export function box(x: number, y: number, w: number, h: number) {
  return {
    left: `${(x / CANVAS_W) * 100}%`,
    top: `${(y / CANVAS_H) * 100}%`,
    width: `${(w / CANVAS_W) * 100}%`,
    height: `${(h / CANVAS_H) * 100}%`,
  } as const;
}
