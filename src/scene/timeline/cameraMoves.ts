import { gsap } from "@/lib/gsap";
import { STOPS, TOTAL, transition } from "../timing";
import type { CameraState } from "./camera";
import type { BuildContext } from "./master";

/** What the camera centres on at each stop (canvas units). */
export const FOCUS = [
  { fx: 270, fy: 560 }, // bed
  { fx: 500, fy: 520 }, // stretching by the bed
  { fx: 760, fy: 520 }, // desk
  { fx: 720, fy: 520 }, // desk, leaning back
  { fx: 1290, fy: 540 }, // fridge
  { fx: 760, fy: 500 }, // desk, celebrating
];

/** Camera path: follow the guy between stops, plus a slow drift all day. */
export function addCameraMoves({ tl }: BuildContext, cam: CameraState) {
  gsap.set(cam, FOCUS[0]);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const t = transition(i);
    tl.to(cam, { ...FOCUS[i + 1], duration: t.end - t.start, ease: "sine.inOut" }, t.start);
  }
  tl.fromTo(
    cam,
    { dx: -50, dy: 18, zoom: 1.03 },
    { dx: 50, dy: -18, zoom: 1.03, duration: TOTAL },
    0,
  );
}
