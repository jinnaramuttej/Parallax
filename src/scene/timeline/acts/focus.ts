import { exitCopy, revealCopy } from "../copy";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { canAppears, typingWiggle } from "./shared";

/**
 * 0.46-0.66, 1:00 to 6:00 PM. Deep focus.
 * Light: the room edges dim into a focus vignette.
 * Surprise: headphones snap on and do-not-disturb rings pulse.
 */
export function focus({ tl, el, q, copy, rig }: ActContext) {
  revealCopy(tl, copy.get("focus"), 0.428);
  exitCopy(tl, copy.get("focus"), 0.535);

  fadeTo(tl, el("vignette"), 0.445, 0.015, 0.4);
  fadeTo(tl, el("vignette"), 0.54, 0.03, 0);

  tl.fromTo(
    rig.headphones,
    { opacity: 0, attr: { transform: "translate(0 -34)" } },
    { opacity: 1, attr: { transform: "translate(0 0)" }, duration: 0.009, ease: "back.out(2.5)" },
    0.452,
  );
  const rings = el("dnd");
  for (let i = 0; i < 4; i++) {
    const at = 0.462 + i * 0.014;
    tl.fromTo(rings, { opacity: 0 }, { opacity: 1, duration: 0.006, ease: "sine.out", immediateRender: false }, at);
    tl.to(rings, { opacity: 0, duration: 0.007, ease: "sine.in" }, at + 0.006);
  }

  canAppears(tl, q, 0, 0.475);
  typingWiggle(tl, rig, 0.46, 0.612 - 0.46);
  // Headphones come off when the build breaks.
  tl.to(rig.headphones, { opacity: 0, duration: 0.006 }, 0.622);
}
