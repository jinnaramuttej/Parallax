import { gsap } from "@/lib/gsap";
import { exitCopy, showCopyNow } from "../copy";
import { flash, shake, wiggle } from "../fx";
import type { ActContext } from "../master";

/**
 * 0.00-0.04, 5:59 AM. Asleep under the blanket, the alarm ringing.
 * Light: pre-dawn purple with red alarm pulses.
 * Surprise: the alarm shakes the whole screen.
 */
export function alarm({ tl, el, copy, reduce }: ActContext) {
  showCopyNow(copy.get("alarm"));
  exitCopy(tl, copy.get("alarm"), 0.024);

  const ring = el("alarm-ring");
  gsap.set([ring, el("zzz"), el("steam")], { opacity: 1 });
  wiggle(tl, el("alarm"), 0.002, 0.032, 14);
  for (let i = 0; i < 3; i++) flash(tl, el("tint-error"), 0.005 + i * 0.01, 0.008, 0.22);
  if (!reduce) shake(tl, el("shake"), 0.004, 0.028, 14, 5);

  // He slaps the alarm off and the Zs drift away.
  tl.to(ring, { opacity: 0, duration: 0.004 }, 0.038);
  tl.to(el("zzz"), { opacity: 0, duration: 0.012 }, 0.04);
}
