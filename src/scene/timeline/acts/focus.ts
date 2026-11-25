import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { setState } from "../propState";
import { rgb, typingWiggle } from "./shared";

/**
 * Act 4, 10:00 AM to 12:30 PM (0.338-0.415). Deep focus: typing, code and
 * logs scrolling, a quick docs lookup. Slow orbit (from the shot config),
 * the sun at its peak.
 * Light: the room edges dim into a focus vignette; violet underglow.
 * Surprise: do-not-disturb rings pulse off his head.
 */
export function focus({ tl, el, q, rig }: ActContext) {
  rgb(tl, q, "violet", 0.34);

  fadeTo(tl, el("vignette"), 0.34, 0.012, 0.4);
  fadeTo(tl, el("vignette"), 0.4, 0.012, 0);

  const rings = el("dnd");
  for (let i = 0; i < 4; i++) {
    const at = 0.352 + i * 0.009;
    tl.fromTo(rings, { opacity: 0 }, { opacity: 1, duration: 0.004, ease: "sine.out", immediateRender: false }, at);
    tl.to(rings, { opacity: 0, duration: 0.004, ease: "sine.in" }, at + 0.004);
  }

  setState(tl, q, "screen-second", "docs", 0.37);
  setState(tl, q, "screen-second", "terminal", 0.398);

  typingWiggle(tl, rig, 0.338, 0.415 - 0.338);
}
