import { POSES } from "../../character/poses";
import { U } from "../fx";
import { setState } from "../propState";
import { rotate, type Rig } from "../rig";

type TL = gsap.core.Timeline;

/** Small forearm taps while he types, scrubbed with the scroll. */
export function typingWiggle(tl: TL, rig: Rig, at: number, duration: number) {
  const taps = Math.max(2, Math.round(duration / (0.06 * U)));
  const d = duration / taps;
  const near = POSES.typing.armNearL;
  const far = POSES.typing.armFarL;
  for (let i = 0; i < taps; i++) {
    const up = i % 2 === 0;
    tl.to(rig.joints.armNearL, { ...rotate(near + (up ? -5 : 0)), duration: d, ease: "sine.inOut" }, at + i * d);
    tl.to(rig.joints.armFarL, { ...rotate(far + (up ? 0 : -5)), duration: d, ease: "sine.inOut" }, at + i * d);
  }
}

/** Switch all three screens at once (main state, plus second/laptop states). */
export function screens(
  tl: TL,
  q: (s: string) => Element[],
  at: number,
  main: string,
  second?: string,
  laptop?: string,
) {
  setState(tl, q, "screen-main", main, at);
  if (second) setState(tl, q, "screen-second", second, at);
  if (laptop) setState(tl, q, "screen-laptop", laptop, at);
}

/** An empty can drops onto its slot on the desk. */
export function canAppears(tl: TL, q: (s: string) => Element[], slot: number, at: number) {
  tl.fromTo(
    q(`[data-can="${slot}"]`)[0],
    { opacity: 0, attr: { transform: "translate(0 -40)" } },
    { opacity: 1, attr: { transform: "translate(0 0)" }, duration: 0.12 * U, ease: "bounce.out" },
    at,
  );
}

/**
 * Play a video scene between two day-progress points: every copy of it
 * (`prefixes`, e.g. the small screen and the big overlay) fills its progress
 * bar and steps through its subtitles line by line.
 */
export function playVideo(
  tl: TL,
  q: (s: string) => Element[],
  kind: "anime" | "movie",
  prefixes: string[],
  from: number,
  to: number,
) {
  for (const prefix of prefixes) {
    const bar = q(`[data-el="${prefix}-progress"]`)[0];
    if (bar) {
      tl.fromTo(
        bar,
        { attr: { transform: "scale(0.08 1)" } },
        { attr: { transform: "scale(1 1)" }, duration: to - from, ease: "none", immediateRender: false },
        from,
      );
    }
    const subs = q(`[data-${kind}="${prefix}"] [data-sub]`);
    const step = (to - from) / subs.length;
    subs.forEach((sub, i) => {
      if (i > 0) tl.to(sub, { opacity: 1, duration: 0.15 * step }, from + i * step);
      if (i < subs.length - 1) tl.to(sub, { opacity: 0, duration: 0.15 * step }, from + (i + 1) * step);
    });
  }
}

/** Pause or play every copy of a video (its play/pause icon). */
export function videoState(tl: TL, q: (s: string) => Element[], prefixes: string[], state: "playing" | "paused", at: number) {
  for (const prefix of prefixes) setState(tl, q, `${prefix}-play`, state, at, 0.001);
}

/** The anime scene's motion: speed lines spin, the hero trembles, the orb pulses. */
export function animeMotion(tl: TL, q: (s: string) => Element[], from: number, to: number) {
  const beats = Math.max(4, Math.round((to - from) / (0.05 * U)));
  const d = (to - from) / beats;
  for (const lines of q('[data-anime-part="lines"]')) {
    tl.fromTo(lines, { attr: { transform: "rotate(0)" } }, { attr: { transform: "rotate(45)" }, duration: to - from, ease: "none", immediateRender: false }, from);
  }
  for (const hero of q('[data-anime-part="hero"]')) {
    for (let i = 0; i < beats; i++) {
      const jx = i % 2 === 0 ? 1.4 : -0.6;
      const jy = i % 2 === 0 ? -1 : 0.6;
      tl.to(hero, { attr: { transform: `translate(${56 + jx} ${92 + jy})` }, duration: d, ease: "sine.inOut" }, from + i * d);
    }
    tl.to(hero, { attr: { transform: "translate(56 92)" }, duration: d }, to);
  }
  for (const orb of q('[data-anime-part="orb"]')) {
    for (let i = 0; i < beats; i++) {
      const s = i % 2 === 0 ? 1.3 + (i / beats) * 0.5 : 1;
      tl.to(orb, { attr: { transform: `translate(100 44) scale(${s})` }, duration: d, ease: "sine.inOut" }, from + i * d);
    }
  }
}

/** The movie's motion: the sun sinks, the city drifts in two depths, birds cross. */
export function movieMotion(tl: TL, q: (s: string) => Element[], from: number, to: number) {
  const move = (part: string, x: number, y: number) => {
    for (const el of q(`[data-movie-part="${part}"]`)) {
      tl.fromTo(
        el,
        { attr: { transform: "translate(0 0)" } },
        { attr: { transform: `translate(${x} ${y})` }, duration: to - from, ease: "none", immediateRender: false },
        from,
      );
    }
  };
  move("sun", 0, 10);
  move("far", -6, 0);
  move("near", -16, 0);
  move("birds", 60, -8);
}

/** Pop a tick onto the whiteboard checklist. */
export function tick(tl: TL, q: (s: string) => Element[], item: number, at: number) {
  const el = q(`[data-el="todo-tick-${item}"]`)[0];
  if (el) tl.fromTo(el, { attr: { transform: "scale(0)" } }, { attr: { transform: "scale(1)" }, duration: 0.1 * U, ease: "back.out(3)", immediateRender: false }, at);
}

/** Set the keyboard's RGB underglow colour for an act. */
export function rgb(tl: TL, q: (s: string) => Element[], state: string, at: number) {
  setState(tl, q, "rgb", state, at, 0.006);
}
