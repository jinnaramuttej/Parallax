import { gsap } from "@/lib/gsap";
import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { exitCopy, showCopyNow } from "../copy";
import type { StopContext } from "../master";
import { drift, flash, shake, wiggle } from "./shared";

/**
 * Stop 0, 5:59 AM. Asleep under the blanket, alarm ringing.
 * Camera: tight on the bed, slow drift. Light: pre-dawn purple with red
 * alarm pulses. Surprise: the alarm shakes the whole screen.
 */
export function stop0({ tl, cam, copy, el, reduce }: StopContext) {
  const s = STOPS[0];
  const t = transition(0);

  gsap.set(cam, { ...SHOTS[0], dx: -10, dy: 4 });
  drift(tl, cam, 0, t.end, 12, -6);

  showCopyNow(copy.get(0));
  exitCopy(tl, copy.get(0), s.holdEnd + 0.05);

  const ring = el("alarm-ring");
  gsap.set(ring, { opacity: 1 });
  wiggle(tl, el("alarm"), 0.05, 0.9, 14);
  for (let i = 0; i < 3; i++) flash(tl, el("tint-error"), 0.1 + i * 0.28, 0.24, 0.22);
  if (!reduce) shake(tl, el("shake"), 0.12, 0.75, 14, 5);
  // He slaps the alarm off as he wakes.
  tl.to(ring, { opacity: 0, duration: 0.08 }, t.start + 0.08);
}
