import { POSES, type Pose } from "../../character/poses";
import { exitCopy, revealCopy } from "../copy";
import type { ActContext } from "../master";
import { express, poseTo, rotate } from "../rig";
import { screens, typingWiggle } from "./shared";

/** Direction his near forearm points in the room (0 = straight down). */
const forearm = (p: Pose) => p.body + p.torso + p.armNearU + p.armNearL;

/** Rotation that keeps the hand-held mug upright for a pose (plus a tilt). */
const upright = (p: Pose, tilt = 0) => ({
  attr: { transform: `translate(0 56) rotate(${-forearm(p) + tilt})` },
});

/**
 * 0.20-0.46, 7:00 AM to 1:00 PM. At the desk at 7:00: coffee first (reach,
 * lift, sip, put it down), then the monitor wakes and the morning flies
 * past while he types.
 * Surprise: the coffee steam curls into a heart.
 */
export function desk({ tl, el, q, copy, rig }: ActContext) {
  revealCopy(tl, copy.get("desk"), 0.168);
  exitCopy(tl, copy.get("desk"), 0.275);

  // Fresh coffee steams on the desk from about 6:30.
  const steam = el("steam");
  tl.fromTo(steam, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.15);

  // Coffee first: reach, swap the desk mug for the one in his hand, sip.
  const deskMug = el("desk-mug");
  const handMug = el("hand-mug");
  const tilt = el("hand-mug-tilt");
  poseTo(tl, rig, "reachMug", 0.202, 0.008);
  tl.set(tilt, upright(POSES.reachMug), 0.21);
  tl.set(deskMug, { opacity: 0 }, 0.21);
  tl.set(handMug, { opacity: 1 }, 0.21);
  tl.to(steam, { opacity: 0, duration: 0.004 }, 0.21);

  // Lift: the mug's counter-rotation uses the arm's timing and ease, so it
  // stays upright all the way up, then tips toward his mouth.
  poseTo(tl, rig, "sip", 0.21, 0.012);
  tl.to(tilt, { ...upright(POSES.sip, 28), duration: 0.012, ease: "sine.inOut" }, 0.21);
  express(tl, rig, { eyes: "closed" }, 0.222);
  tl.to(rig.joints.head, { ...rotate(-18), duration: 0.006, ease: "sine.inOut" }, 0.224);
  tl.to(rig.joints.head, { ...rotate(POSES.sip.head), duration: 0.004, ease: "sine.inOut" }, 0.232);
  express(tl, rig, { eyes: "open", mouth: "smile" }, 0.236);

  // Put it down and let go.
  poseTo(tl, rig, "reachMug", 0.238, 0.01);
  tl.to(tilt, { ...upright(POSES.reachMug), duration: 0.01, ease: "sine.inOut" }, 0.238);
  tl.set(handMug, { opacity: 0 }, 0.248);
  tl.set(deskMug, { opacity: 1 }, 0.248);
  tl.to(steam, { opacity: 1, duration: 0.006 }, 0.249);

  const heart = el("steam-heart");
  tl.fromTo(
    heart,
    { opacity: 0, y: 30, scale: 0.6 },
    { opacity: 0.95, y: 0, scale: 1, duration: 0.014, ease: "sine.out", immediateRender: false },
    0.252,
  );
  tl.to(heart, { opacity: 0, y: -60, scale: 1.2, duration: 0.014, ease: "sine.in" }, 0.268);

  // Code second.
  screens(tl, q, 0.245, "code", "terminal", "chat");
  poseTo(tl, rig, "typing", 0.25, 0.012);
  express(tl, rig, { mouth: "flat" }, 0.258);
  typingWiggle(tl, rig, 0.264, 0.46 - 0.264);

  // Code scrolls with the page from here until the build breaks.
  q('[data-el^="code-scroll-"]').forEach((scroll) => {
    const block = Number((scroll as SVGGElement).dataset.block ?? 0);
    tl.fromTo(
      scroll,
      { attr: { transform: "translate(0 0)" } },
      { attr: { transform: `translate(0 ${-block})` }, duration: 0.63 - 0.25 },
      0.25,
    );
  });

  // The coffee goes cold by late morning.
  tl.to(steam, { opacity: 0, duration: 0.03 }, 0.32);
}
