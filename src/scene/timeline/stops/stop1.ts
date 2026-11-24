import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { exitCopy, revealCopy } from "../copy";
import type { StopContext } from "../master";
import { drift, fadeTo, shotTo } from "./shared";

/**
 * Stop 1, 7 AM. Up, stretching, coffee steaming in the foreground.
 * Camera: pulls back from the bed to a wider shot as he gets up.
 * Light: the first sun slants in through the window.
 * Surprise: the coffee steam curls into a heart.
 */
export function stop1({ tl, cam, copy, el }: StopContext) {
  const s = STOPS[1];
  const t0 = transition(0);
  const t1 = transition(1);

  shotTo(tl, cam, SHOTS[1], t0.start, t0.end - t0.start);
  drift(tl, cam, t0.end, t1.end - t0.end, -14, 6);

  revealCopy(tl, copy.get(1), s.holdStart - 0.15);
  exitCopy(tl, copy.get(1), s.holdEnd + 0.05);

  fadeTo(tl, el("beam-morning"), t0.start + 0.6, 0.8, 0.28);
  fadeTo(tl, el("beam-morning"), t1.start + 0.3, 0.9, 0);

  const heart = el("steam-heart");
  tl.fromTo(
    heart,
    { opacity: 0, y: 40, scale: 0.6 },
    { opacity: 0.95, y: 0, scale: 1, duration: 0.35, ease: "sine.out", immediateRender: false },
    s.holdStart + 0.2,
  );
  tl.to(heart, { opacity: 0, y: -70, scale: 1.2, duration: 0.4, ease: "sine.in" }, s.holdStart + 0.7);
}
