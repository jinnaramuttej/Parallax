import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { exitCopy, revealCopy } from "../copy";
import type { StopContext } from "../master";
import { drift, fadeTo, shotTo } from "./shared";

/**
 * Stop 2, 1 PM. Deep focus at the desk, code scrolling.
 * Camera: tight on the desk; depth 0.6 so the parallax calms right down.
 * Light: the room edges dim into a focus vignette.
 * Surprise: headphones snap on and do-not-disturb rings pulse.
 */
export function stop2({ tl, cam, copy, el, rig }: StopContext) {
  const s = STOPS[2];
  const t1 = transition(1);
  const t2 = transition(2);

  shotTo(tl, cam, SHOTS[2], t1.start, t1.end - t1.start);
  drift(tl, cam, t1.end, t2.end - t1.end, 10, -4);

  revealCopy(tl, copy.get(2), s.holdStart - 0.15);
  exitCopy(tl, copy.get(2), s.holdEnd + 0.05);

  fadeTo(tl, el("vignette"), s.holdStart - 0.15, 0.35, 0.4);
  fadeTo(tl, el("vignette"), s.holdEnd + 0.2, 0.5, 0);

  tl.fromTo(
    rig.headphones,
    { opacity: 0, attr: { transform: "translate(0 -34)" } },
    { opacity: 1, attr: { transform: "translate(0 0)" }, duration: 0.14, ease: "back.out(2.5)" },
    s.holdStart + 0.02,
  );
  const rings = el("dnd");
  for (let i = 0; i < 4; i++) {
    tl.fromTo(
      rings,
      { opacity: 0 },
      { opacity: 1, duration: 0.1, ease: "sine.out", immediateRender: false },
      s.holdStart + 0.2 + i * 0.24,
    );
    tl.to(rings, { opacity: 0, duration: 0.12, ease: "sine.in" }, s.holdStart + 0.3 + i * 0.24);
  }
  // Headphones come off when the build breaks.
  tl.to(rig.headphones, { opacity: 0, duration: 0.1 }, t2.start + 1.0);
}
