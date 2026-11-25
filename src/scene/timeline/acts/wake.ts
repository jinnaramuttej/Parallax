import { POSES } from "../../character/poses";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, walk } from "../rig";

/**
 * 0.04-0.20, 6:00 to 7:00. Wakes, sits up, stands and stretches by the bed
 * (lingering around 6:20), then walks to the desk and sits as 7:00 arrives.
 * Light: the first sun slants in through the window.
 */
export function wake({ tl, el, copy, rig }: ActContext) {
  express(tl, rig, { eyes: "open", mouth: "o" }, 0.045);
  poseTo(tl, rig, "sitUp", 0.043, 0.023);
  tl.to(el("blanket"), { scaleX: 0.55, svgOrigin: "466 670", duration: 0.02, ease: "power2.inOut" }, 0.046);
  poseTo(tl, rig, "stand", 0.066, 0.016);
  poseTo(tl, rig, "stretch", 0.084, 0.014);

  revealCopy(tl, copy.get("wake"), 0.088);
  exitCopy(tl, copy.get("wake"), 0.135);

  fadeTo(tl, el("beam-morning"), 0.05, 0.04, 0.28);
  fadeTo(tl, el("beam-morning"), 0.18, 0.05, 0);

  express(tl, rig, { mouth: "smile" }, 0.14);
  walk(tl, rig, POSES.stretch.x, 586, 0.145, 0.043);
  poseTo(tl, rig, "seated", 0.188, 0.012);
}
