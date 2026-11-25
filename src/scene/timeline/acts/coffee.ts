import { POSES, type Pose } from "../../character/poses";
import { CAT_SPOTS } from "../../character/catPoses";
import { catJump, catMove, catPose, catWalk } from "../catRig";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, rotate, walk } from "../rig";
import { tick } from "./shared";

/** Direction his near forearm points in the room (0 = straight down). */
const forearm = (p: Pose) => p.body + p.torso + p.armNearU + p.armNearL;

/** Rotation that keeps the hand-held mug upright for a pose (plus a tilt). */
const upright = (p: Pose, tilt = 0) => ({
  attr: { transform: `translate(0 56) rotate(${-forearm(p) + tilt})` },
});

/** The cat curls up on the bean bag. */
const BEAN_BAG = { x: 1214, y: 700 };

/**
 * Act 2, 6:20 to 7:00 (0.130-0.223). He walks to the desk (the camera
 * follows), sits, picks up the mug and sips. The cat trots over to the
 * bean bag and goes back to sleep.
 * Light: sunrise beams through the window, dust in them.
 * Surprise: the coffee steam curls into a heart.
 */
export function coffee({ tl, el, q, copy, rig, cat }: ActContext) {
  express(tl, rig, { mouth: "smile" }, 0.13);
  walk(tl, rig, POSES.stretch.x, 586, 0.134, 0.04);
  poseTo(tl, rig, "seated", 0.175, 0.008);

  // The cat follows, then hops onto the bean bag and curls up.
  catWalk(tl, cat, CAT_SPOTS.floorByBed.x, BEAN_BAG.x - 60, 760, 0.14, 0.044);
  catJump(tl, cat, { x: BEAN_BAG.x - 60, y: 760 }, BEAN_BAG, 0.188, 0.008, 22);
  catPose(tl, cat, "asleep", 0.2, 0.01);
  catMove(tl, cat, BEAN_BAG.x, BEAN_BAG.y + 2, 0.2, 0.01);

  revealCopy(tl, copy.get("coffee"), 0.15);
  exitCopy(tl, copy.get("coffee"), 0.205);

  // Fresh coffee steams on the desk.
  const steam = el("steam");
  tl.fromTo(steam, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.14);

  // Reach, swap the desk mug for the one in his hand, sip.
  const deskMug = el("desk-mug");
  const handMug = el("hand-mug");
  const tilt = el("hand-mug-tilt");
  poseTo(tl, rig, "reachMug", 0.185, 0.006);
  tl.set(tilt, upright(POSES.reachMug), 0.191);
  tl.set(deskMug, { opacity: 0 }, 0.191);
  tl.set(handMug, { opacity: 1 }, 0.191);
  tl.to(steam, { opacity: 0, duration: 0.003 }, 0.191);

  // Lift: the mug counter-rotates with the arm so it stays upright, then tips.
  poseTo(tl, rig, "sip", 0.191, 0.009);
  tl.to(tilt, { ...upright(POSES.sip, 28), duration: 0.009, ease: "sine.inOut" }, 0.191);
  express(tl, rig, { eyes: "closed" }, 0.2);
  tl.to(rig.joints.head, { ...rotate(-18), duration: 0.004, ease: "sine.inOut" }, 0.201);
  tl.to(rig.joints.head, { ...rotate(POSES.sip.head), duration: 0.003, ease: "sine.inOut" }, 0.206);
  express(tl, rig, { eyes: "open", mouth: "smile" }, 0.209);

  // Put it down and let go.
  poseTo(tl, rig, "reachMug", 0.21, 0.006);
  tl.to(tilt, { ...upright(POSES.reachMug), duration: 0.006, ease: "sine.inOut" }, 0.21);
  tl.set(handMug, { opacity: 0 }, 0.216);
  tl.set(deskMug, { opacity: 1 }, 0.216);
  tl.to(steam, { opacity: 1, duration: 0.004 }, 0.217);
  tick(tl, q, 0, 0.212);

  const heart = el("steam-heart");
  tl.fromTo(
    heart,
    { opacity: 0, y: 30, scale: 0.6 },
    { opacity: 0.95, y: 0, scale: 1, duration: 0.01, ease: "sine.out", immediateRender: false },
    0.217,
  );
  tl.to(heart, { opacity: 0, y: -60, scale: 1.2, duration: 0.01, ease: "sine.in" }, 0.229);

  fadeTo(tl, el("beam-morning"), 0.205, 0.04, 0);
}
