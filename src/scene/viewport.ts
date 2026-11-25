/** Design canvas size, in scene units. All scene art is drawn on this canvas. */
export const CANVAS_W = 1600;
export const CANVAS_H = 900;
/** Narrowest slice of the canvas we always keep visible (portrait phones). */
export const MIN_VISIBLE_W = 560;

/**
 * The same scale as measureViewport, as a script that runs in <head> before
 * the first paint (src/app/layout.tsx), so the canvas never resizes (and
 * shifts) when the scene hydrates. It measures with the scrollbar in place,
 * as the page always has one (globals.css keeps its gutter reserved).
 */
export const SCALE_SCRIPT = `(function(){try{var d=document.documentElement,o=d.style.overflowY;d.style.overflowY="scroll";var w=d.clientWidth,h=window.innerHeight;d.style.overflowY=o;d.style.setProperty("--s",Math.max(w/${CANVAS_W},Math.min(h/${CANVAS_H},w/${MIN_VISIBLE_W})).toFixed(5))}catch(e){}})()`;

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
