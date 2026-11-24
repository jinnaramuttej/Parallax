import { POSES } from "../character/poses";
import { STOPS, transition } from "../timing";
import type { BuildContext } from "./master";
import {
  createRig,
  express,
  poseTo,
  rotate,
  turn,
  walk,
  type Rig,
} from "./rig";

/**
 * Character blocking: where the guy is and how he's posed at each stop.
 * Asleep -> stretching -> walking to the desk -> typing -> leaning back,
 * hands on head -> standing at the fridge -> arms up celebrating.
 */
export function addCharacterBlocking({ tl, q }: BuildContext) {
  const rig = createRig(q);
  const [, , s2, s3, s4, s5] = STOPS;
  const [t0, t1, t2, t3, t4] = [0, 1, 2, 3, 4].map(transition);

  // 0 -> 1: wake up, sit up, stand, stretch with a yawn.
  express(tl, rig, { eyes: "open", mouth: "o" }, t0.start + 0.15);
  poseTo(tl, rig, "sitUp", t0.start + 0.1, 0.55);
  poseTo(tl, rig, "stand", t0.start + 0.65, 0.45);
  poseTo(tl, rig, "stretch", t0.start + 1.1, 0.4);

  // 1 -> 2: walk to the desk, sit, start typing.
  express(tl, rig, { mouth: "smile" }, t1.start);
  walk(tl, rig, POSES.stretch.x, 586, t1.start + 0.15, 0.7);
  poseTo(tl, rig, "typing", t1.start + 0.85, 0.5);
  express(tl, rig, { mouth: "flat" }, t1.start + 1.2);
  typingWiggle(tl, rig, s2.holdStart, s2.holdEnd - s2.holdStart);

  // 2 -> 3: keep typing, then the build fails: lean back, hands on head.
  typingWiggle(tl, rig, t2.start, 0.9);
  poseTo(tl, rig, "leanBack", t2.start + 1.0, 0.5);
  express(tl, rig, { mouth: "o" }, s3.holdStart - 0.2);

  // 3 -> 4: get up, walk to the fridge, reach in, grab a can.
  express(tl, rig, { mouth: "flat" }, t3.start);
  poseTo(tl, rig, { ...POSES.stand, x: 640 }, t3.start + 0.05, 0.3);
  walk(tl, rig, 640, POSES.atFridge.x, t3.start + 0.35, 1.0);
  poseTo(tl, rig, "atFridge", s4.holdStart - 0.15, 0.25);
  tl.set(rig.handCan, { opacity: 1 }, s4.holdStart + 0.5);
  poseTo(tl, rig, "holdCan", s4.holdStart + 0.5, 0.35);
  express(tl, rig, { mouth: "smile" }, s4.holdStart + 0.6);

  // 4 -> 5: turn, walk back, sit, type the last fix, then celebrate.
  turn(tl, rig, -1, t4.start + 0.02);
  walk(tl, rig, POSES.holdCan.x, 640, t4.start + 0.12, 0.82);
  turn(tl, rig, 1, t4.start + 0.92);
  tl.set(rig.handCan, { opacity: 0 }, t4.start + 0.98);
  poseTo(tl, rig, "typing", t4.start + 0.98, 0.3);
  express(tl, rig, { mouth: "flat" }, t4.start + 1.0);
  typingWiggle(tl, rig, t4.start + 1.28, 0.22);
  poseTo(tl, rig, "stand", s5.holdStart + 0.64, 0.36);
  poseTo(tl, rig, "celebrate", s5.holdStart + 0.98, 0.42, "back.out(1.2)");
  express(tl, rig, { mouth: "o" }, s5.holdStart + 0.98);

  return rig;
}

/** Small forearm taps, scrubbed with the scroll. */
export function typingWiggle(
  tl: gsap.core.Timeline,
  rig: Rig,
  at: number,
  duration: number,
) {
  const taps = Math.max(2, Math.round(duration / 0.06));
  const d = duration / taps;
  const near = POSES.typing.armNearL;
  const far = POSES.typing.armFarL;
  for (let i = 0; i < taps; i++) {
    const up = i % 2 === 0;
    tl.to(
      rig.joints.armNearL,
      { ...rotate(near + (up ? -5 : 0)), duration: d, ease: "sine.inOut" },
      at + i * d,
    );
    tl.to(
      rig.joints.armFarL,
      { ...rotate(far + (up ? 0 : -5)), duration: d, ease: "sine.inOut" },
      at + i * d,
    );
  }
}
