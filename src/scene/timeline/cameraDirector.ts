import { gsap } from "@/lib/gsap";
import { ACTS } from "@/config/acts";
import { SHOTS } from "@/config/shots";
import type { CameraState } from "./camera";

type TL = gsap.core.Timeline;

/**
 * Turn each act's camera config into tweens on the master timeline:
 * arrive into the act's shot during its `arrive` window, then play the
 * shot's in-act move (push, sway, drift) until the next act's camera starts
 * moving. Everything comes from src/config/acts.ts and shots.ts.
 */
export function addCameraDirection(tl: TL, cam: CameraState) {
  ACTS.forEach((act, i) => {
    const shot = SHOTS[act.camera.shot];
    const [fx, fy] = act.camera.focus;
    const [from, to] = act.camera.arrive;
    const framing = { fx, fy, zoom: shot.zoom, rot: shot.rot, depth: shot.depth };

    if (i === 0 || to <= from) gsap.set(cam, framing);
    else tl.to(cam, { ...framing, duration: to - from, ease: shot.ease }, from);

    // In-act motion runs until the next act's camera starts to move.
    const until = ACTS[i + 1]?.camera.arrive[0] ?? 1;
    const hold = until - to;
    if (hold <= 0) return;
    if (shot.push) tl.to(cam, { zoom: shot.zoom + shot.push, duration: hold, ease: "sine.inOut" }, to);
    if (shot.sway) tl.to(cam, { rot: -shot.rot, duration: hold, ease: "sine.inOut" }, to);
    const dir = i % 2 === 0 ? 1 : -1;
    tl.to(cam, { dx: (shot.drift ?? 6) * dir, dy: -4 * dir, duration: hold + (to - from), ease: "sine.inOut" }, from);
  });
}
