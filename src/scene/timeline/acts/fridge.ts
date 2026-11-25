import { MOMENTS } from "@/config/acts";
import { CAT_SPOTS } from "../../character/catPoses";
import { POSES } from "../../character/poses";
import { catFace, catPose, catWalk } from "../catRig";
import { fadeTo, wiggle } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, turn, walk } from "../rig";
import { canAppears, rgb, typingWiggle } from "./shared";

/**
 * Act 8, 11:00 PM to 2:30 AM (0.777-0.885). At the fridge: the door opens
 * and cold light spills out, he grabs a can and cracks it, sips, and heads
 * back to the desk with the cat at his heels. The moon is up, the skyline
 * lights up and the string lights come on (from the clock, see world.ts).
 * Light: the fridge's cold spill on the floor; green underglow.
 * Surprise: a shooting star crosses the window.
 */
export function fridge({ tl, el, q, rig, cat }: ActContext) {
  const [open, close] = MOMENTS.fridgeDoorOpen;
  tl.to(el("fridge-door"), { scaleX: -0.55, svgOrigin: "1502 632", duration: 0.01, ease: "power2.out" }, open);
  fadeTo(tl, el("fridge-spill"), open, 0.01, 0.75);
  fadeTo(tl, el("fridge-light"), open, 0.008, 1);
  rgb(tl, q, "green", 0.79);

  // Grab a can, crack it open, sip.
  tl.set(rig.handCan, { opacity: 1 }, 0.797);
  poseTo(tl, rig, "holdCan", 0.797, 0.006);
  express(tl, rig, { mouth: "smile" }, 0.8);
  poseTo(tl, rig, "crackCan", 0.806, 0.004);
  wiggle(tl, rig.handCan, 0.81, 0.004, 6);
  express(tl, rig, { mouth: "o" }, 0.81);
  poseTo(tl, rig, "sipCan", 0.818, 0.006);
  express(tl, rig, { eyes: "closed" }, 0.822);
  express(tl, rig, { eyes: "open", mouth: "smile" }, 0.83);
  poseTo(tl, rig, "holdCan", 0.832, 0.006);

  const star = el("shooting-star");
  tl.fromTo(star, { xPercent: -100, opacity: 0 }, { xPercent: 290, duration: 0.02, ease: "power1.in", immediateRender: false }, 0.82);
  tl.to(star, { opacity: 1, duration: 0.003 }, 0.82);
  tl.to(star, { opacity: 0, duration: 0.005 }, 0.835);

  tl.to(el("fridge-door"), { scaleX: 1, svgOrigin: "1502 632", duration: 0.01, ease: "power2.in" }, close - 0.01);
  fadeTo(tl, el("fridge-spill"), close - 0.01, 0.01, 0);
  fadeTo(tl, el("fridge-light"), close - 0.005, 0.005, 0);

  // Back to the desk; the can joins the pile. The cat trails him.
  turn(tl, rig, -1, 0.846);
  walk(tl, rig, POSES.holdCan.x, 640, 0.849, 0.026);
  turn(tl, rig, 1, 0.875);
  tl.set(rig.handCan, { opacity: 0 }, 0.879);
  poseTo(tl, rig, "typing", 0.876, 0.006);
  express(tl, rig, { mouth: "flat" }, 0.879);
  canAppears(tl, q, 2, 0.88);
  typingWiggle(tl, rig, 0.882, 0.885 - 0.882);

  catPose(tl, cat, "stand", 0.848, 0.003);
  catFace(tl, cat, -1, 0.85);
  catWalk(tl, cat, 1160, CAT_SPOTS.besideChair.x + 40, 760, 0.852, 0.026);
  catFace(tl, cat, 1, 0.879);
  catPose(tl, cat, "sit", 0.88, 0.004);
}
