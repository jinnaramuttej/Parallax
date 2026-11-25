import { POSES } from "../../character/poses";
import { catPose } from "../catRig";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { setState } from "../propState";
import { rotate, translate } from "../rig";
import { canAppears, movieMotion, playVideo, rgb, typingWiggle, videoState } from "./shared";

const MOVIE = ["movie-small"];

/**
 * Act 6, 3:00 to 6:00 PM (0.546-0.646). A movie plays small on the second
 * monitor while he keeps typing; his head turns between the screens on a
 * loop. Split framing from the shot config.
 * Light: warm late-afternoon light, the movie's sunset glow.
 * Surprise: the movie's last subtitle talks about him ("...he's typing
 * again, isn't he?"), and the cat nods off.
 */
export function multitask({ tl, el, q, rig, cat }: ActContext) {
  setState(tl, q, "screen-second", "movie", 0.549);
  videoState(tl, q, MOVIE, "playing", 0.549);
  playVideo(tl, q, "movie", MOVIE, 0.552, 0.64);
  movieMotion(tl, q, 0.552, 0.64);
  fadeTo(tl, el("boot-glow-second"), 0.552, 0.01, 0.25);
  fadeTo(tl, el("boot-glow-second"), 0.636, 0.008, 0);
  setState(tl, q, "screen-laptop", "chat", 0.56);
  rgb(tl, q, "cyan", 0.55);

  // Glance at the movie, back to the code, on a loop. The pupil slides too.
  const pupil = rig.pupil;
  const main = POSES.typing.head;
  const glances = 7;
  const d = (0.632 - 0.556) / glances;
  for (let i = 0; i < glances; i++) {
    const at = 0.556 + i * d;
    tl.to(rig.joints.head, { ...rotate(main + 12), duration: d * 0.3, ease: "power2.inOut" }, at);
    tl.to(pupil, { ...translate(-2.5, 2.5), duration: d * 0.3, ease: "power2.inOut" }, at);
    tl.to(rig.joints.head, { ...rotate(main), duration: d * 0.3, ease: "power2.inOut" }, at + d * 0.55);
    tl.to(pupil, { ...translate(0, 0), duration: d * 0.3, ease: "power2.inOut" }, at + d * 0.55);
  }

  canAppears(tl, q, 0, 0.56);
  typingWiggle(tl, rig, 0.546, 0.646 - 0.546);

  // The cat, beside the chair, drifts off.
  catPose(tl, cat, "asleep", 0.6, 0.012);
  videoState(tl, q, MOVIE, "paused", 0.642);
}
