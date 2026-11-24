import {
  POSES,
  ROTATION_JOINTS,
  STAND_Y,
  type Pose,
  type PoseName,
  type RotationJoint,
} from "../character/poses";

type Q = (selector: string) => Element[];
type TL = gsap.core.Timeline;

export type Rig = ReturnType<typeof createRig>;

/**
 * SVG transform helpers. Joints are tweened through their `transform`
 * attribute (GSAP interpolates the numbers in the string), so every
 * rotation happens around the joint's own local origin.
 */
export const rotate = (deg: number) => ({
  attr: { transform: `rotate(${deg})` },
});
export const translate = (x: number, y: number) => ({
  attr: { transform: `translate(${x} ${y})` },
});
export const scale = (sx: number, sy: number) => ({
  attr: { transform: `scale(${sx} ${sy})` },
});

export function createRig(q: Q) {
  const joints = Object.fromEntries(
    ROTATION_JOINTS.map((j) => [j, q(`[data-j="${j}"]`)[0]]),
  ) as Record<RotationJoint, Element>;
  const el = (name: string) => q(`[data-el="${name}"]`)[0];
  return {
    joints,
    posX: q('[data-j="posX"]')[0],
    posY: q('[data-j="posY"]')[0],
    face: q('[data-j="face"]')[0],
    look: q('[data-j="look"]')[0],
    eyesOpen: el("eyes-open"),
    eyesClosed: el("eyes-closed"),
    mouth: {
      smile: el("mouth-smile"),
      flat: el("mouth-flat"),
      o: el("mouth-o"),
    },
    pupil: el("pupil"),
    headphones: el("headphones"),
    handCan: el("hand-can"),
  };
}

export function moveTo(
  tl: TL,
  rig: Rig,
  at: number,
  duration: number,
  x?: number,
  y?: number,
  ease = "sine.inOut",
) {
  if (x !== undefined)
    tl.to(rig.posX, { ...translate(x, 0), duration, ease }, at);
  if (y !== undefined)
    tl.to(rig.posY, { ...translate(0, y), duration, ease }, at);
}

/** Tween every joint (and the hip position) to a pose, starting at `at`. */
export function poseTo(
  tl: TL,
  rig: Rig,
  pose: PoseName | Partial<Pose>,
  at: number,
  duration: number,
  ease = "sine.inOut",
) {
  const target: Partial<Pose> = typeof pose === "string" ? POSES[pose] : pose;
  for (const j of ROTATION_JOINTS) {
    const value = target[j];
    if (value !== undefined)
      tl.to(rig.joints[j], { ...rotate(value), duration, ease }, at);
  }
  moveTo(tl, rig, at, duration, target.x, target.y, ease);
}

/** A pose without its position, so limbs can change while the hip stays put. */
export function limbsOf(name: PoseName): Partial<Pose> {
  const limbs: Partial<Pose> = { ...POSES[name] };
  delete limbs.x;
  delete limbs.y;
  return limbs;
}

/**
 * Walk the hip from x0 to x1, cycling the legs/arms through walkA/walkB
 * with a small bob per step. Step count scales with distance.
 */
export function walk(
  tl: TL,
  rig: Rig,
  x0: number,
  x1: number,
  at: number,
  duration: number,
) {
  const steps = Math.max(2, Math.round(Math.abs(x1 - x0) / 70));
  const stepDur = duration / steps;
  for (let i = 0; i < steps; i++) {
    const t = at + i * stepDur;
    poseTo(tl, rig, limbsOf(i % 2 === 0 ? "walkA" : "walkB"), t, stepDur);
    tl.to(
      rig.posY,
      { ...translate(0, STAND_Y - 6), duration: stepDur / 2, ease: "sine.out" },
      t,
    );
    tl.to(
      rig.posY,
      { ...translate(0, STAND_Y), duration: stepDur / 2, ease: "sine.in" },
      t + stepDur / 2,
    );
  }
  tl.to(rig.posX, { ...translate(x1, 0), duration, ease: "none" }, at);
}

/** Turn to face right (1) or left (-1): a quick squash through scaleX 0. */
export function turn(
  tl: TL,
  rig: Rig,
  dir: 1 | -1,
  at: number,
  duration = 0.14,
) {
  tl.to(rig.face, { ...scale(dir, 1), duration, ease: "power1.inOut" }, at);
}

type Face = { eyes?: "open" | "closed"; mouth?: "smile" | "flat" | "o" };

/** Swap expression shapes with a very short crossfade. */
export function express(tl: TL, rig: Rig, face: Face, at: number) {
  const d = 0.04;
  if (face.eyes) {
    tl.to(
      rig.eyesOpen,
      { opacity: face.eyes === "open" ? 1 : 0, duration: d },
      at,
    );
    tl.to(
      rig.eyesClosed,
      { opacity: face.eyes === "closed" ? 1 : 0, duration: d },
      at,
    );
  }
  if (face.mouth) {
    for (const [name, el] of Object.entries(rig.mouth)) {
      tl.to(el, { opacity: name === face.mouth ? 1 : 0, duration: d }, at);
    }
  }
}
