import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { exitCopy, revealCopy } from "../copy";
import type { StopContext } from "../master";
import { drift, fadeTo, shotTo } from "./shared";

/**
 * Stop 4, 11 PM. Fridge run in the dark, the moon high outside.
 * Camera: follows him across the room and settles on the fridge.
 * Light: cold fridge light spills across the floor when the door opens.
 * Surprise: a shooting star crosses the window.
 */
export function stop4({ tl, cam, copy, el }: StopContext) {
  const s = STOPS[4];
  const t3 = transition(3);
  const t4 = transition(4);

  shotTo(tl, cam, SHOTS[4], t3.start, t3.end - t3.start);
  drift(tl, cam, t3.end, t4.end - t3.end, 12, -4);

  revealCopy(tl, copy.get(4), s.holdStart + 0.1);
  exitCopy(tl, copy.get(4), s.holdEnd + 0.05);

  fadeTo(tl, el("fridge-spill"), s.holdStart - 0.2, 0.25, 0.75);
  fadeTo(tl, el("fridge-spill"), t4.start, 0.2, 0);

  const star = el("shooting-star");
  tl.fromTo(
    star,
    { xPercent: -100, opacity: 0 },
    { xPercent: 290, duration: 0.45, ease: "power1.in", immediateRender: false },
    s.holdStart + 0.45,
  );
  tl.to(star, { opacity: 1, duration: 0.08 }, s.holdStart + 0.45);
  tl.to(star, { opacity: 0, duration: 0.12 }, s.holdStart + 0.78);
}
