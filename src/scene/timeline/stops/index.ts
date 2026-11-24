import { SHOTS } from "../../story";
import { STOPS, transition } from "../../timing";
import type { StopContext } from "../master";
import { shotTo } from "./shared";
import { stop0 } from "./stop0";

type StopBuilder = (ctx: StopContext) => void;

/** Choreographed stops. Each one owns its arrival, copy, light and surprise. */
const CHOREOGRAPHED: StopBuilder[] = [stop0];

/** Until a stop is choreographed, the camera still follows the guy there. */
function fallbackCamera(ctx: StopContext) {
  for (let i = CHOREOGRAPHED.length; i < STOPS.length; i++) {
    const t = transition(i - 1);
    shotTo(ctx.tl, ctx.cam, { ...SHOTS[i], zoom: 1.03, rot: 0, depth: 1 }, t.start, t.end - t.start);
  }
}

export const STOP_BUILDERS: StopBuilder[] = [...CHOREOGRAPHED, fallbackCamera];
