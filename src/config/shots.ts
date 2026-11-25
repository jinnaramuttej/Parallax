/**
 * Camera shot presets. Acts pick one by name in src/config/acts.ts; the
 * camera director turns it into tweens on the master timeline. Add or tune
 * shots here, no code changes needed.
 *
 * zoom: 1 = canvas fits the stage. rot: tilt in degrees.
 * depth: parallax spread (>1 pushes layers apart, <1 flattens them).
 * ease: how the camera moves into the shot.
 * During the act: push adds zoom, sway swings the tilt to -rot, drift
 * slides sideways (canvas units).
 */
export type ShotType = "wide" | "pushIn" | "whipPan" | "orbit" | "split";

export type Shot = {
  zoom: number;
  rot: number;
  depth: number;
  ease: string;
  push?: number;
  sway?: boolean;
  drift?: number;
};

export const SHOTS: Record<ShotType, Shot> = {
  wide: { zoom: 1.02, rot: 0, depth: 1.1, ease: "sine.inOut", drift: 14 },
  pushIn: { zoom: 1.1, rot: 0, depth: 0.8, ease: "sine.inOut", push: 0.06, drift: 8 },
  whipPan: { zoom: 1.1, rot: -0.8, depth: 1.25, ease: "expo.inOut", drift: 10 },
  orbit: { zoom: 1.06, rot: 1.2, depth: 1.4, ease: "sine.inOut", sway: true },
  split: { zoom: 1, rot: 0, depth: 1.5, ease: "sine.inOut", drift: 8 },
};
