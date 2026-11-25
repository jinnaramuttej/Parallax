import { POSES } from "../../character/poses";
import { CAT_SPOTS } from "../../character/catPoses";
import { catFace, catJump, catMove, catPose, catWalk } from "../catRig";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo, flash, shake } from "../fx";
import type { ActContext } from "../master";
import { setState } from "../propState";
import { express, poseTo, walk } from "../rig";
import { canAppears, rgb, screens, tick, typingWiggle } from "./shared";

/** Where the cat lands on the desk, right by his open can. */
const DESK_LANDING = { x: 846, y: 592 };
/** End of its walk across the keys, within his reach. */
const KEYS_END = { x: 722, y: 592 };

/**
 * Act 7, 6:00 to 11:00 PM (0.646-0.777). Golden hour. The cat jumps onto
 * the desk and walks across the keyboard: red errors flood all three
 * screens, flashing, with a handheld shake. He panics, lifts the cat off,
 * and fixes it: the errors clear one by one, then green checks. Later he
 * heads for the fridge and the cat follows.
 * Light: golden-hour beam, red error pulses.
 * Surprise: the cat knocks his can over on the way.
 */
export function bug({ tl, el, q, copy, rig, cat, reduce }: ActContext) {
  fadeTo(tl, el("beam-evening"), 0.646, 0.02, 0.42);
  fadeTo(tl, el("beam-evening"), 0.732, 0.03, 0);

  // The cat wakes and jumps up next to the can: it tips over.
  catPose(tl, cat, "stand", 0.652, 0.003);
  catJump(tl, cat, { x: CAT_SPOTS.besideChair.x, y: 760 }, DESK_LANDING, 0.656, 0.01, 50);
  setState(tl, q, "desk-can", "spill", 0.666, 0.002);
  catFace(tl, cat, -1, 0.668);
  catWalk(tl, cat, DESK_LANDING.x, KEYS_END.x, KEYS_END.y, 0.669, 0.016);

  // Paws on keys: errors flood every screen, flashing.
  const fail = 0.674;
  screens(tl, q, fail, "error", "error", "error");
  rgb(tl, q, "red", fail);
  for (let i = 0; i < 4; i++) flash(tl, el("tint-error"), fail + i * 0.006, 0.006, i === 0 ? 0.6 : 0.4);
  if (!reduce) shake(tl, el("shake"), fail, 0.03, 8, 11);

  // He panics (hands on head), then lifts the cat off the keyboard.
  poseTo(tl, rig, "leanBack", fail + 0.001, 0.004, "power3.out");
  express(tl, rig, { mouth: "o" }, fail + 0.001);
  poseTo(tl, rig, "liftCat", 0.688, 0.005);
  catPose(tl, cat, "held", 0.692, 0.003);
  catMove(tl, cat, 700, 548, 0.692, 0.005, "power2.out");
  catMove(tl, cat, 500, 760, 0.697, 0.009, "power1.inOut");
  catFace(tl, cat, 1, 0.699);
  catPose(tl, cat, "sit", 0.705, 0.004);

  revealCopy(tl, copy.get("bug"), 0.68);
  exitCopy(tl, copy.get("bug"), 0.728);

  // Papers fly off the desk in the panic, then settle on the floor.
  const flights = [
    { x: -180, y: -260, r: -40, fx: -300, fy: 150, fr: -8 },
    { x: -60, y: -330, r: 25, fx: -160, fy: 152, fr: 6 },
    { x: 90, y: -280, r: 60, fx: 60, fy: 154, fr: 14 },
  ];
  flights.forEach((f, i) => {
    const sheet = q(`[data-paper="${i}"]`)[0];
    tl.fromTo(
      sheet,
      { attr: { transform: "translate(0 0) rotate(0) scale(1 0.12)" } },
      { attr: { transform: `translate(${f.x} ${f.y}) rotate(${f.r}) scale(1 1)` }, duration: 0.014, ease: "power2.out" },
      fail + i * 0.002,
    );
    tl.to(
      sheet,
      { attr: { transform: `translate(${f.fx} ${f.fy}) rotate(${f.fr}) scale(1 0.14)` }, duration: 0.034, ease: "power1.in" },
      fail + 0.015 + i * 0.002,
    );
  });

  // Fix it: furious typing, errors clear one by one, then green checks.
  poseTo(tl, rig, "typing", 0.704, 0.004);
  express(tl, rig, { mouth: "flat" }, 0.706);
  typingWiggle(tl, rig, 0.708, 0.734 - 0.708);
  canAppears(tl, q, 1, 0.7);
  setState(tl, q, "screen-laptop", "success", 0.713);
  setState(tl, q, "screen-second", "success", 0.719);
  setState(tl, q, "screen-main", "success", 0.725);
  rgb(tl, q, "green", 0.725);
  tick(tl, q, 2, 0.727);
  screens(tl, q, 0.738, "code", "terminal", "browser");

  // Later: up, and off to the fridge. The cat follows.
  express(tl, rig, { mouth: "smile" }, 0.742);
  poseTo(tl, rig, { ...POSES.stand, x: 640 }, 0.74, 0.007);
  walk(tl, rig, 640, POSES.atFridge.x, 0.748, 0.038);
  poseTo(tl, rig, "atFridge", 0.787, 0.004);
  catPose(tl, cat, "stand", 0.748, 0.003);
  catWalk(tl, cat, 500, 1160, 760, 0.752, 0.036);
  catPose(tl, cat, "sit", 0.79, 0.004);
}
