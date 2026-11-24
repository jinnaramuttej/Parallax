import { STOPS } from "../timing";
import type { BuildContext } from "./master";

/** Placeholder labels: visible for each stop's hold, so timing can be checked. */
export function addStopLabels({ tl, q }: BuildContext) {
  for (const stop of STOPS) {
    const el = q(`[data-stop-label="${stop.index}"]`)[0];
    if (!el) continue;
    const fade = 0.25;
    if (stop.index > 0) {
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: fade },
        stop.holdStart - fade,
      );
    }
    if (stop.index < STOPS.length - 1) {
      tl.to(el, { autoAlpha: 0, y: -24, duration: fade }, stop.holdEnd);
    }
  }
}
