import { MOMENTS } from "@/config/acts";
import { POSES } from "../../character/poses";
import { exitCopy, revealCopy } from "../copy";
import { fadeTo, flash, shake } from "../fx";
import type { ActContext } from "../master";
import { express, poseTo, walk } from "../rig";
import { canAppears, screen } from "./shared";

/**
 * 0.66-0.80, 6:00 to 11:00 PM. The build fails at 6 PM: hands on head,
 * papers flying. Later he gets up and heads for the fridge.
 * Light: golden-hour sun pours in and turns the room orange.
 * Surprise: the red error flashes the room and shakes the screen.
 */
export function bug({ tl, el, q, copy, rig, reduce }: ActContext) {
  // The build breaks at about 5:30 PM so the 6:00 chip lands on the aftermath.
  const fail = 0.628;
  poseTo(tl, rig, "leanBack", fail - 0.014, 0.016);
  express(tl, rig, { mouth: "o" }, fail);
  screen(tl, el, "code", fail, false, 0.004);
  screen(tl, el, "error", fail, true, 0.004);

  flash(tl, el("tint-error"), fail, 0.011, 0.6);
  flash(tl, el("tint-error"), fail + 0.008, 0.01, 0.45);
  if (!reduce) shake(tl, el("shake"), fail, 0.016, 9, 11);

  fadeTo(tl, el("beam-evening"), 0.62, 0.03, 0.42);
  fadeTo(tl, el("beam-evening"), 0.7, 0.05, 0);

  revealCopy(tl, copy.get("bug"), 0.63);
  exitCopy(tl, copy.get("bug"), 0.712);
  canAppears(tl, q, 1, 0.672);

  // Papers fly off the desk, then settle on the floor.
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
      { attr: { transform: `translate(${f.x} ${f.y}) rotate(${f.r}) scale(1 1)` }, duration: 0.022, ease: "power2.out" },
      fail + i * 0.003,
    );
    tl.to(
      sheet,
      { attr: { transform: `translate(${f.fx} ${f.fy}) rotate(${f.fr}) scale(1 0.14)` }, duration: 0.055, ease: "power1.in" },
      fail + 0.024 + i * 0.003,
    );
  });

  // Fix pushed; get up and head for the fridge.
  express(tl, rig, { mouth: "flat" }, 0.715);
  poseTo(tl, rig, { ...POSES.stand, x: 640 }, 0.716, 0.014);
  screen(tl, el, "error", 0.72, false);
  screen(tl, el, "code", 0.72, true);
  walk(tl, rig, 640, POSES.atFridge.x, 0.733, 0.05);
  poseTo(tl, rig, "atFridge", 0.783, 0.012);

  const [open] = MOMENTS.fridgeDoorOpen;
  tl.to(el("fridge-door"), { scaleX: -0.55, svgOrigin: "1502 632", duration: 0.014, ease: "power2.out" }, open);
  fadeTo(tl, el("fridge-spill"), open, 0.014, 0.75);
}
