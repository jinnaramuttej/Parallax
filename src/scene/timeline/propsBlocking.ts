import { gsap } from "@/lib/gsap";
import { STOPS, transition } from "../timing";
import type { BuildContext } from "./master";
import { scale } from "./rig";

/** Story cans: which desk slot fills, and when (story units). */
export function storyCanTimes() {
  const [, , s2, s3, , s5] = STOPS;
  const t4 = transition(4);
  return [
    s2.holdStart + 0.35, // 1 PM, can #1
    s3.holdStart + 0.15, // 6 PM, can #2
    t4.start + 0.8, // the fridge can lands on the desk
    s5.holdStart - 0.3, // one more for the final push
  ];
}

/**
 * Props and room state: blanket, Zzz, coffee steam, monitor screens,
 * fridge door, cans on the desk, flying papers.
 */
export function addPropsBlocking({ tl, q }: BuildContext) {
  const el = (name: string) => q(`[data-el="${name}"]`)[0];
  const [, , s2, s3, s4, s5] = STOPS;
  const [t0, t1, t2, t3, t4] = [0, 1, 2, 3, 4].map(transition);

  // Morning: blanket folds back, Zzz fade, coffee steams until lunch.
  gsap.set([el("zzz"), el("steam")], { opacity: 1 });
  tl.to(el("zzz"), { opacity: 0, duration: 0.2 }, t0.start);
  tl.to(el("blanket"), { scaleX: 0.55, svgOrigin: "466 670", duration: 0.5, ease: "power2.inOut" }, t0.start + 0.2);
  tl.to(el("steam"), { opacity: 0, duration: 0.6 }, t2.start);

  // Monitor: off, then code, error at 6 PM, code again, deploy, success.
  const screen = (name: string, at: number, on: boolean, d = 0.08) =>
    tl.to(el(`screen-${name}`), { opacity: on ? 1 : 0, duration: d }, at);
  screen("code", t1.start + 0.9, true, 0.15);
  screen("code", s3.holdStart - 0.25, false, 0.05);
  screen("error", s3.holdStart - 0.25, true, 0.05);
  screen("error", t3.start + 0.2, false);
  screen("code", t3.start + 0.2, true);
  screen("code", s5.holdStart - 0.05, false, 0.05);
  screen("deploy", s5.holdStart - 0.05, true, 0.05);
  tl.fromTo(
    el("deploy-bar"),
    scale(0.02, 1),
    { ...scale(1, 1), duration: 0.6, ease: "power1.inOut" },
    s5.holdStart,
  );
  screen("deploy", s5.holdStart + 0.62, false, 0.05);
  screen("success", s5.holdStart + 0.62, true, 0.05);

  // Code scrolls while he types (scrubbed, so it scrolls with the page).
  const scroll = el("code-scroll-0") as SVGGElement | undefined;
  const block = Number(scroll?.dataset.block ?? 0);
  tl.fromTo(
    scroll ?? {},
    { attr: { transform: "translate(0 0)" } },
    { attr: { transform: `translate(0 ${-block})` }, duration: s3.holdStart - s2.holdStart },
    s2.holdStart - 0.3,
  );

  // Fridge run: door swings open on its right hinge, closes on the way back.
  const door = el("fridge-door");
  tl.to(door, { scaleX: -0.55, svgOrigin: "1502 632", duration: 0.25, ease: "power2.out" }, s4.holdStart - 0.2);
  tl.to(door, { scaleX: 1, svgOrigin: "1502 632", duration: 0.2, ease: "power2.in" }, t4.start);

  // Cans stack up on the desk.
  storyCanTimes().forEach((at, i) => {
    const can = q(`[data-can="${i}"]`)[0];
    tl.fromTo(
      can,
      { opacity: 0, attr: { transform: "translate(0 -40)" } },
      { opacity: 1, attr: { transform: "translate(0 0)" }, duration: 0.12, ease: "bounce.out" },
      at,
    );
  });

  // Papers fly off the desk when the build fails, then settle on the floor.
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
      {
        attr: { transform: `translate(${f.x} ${f.y}) rotate(${f.r}) scale(1 1)` },
        duration: 0.35,
        ease: "power2.out",
      },
      s3.holdStart - 0.2 + i * 0.05,
    );
    tl.to(
      sheet,
      {
        attr: { transform: `translate(${f.fx} ${f.fy}) rotate(${f.fr}) scale(1 0.14)` },
        duration: 0.9,
        ease: "power1.in",
      },
      s3.holdStart + 0.2 + i * 0.05,
    );
  });
}
