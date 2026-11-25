import { gsap } from "@/lib/gsap";
import { CAT_HIP, CAT_JOINTS, CAT_POSES, type CatEyes, type CatJoint, type CatPose, type CatPoseName } from "../character/catPoses";
import { rotate, scale, translate } from "./rig";

type Q = (selector: string) => Element[];
type TL = gsap.core.Timeline;

/** One beat in day progress (see fx.ts). */
const U = 1 / 15;

export type CatRigHandle = ReturnType<typeof createCatRig>;

/** Joints and shape swaps of one cat (`which` = data-cat: "room" or "shoulder"). */
export function createCatRig(q: Q, which: string) {
  const root = q(`[data-cat="${which}"]`)[0];
  const j = (name: string) => root?.querySelector(`[data-cj="${name}"]`) ?? null;
  const cel = (name: string) => root?.querySelector(`[data-cel="${name}"]`) ?? null;
  return {
    root,
    posX: j("posX"),
    posY: j("posY"),
    squash: j("squash"),
    face: j("face"),
    hips: j("hips"),
    joints: Object.fromEntries(CAT_JOINTS.map((n) => [n, j(n)])) as Record<CatJoint, Element | null>,
    reach: [j("frontNearReach"), j("frontFarReach")],
    eyes: { open: cel("eyes-open"), closed: cel("eyes-closed"), wide: cel("eyes-wide") } as Record<CatEyes, Element | null>,
    fur: cel("fur"),
    tailUp: cel("tail-up"),
    tailWrap: cel("tail-wrap"),
    tailIdle: cel("tail-idle"),
    earIdle: [cel("ear-near-idle"), cel("ear-far-idle")],
  };
}

/** Swap the eye shapes with a very short crossfade. */
export function catEyes(tl: TL, cat: CatRigHandle, eyes: CatEyes, at: number) {
  for (const [name, el] of Object.entries(cat.eyes)) {
    if (el) tl.to(el, { opacity: name === eyes ? 1 : 0, duration: 0.04 * U }, at);
  }
}

/** Tween every cat joint (and the shape swaps) to a pose, starting at `at`. */
export function catPose(
  tl: TL,
  cat: CatRigHandle,
  pose: CatPoseName | Partial<CatPose>,
  at: number,
  duration: number,
  ease = "sine.inOut",
) {
  const p: Partial<CatPose> = typeof pose === "string" ? CAT_POSES[pose] : pose;
  for (const name of CAT_JOINTS) {
    const el = cat.joints[name];
    if (el && p[name] !== undefined) tl.to(el, { ...rotate(p[name]), duration, ease }, at);
  }
  if (p.drop !== undefined && cat.hips) tl.to(cat.hips, { ...translate(0, -CAT_HIP + p.drop), duration, ease }, at);
  if (p.reach !== undefined)
    for (const el of cat.reach) if (el) tl.to(el, { ...translate(0, p.reach), duration, ease }, at);
  if (p.eyes) catEyes(tl, cat, p.eyes, at);
  const quick = Math.min(duration, 0.06 * U);
  if (p.fur !== undefined && cat.fur) tl.to(cat.fur, { opacity: p.fur ? 1 : 0, duration: quick }, at);
  if (p.tailWrap !== undefined) {
    if (cat.tailWrap) tl.to(cat.tailWrap, { opacity: p.tailWrap ? 1 : 0, duration: quick }, at);
    if (cat.tailUp) tl.to(cat.tailUp, { opacity: p.tailWrap ? 0 : 1, duration: quick }, at);
  }
}

/** Move the cat's feet to (x, y). */
export function catMove(tl: TL, cat: CatRigHandle, x: number | undefined, y: number | undefined, at: number, duration: number, ease = "sine.inOut") {
  if (x !== undefined && cat.posX) tl.to(cat.posX, { ...translate(x, 0), duration, ease }, at);
  if (y !== undefined && cat.posY) tl.to(cat.posY, { ...translate(0, y), duration, ease }, at);
}

/** Face right (1) or left (-1). */
export function catFace(tl: TL, cat: CatRigHandle, dir: 1 | -1, at: number, duration = 0.1 * U) {
  if (cat.face) tl.to(cat.face, { ...scale(dir, 1), duration, ease: "power1.inOut" }, at);
}

