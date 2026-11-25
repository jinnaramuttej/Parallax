import { MOMENTS } from "@/config/acts";
import { POSES } from "../../character/poses";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, turn, walk } from "../rig";
import { canAppears, typingWiggle } from "./shared";

/**
 * 0.80-0.92, 11 PM to 2:30 AM. Grabs a can from the open fridge, walks
 * back to the desk, keeps going.
 * Light: cold fridge light spills across the floor.
 * Surprise: a shooting star crosses the window.
 */
export function fridge({ tl, el, q, copy, rig }: ActContext) {
  tl.set(rig.handCan, { opacity: 1 }, 0.8);
  poseTo(tl, rig, "holdCan", 0.8, 0.018);
  express(tl, rig, { mouth: "smile" }, 0.804);

  revealCopy(tl, copy.get("fridge"), 0.768);
  exitCopy(tl, copy.get("fridge"), 0.843);

  const star = el("shooting-star");
  tl.fromTo(star, { xPercent: -100, opacity: 0 }, { xPercent: 290, duration: 0.025, ease: "power1.in", immediateRender: false }, 0.812);
  tl.to(star, { opacity: 1, duration: 0.004 }, 0.812);
  tl.to(star, { opacity: 0, duration: 0.006 }, 0.831);

  const [, close] = MOMENTS.fridgeDoorOpen;
  tl.to(el("fridge-door"), { scaleX: 1, svgOrigin: "1502 632", duration: 0.012, ease: "power2.in" }, close - 0.012);
  fadeTo(tl, el("fridge-spill"), close - 0.012, 0.01, 0);

  turn(tl, rig, -1, 0.846);
  walk(tl, rig, POSES.holdCan.x, 640, 0.85, 0.038);
  turn(tl, rig, 1, 0.888);
  tl.set(rig.handCan, { opacity: 0 }, 0.893);
  poseTo(tl, rig, "typing", 0.892, 0.012);
  express(tl, rig, { mouth: "flat" }, 0.894);
  canAppears(tl, q, 2, 0.896);
  typingWiggle(tl, rig, 0.905, 0.023);
}
