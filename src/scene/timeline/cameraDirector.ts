import { gsap } from "@/lib/gsap";
import { ACTS } from "@/config/acts";
import { SHOTS } from "@/config/shots";
import type { CameraState } from "./camera";

type TL = gsap.core.Timeline;

/**
 * Turn each act's camera config into tweens on the master timeline:
 * arrive into the act's shot during its `arrive` window, then play the
 * shot's in-act move (push, sway, drift) until the next act's camera starts
 * moving, plus the act's extra beats (camera.moves). Everything comes from
 * src/config/acts.ts and shots.ts.
 */
export function addCameraDirection(tl: TL, cam: CameraState) {
  ACTS.forEach((act, i) => {
    const shot = SHOTS[act.camera.shot];
    const [fx, fy] = act.camera.focus;
    const [from, to] = act.camera.arrive;
    const framing = { fx, fy, zoom: shot.zoom, rot: shot.rot, depth: shot.depth };

    if (i === 0 || to <= from) gsap.set(cam, framing);
    else tl.to(cam, { ...framing, duration: to - from, ease: shot.ease }, from);

    // Beats inside the act (close-ups, slides, whip pans, pull-backs).
    const moves = act.camera.moves ?? [];
    for (const move of moves) {
      const [a, b] = move.at;
      const target: Partial<CameraState> = {};
      if (move.focus) [target.fx, target.fy] = move.focus;
      if (move.zoom !== undefined) target.zoom = move.zoom;
      if (move.rot !== undefined) target.rot = move.rot;
      if (move.depth !== undefined) target.depth = move.depth;
      tl.to(cam, { ...target, duration: b - a, ease: move.ease ?? "sine.inOut" }, a);
      if (move.whip) {
        const half = (b - a) / 2;
        tl.to(cam, { blur: 1, duration: half, ease: "power2.in" }, a);
        tl.to(cam, { blur: 0, duration: half, ease: "power2.out" }, a + half);
      }
    }

    // In-act motion runs until the next act's camera starts to move. Acts
    // with beats own zoom and tilt themselves, so only the drift applies.
    const until = ACTS[i + 1]?.camera.arrive[0] ?? 1;
    const hold = until - to;
    if (hold <= 0) return;
    if (!moves.length && shot.push) tl.to(cam, { zoom: shot.zoom + shot.push, duration: hold, ease: "sine.inOut" }, to);
    if (!moves.length && shot.sway) tl.to(cam, { rot: -shot.rot, duration: hold, ease: "sine.inOut" }, to);
    const dir = i % 2 === 0 ? 1 : -1;
    tl.to(cam, { dx: (shot.drift ?? 6) * dir, dy: -4 * dir, duration: hold + (to - from), ease: "sine.inOut" }, from);
  });
}