/** Walk along a line at height y: legs cycle walkA/walkB, a small bob per step. */
export function catWalk(tl: TL, cat: CatRigHandle, x0: number, x1: number, y: number, at: number, duration: number) {
  const steps = Math.max(2, Math.round(Math.abs(x1 - x0) / 34));
  const d = duration / steps;
  for (let i = 0; i < steps; i++) {
    catPose(tl, cat, i % 2 === 0 ? "walkA" : "walkB", at + i * d, d);
    if (cat.posY) {
      tl.to(cat.posY, { ...translate(0, y - 3), duration: d / 2, ease: "sine.out" }, at + i * d);
      tl.to(cat.posY, { ...translate(0, y), duration: d / 2, ease: "sine.in" }, at + i * d + d / 2);
    }
  }
  if (cat.posX) tl.fromTo(cat.posX, { ...translate(x0, 0) }, { ...translate(x1, 0), duration, ease: "none", immediateRender: false }, at);
}

/**
 * A leap from (x0, y0) to (x1, y1) peaking `height` above the higher end:
 * crouch, stretch through the air, squash on landing.
 */
export function catJump(
  tl: TL,
  cat: CatRigHandle,
  from: { x: number; y: number },
  to: { x: number; y: number },
  at: number,
  duration: number,
  height = 60,
) {
  const peak = Math.min(from.y, to.y) - height;
  const up = duration * 0.42;
  if (cat.squash) {
    tl.to(cat.squash, { ...scale(1.1, 0.86), duration: duration * 0.08, ease: "power1.in" }, at - duration * 0.08);
    tl.to(cat.squash, { ...scale(0.92, 1.1), duration: duration * 0.1, ease: "power1.out" }, at);
    tl.to(cat.squash, { ...scale(1, 1), duration: duration * 0.3, ease: "sine.inOut" }, at + duration * 0.1);
  }
  catPose(tl, cat, "leap", at, duration * 0.3, "power2.out");
  if (cat.posX) tl.fromTo(cat.posX, { ...translate(from.x, 0) }, { ...translate(to.x, 0), duration, ease: "none", immediateRender: false }, at);
  if (cat.posY) {
    tl.fromTo(cat.posY, { ...translate(0, from.y) }, { ...translate(0, peak), duration: up, ease: "power2.out", immediateRender: false }, at);
    tl.to(cat.posY, { ...translate(0, to.y), duration: duration - up, ease: "power2.in" }, at + up);
  }
  const land = at + duration;
  catPose(tl, cat, "stand", land - duration * 0.15, duration * 0.25);
  if (cat.squash) {
    tl.to(cat.squash, { ...scale(1.12, 0.84), duration: duration * 0.08, ease: "power2.out" }, land);
    tl.to(cat.squash, { ...scale(1, 1), duration: duration * 0.16, ease: "sine.out" }, land + duration * 0.08);
  }
}

/**
 * Idle life that runs on real time, not scroll: the tail sways and the ears
 * twitch now and then. Skipped for reduced motion. Returns a kill function.
 */
export function startCatIdle(cats: CatRigHandle[], reduce: boolean) {
  if (reduce) return () => {};
  const tweens: gsap.core.Animation[] = [];
  cats.forEach((cat, i) => {
    if (cat.tailIdle) {
      tweens.push(
        gsap.fromTo(
          cat.tailIdle,
          { ...rotate(-7) },
          { ...rotate(9), duration: 1.7 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 },
        ),
      );
    }
    const [near, far] = cat.earIdle;
    if (near && far) {
      const twitch = gsap.timeline({ repeat: -1, repeatDelay: 2.4 + i * 0.9, delay: 1 + i });
      twitch
        .to(near, { ...rotate(-22), duration: 0.07, ease: "power2.out" })
        .to(near, { ...rotate(0), duration: 0.16, ease: "sine.out" })
        .to(far, { ...rotate(-16), duration: 0.07, ease: "power2.out" }, 1.3)
        .to(far, { ...rotate(0), duration: 0.16, ease: "sine.out" });
      tweens.push(twitch);
    }
  });
  return () => tweens.forEach((t) => t.kill());
}
