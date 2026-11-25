import { seeded } from "../random";
import { rotate } from "./rig";

type TL = gsap.core.Timeline;

/**
 * The master timeline runs in day progress (0-1). Small durations are
 * written as multiples of U, roughly one beat (1/15 of the day's scroll
 * before linger zones).
 */
export const U = 1 / 15;

/** Quick opacity flash: up to `peak`, then back to 0. */
export function flash(tl: TL, target: Element | undefined, at: number, duration: number, peak: number) {
  if (!target) return;
  tl.fromTo(
    target,
    { opacity: 0 },
    { opacity: peak, duration: duration * 0.3, ease: "power2.out", immediateRender: false },
    at,
  );
  tl.to(target, { opacity: 0, duration: duration * 0.7, ease: "power1.in" }, at + duration * 0.3);
}

/** Fade to a value and hold it there. */
export function fadeTo(tl: TL, target: Element | undefined, at: number, duration: number, value: number) {
  if (target) tl.to(target, { opacity: value, duration, ease: "sine.inOut" }, at);
}

/** Scrubbed screen shake on an HTML element (deterministic jitter, ends at rest). */
export function shake(tl: TL, target: Element | undefined, at: number, duration: number, amp: number, seed = 1) {
  if (!target) return;
  const rnd = seeded(seed);
  const steps = Math.max(4, Math.round(duration / (0.035 * U)));
  const d = duration / steps;
  for (let i = 0; i < steps; i++) {
    const fade = 1 - i / steps;
    tl.to(
      target,
      { x: (rnd() * 2 - 1) * amp * fade, y: (rnd() * 2 - 1) * amp * fade, duration: d, ease: "sine.inOut" },
      at + i * d,
    );
  }
  tl.to(target, { x: 0, y: 0, duration: d }, at + duration);
}

/** Wiggle an SVG group around its local origin (attribute transform). */
export function wiggle(tl: TL, target: Element | undefined, at: number, duration: number, deg: number) {
  if (!target) return;
  const steps = Math.max(4, Math.round(duration / (0.03 * U)));
  const d = duration / steps;
  for (let i = 0; i < steps; i++) {
    tl.to(target, { ...rotate(i % 2 === 0 ? deg : -deg), duration: d, ease: "sine.inOut" }, at + i * d);
  }
  tl.to(target, { ...rotate(0), duration: d }, at + duration);
}
