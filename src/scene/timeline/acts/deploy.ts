import { MOMENTS } from "@/config/acts";
import { CAT_SPOTS } from "../../character/catPoses";
import { POSES } from "../../character/poses";
import { catJump } from "../catRig";
import { revealCopy } from "../copy";
import { fadeTo, flash } from "../fx";
import type { ActContext } from "../master";
import { setState } from "../propState";
import { express, poseTo, scale } from "../rig";
import { canAppears, rgb, screens, tick, typingWiggle } from "./shared";

/** Where the cat lands on him before it settles across his shoulders. */
const SHOULDER = { x: 562, y: 572 };

/**
 * Act 9, 2:30 to 3:00 AM (0.885-1.000). The cat climbs onto his shoulder.
 * Deploy: a bar fills across all three screens, then green everywhere,
 * confetti (UI), arms up, the chair spins, and the camera pulls back wide
 * into the finale stats.
 * Light: the screens flood the room green; rainbow underglow.
 * Surprise: the chair spins as he jumps out of it, cat still on his shoulder.
 */
export function deploy({ tl, el, q, copy, rig, cat }: ActContext) {
  const success = MOMENTS.deploySuccess;
  typingWiggle(tl, rig, 0.885, 0.93 - 0.885);
  canAppears(tl, q, 3, 0.9);

  // The cat leaps up and settles across his shoulders.
  catJump(tl, cat, { x: CAT_SPOTS.besideChair.x + 40, y: 760 }, SHOULDER, 0.904, 0.008, 40);
  tl.set(cat.root, { opacity: 0 }, 0.913);
  tl.set(el("shoulder-cat"), { opacity: 1 }, 0.913);
  express(tl, rig, { mouth: "smile" }, 0.914);

  screens(tl, q, 0.935, "deploy", "deploy", "deploy");
  q('[data-el$="-deploy-bar"]').forEach((bar) =>
    tl.fromTo(bar, scale(0.02, 1), { ...scale(1, 1), duration: success - 0.939, ease: "power1.inOut", immediateRender: false }, 0.937),
  );
  screens(tl, q, success, "success", "success", "success");
  setState(tl, q, "poster-ship", "done", success);
  tick(tl, q, 3, success + 0.003);
  rgb(tl, q, "rainbow", success);

  flash(tl, el("success-flash"), success, 0.02, 0.95);
  fadeTo(tl, el("success-flash"), success + 0.021, 0.006, 0.35);

  poseTo(tl, rig, { ...POSES.stand, x: 690 }, success + 0.002, 0.008);
  poseTo(tl, rig, "celebrate", success + 0.01, 0.01, "back.out(1.2)");
  express(tl, rig, { mouth: "o" }, success + 0.01);

  const chair = el("chair");
  const spin = { svgOrigin: "613 700", ease: "power1.inOut", duration: 0.003 };
  [-1, 1, -1, 1].forEach((sx, i) => tl.to(chair, { ...spin, scaleX: sx }, success + 0.002 + i * 0.0035));

  revealCopy(tl, copy.get("deploy"), success + 0.006);
}
