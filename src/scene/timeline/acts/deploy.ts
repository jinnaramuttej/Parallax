import { MOMENTS } from "@/config/acts";
import { POSES } from "../../character/poses";
import { revealCopy } from "../copy";
import { fadeTo, flash } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, scale } from "../rig";
import { canAppears, screens } from "./shared";

/**
 * 0.92-1.00, 2:30 to 3:00 AM. Deploy, success, arms up.
 * Light: the monitor floods the room green.
 * Surprise: the chair spins as he jumps out of it (confetti fires from UI).
 */
export function deploy({ tl, el, q, copy, rig }: ActContext) {
  const success = MOMENTS.deploySuccess;
  canAppears(tl, q, 3, 0.935);
  screens(tl, q, 0.935, "deploy", "deploy", "deploy");
  q('[data-el$="-deploy-bar"]').forEach((bar) =>
    tl.fromTo(bar, scale(0.02, 1), { ...scale(1, 1), duration: success - 0.939, ease: "power1.inOut" }, 0.937),
  );
  screens(tl, q, success, "success", "success", "success");

  flash(tl, el("success-flash"), success, 0.025, 0.95);
  fadeTo(tl, el("success-flash"), success + 0.026, 0.006, 0.35);

  poseTo(tl, rig, { ...POSES.stand, x: 690 }, success + 0.002, 0.009);
  poseTo(tl, rig, "celebrate", success + 0.011, 0.013, "back.out(1.2)");
  express(tl, rig, { mouth: "o" }, success + 0.011);

  const chair = el("chair");
  const spin = { svgOrigin: "613 700", ease: "power1.inOut", duration: 0.0035 };
  [-1, 1, -1, 1].forEach((sx, i) => tl.to(chair, { ...spin, scaleX: sx }, success + 0.002 + i * 0.004));

  revealCopy(tl, copy.get("deploy"), success + 0.006);
}
