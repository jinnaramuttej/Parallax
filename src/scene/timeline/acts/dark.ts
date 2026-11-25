import { gsap } from "@/lib/gsap";
import { catEyes } from "../catRig";
import type { ActContext } from "../master";
import { rgb } from "./shared";

/**
 * Act 0, 5:59 AM (0.000-0.046). The room is dark, he and the cat are
 * asleep, the camera drifts wide. Faint pre-dawn light with dust in it.
 * Light: night blue, the first hint of dawn in the window.
 * Surprise: the cat opens its eyes in the dark, a minute before the alarm.
 */
export function dark({ tl, el, q, cat }: ActContext) {
  gsap.set(el("zzz"), { opacity: 1 });
  gsap.set(el("beam-morning"), { opacity: 0.1 });
  rgb(tl, q, "off", 0);

  catEyes(tl, cat, "open", 0.02);
  catEyes(tl, cat, "closed", 0.034);
}
