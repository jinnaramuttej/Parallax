/**
 * Shared geometry for the desk setup, in canvas units (1600x900). Art,
 * screen content, light masks and hotspots all read these so they line up.
 */

export type Rect = { x: number; y: number; w: number; h: number };

/** Desk top surface (things stand on y = DESK.y). */
export const DESK = { x: 616, y: 604, w: 648, h: 18 };

/** Main monitor bezel and screen (straight on). */
export const MAIN_BEZEL: Rect = { x: 820, y: 432, w: 240, h: 158 };
export const MAIN_SCREEN: Rect = { x: 832, y: 444, w: 216, h: 134 };

/** Second monitor, left of the main one, turned slightly toward him. */
export const SECOND_BEZEL: Rect = { x: 668, y: 466, w: 140, h: 104 };
export const SECOND_SCREEN: Rect = { x: 675, y: 473, w: 126, h: 84 };
const SECOND_C = { x: SECOND_BEZEL.x + SECOND_BEZEL.w / 2, y: SECOND_BEZEL.y + SECOND_BEZEL.h / 2 };
/** SVG transform that angles the second monitor (shared by frame and content). */
export const SECOND_TILT = `translate(${SECOND_C.x} ${SECOND_C.y}) skewY(-4) scale(0.94 1) translate(${-SECOND_C.x} ${-SECOND_C.y})`;

/** Apply SECOND_TILT to a point (for masks and hotspots). */
export function tiltPoint(x: number, y: number): [number, number] {
  const k = Math.tan((-4 * Math.PI) / 180);
  const lx = (x - SECOND_C.x) * 0.94;
  const ly = y - SECOND_C.y;
  return [SECOND_C.x + lx, SECOND_C.y + ly + k * lx];
}

/** Laptop, front right on the desk. */
export const LAPTOP_LID: Rect = { x: 1070, y: 534, w: 82, h: 64 };
export const LAPTOP_SCREEN: Rect = { x: 1076, y: 540, w: 70, h: 50 };

export const KEYBOARD: Rect = { x: 700, y: 588, w: 112, h: 14 };

/** All three screens, for masks and glows. */
export const SCREENS = { main: MAIN_SCREEN, second: SECOND_SCREEN, laptop: LAPTOP_SCREEN };

/** SVG path for a screen area (the second one is tilted). */
export function screenPath(name: keyof typeof SCREENS) {
  const r = SCREENS[name];
  const corners: [number, number][] = [
    [r.x, r.y],
    [r.x + r.w, r.y],
    [r.x + r.w, r.y + r.h],
    [r.x, r.y + r.h],
  ];
  const pts = name === "second" ? corners.map(([x, y]) => tiltPoint(x, y)) : corners;
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
}
