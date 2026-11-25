import { CAT_SPOTS } from "../../character/catPoses";
import { catFace, catJump, catMove, catPose } from "../catRig";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo, flash, shake, wiggle } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo } from "../rig";

/**
 * Act 1, 6:00 to 6:20 (0.046-0.130). The alarm rings and shakes, the cat
 * startles (fur up, a hop) and leaps off the bed; he sits up, stands and
 * stretches. Small camera shake on the ring.
 * Light: red alarm pulses over the dawn, the first sun beam.
 * Surprise: the cat's startle leap.
 */
export function alarm({ tl, el, copy, rig, cat, reduce }: ActContext) {
  const ring = el("alarm-ring");
  tl.set(ring, { opacity: 1 }, 0.046);
  wiggle(tl, el("alarm"), 0.046, 0.03, 14);
  for (let i = 0; i < 3; i++) flash(tl, el("tint-error"), 0.047 + i * 0.009, 0.007, 0.2);
  if (!reduce) shake(tl, el("shake"), 0.047, 0.018, 6, 5);

  // The cat: eyes wide, fur up, a hop in place, then a leap off the bed.
  const bed = CAT_SPOTS.bed;
  catPose(tl, cat, "startled", 0.05, 0.003, "power3.out");
  catMove(tl, cat, undefined, bed.y - 30, 0.05, 0.003, "power2.out");
  catMove(tl, cat, undefined, bed.y, 0.053, 0.003, "power2.in");
  catFace(tl, cat, 1, 0.057);
  catJump(tl, cat, bed, CAT_SPOTS.floorByBed, 0.06, 0.01, 26);
  catPose(tl, cat, "sit", 0.074, 0.006);

  // He wakes, sits up and slaps the alarm quiet.
  express(tl, rig, { eyes: "open", mouth: "o" }, 0.052);
  poseTo(tl, rig, "sitUp", 0.054, 0.016);
  tl.to(el("blanket"), { scaleX: 0.55, svgOrigin: "466 670", duration: 0.016, ease: "power2.inOut" }, 0.056);
  tl.to(ring, { opacity: 0, duration: 0.003 }, 0.076);
  tl.to(el("zzz"), { opacity: 0, duration: 0.01 }, 0.056);

  poseTo(tl, rig, "stand", 0.078, 0.012);
  poseTo(tl, rig, "stretch", 0.092, 0.012);
  express(tl, rig, { eyes: "closed" }, 0.096);
  express(tl, rig, { eyes: "open", mouth: "smile" }, 0.108);

  revealCopy(tl, copy.get("alarm"), 0.084);
  exitCopy(tl, copy.get("alarm"), 0.122);

  fadeTo(tl, el("beam-morning"), 0.06, 0.04, 0.28);
}
