import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import { exitCopy, revealCopy } from "../copy";
import type { StopContext } from "../master";
import { drift, fadeTo, flash, shake, shotTo } from "./shared";

/**
 * Stop 3, 6 PM. The build fails: hands on head, papers flying.
 * Camera: a slight dutch tilt, depth 1.4 so the layers pull apart.
 * Light: golden-hour sun pours through the window and turns the room orange.
 * Surprise: the screen goes red and flashes the whole room.
 */
export function stop3({ tl, cam, copy, el, reduce }: StopContext) {
  const s = STOPS[3];
  const t2 = transition(2);
  const t3 = transition(3);

  shotTo(tl, cam, SHOTS[3], t2.start, t2.end - t2.start);
  drift(tl, cam, t2.end, t3.end - t2.end, -10, 6);

  revealCopy(tl, copy.get(3), s.holdStart + 0.05);
  exitCopy(tl, copy.get(3), s.holdEnd + 0.05);

  fadeTo(tl, el("beam-evening"), s.holdStart - 0.6, 0.5, 0.42);
  fadeTo(tl, el("beam-evening"), t3.start + 0.3, 0.8, 0);

  flash(tl, el("tint-error"), s.holdStart - 0.25, 0.22, 0.6);
  flash(tl, el("tint-error"), s.holdStart - 0.02, 0.2, 0.45);
  if (!reduce) shake(tl, el("shake"), s.holdStart - 0.25, 0.3, 9, 11);
}
