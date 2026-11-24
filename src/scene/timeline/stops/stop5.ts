import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { revealCopy } from "../copy";
import type { StopContext } from "../master";
import { drift, fadeTo, flash } from "./shared";

/**
 * Stop 5, 3 AM. Deploy, success, arms up.
 * Camera: pulls out wide; depth 1.5 for the biggest parallax of the day.
 * Light: the monitor floods the room green.
 * Surprise: the chair spins as he jumps out of it.
 */
export function stop5({ tl, cam, copy, el }: StopContext) {
  const s = STOPS[5];
  const t4 = transition(4);

  // Pan with him as he walks back (a slower pan lags behind and loses him
  // on narrow screens), landing on a shot that fits him and the monitor.
  // Zoom, tilt and depth ease over the whole transition.
  const { fx, fy, ...lens } = SHOTS[5];
  tl.to(cam, { fx, fy, duration: 1.4, ease: "sine.inOut" }, t4.start - 0.25);
  tl.to(cam, { ...lens, duration: t4.end - t4.start + 0.4, ease: "sine.inOut" }, t4.start - 0.25);
  drift(tl, cam, t4.end, s.holdEnd - t4.end, -8, 4);

  revealCopy(tl, copy.get(5), s.holdStart + 0.75);

  flash(tl, el("success-flash"), s.holdStart + 0.62, 0.45, 0.95);
  fadeTo(tl, el("success-flash"), s.holdStart + 1.07, 0.3, 0.35);

  const chair = el("chair");
  const spin = { svgOrigin: "613 700", ease: "power1.inOut", duration: 0.09 };
  tl.to(chair, { ...spin, scaleX: -1 }, s.holdStart + 0.66);
  tl.to(chair, { ...spin, scaleX: 1 }, s.holdStart + 0.75);
  tl.to(chair, { ...spin, scaleX: -1 }, s.holdStart + 0.84);
  tl.to(chair, { ...spin, scaleX: 1 }, s.holdStart + 0.93);
}
