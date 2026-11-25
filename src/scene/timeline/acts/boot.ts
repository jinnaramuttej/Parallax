import type { ActContext } from "../master";
import { flash } from "../fx";
import { setState } from "../propState";
import { express, poseTo, scale } from "../rig";
import { rgb, typingWiggle } from "./shared";

/** Boot order: second monitor, main monitor, laptop (staggered). */
const BOOT = [
  { screen: "second", prop: "screen-second", at: 0.229, ready: "terminal" },
  { screen: "main", prop: "screen-main", at: 0.233, ready: "code" },
  { screen: "laptop", prop: "screen-laptop", at: 0.237, ready: "chat" },
] as const;

/**
 * Act 3, 7:00 to 10:00 AM (0.223-0.338). He wakes the machines: each screen
 * boots in turn with a glow. The camera pushes in to a close-up and slides
 * across the screens, lingering on each (terminal logs, code, chat), then
 * pulls back as the morning flies by.
 * Light: cold boot glows, then the RGB underglow lights up.
 * Surprise: when everything is up, the keyboard glow goes rainbow.
 */
export function boot({ tl, q, el, rig }: ActContext) {
  poseTo(tl, rig, "typing", 0.224, 0.006);
  express(tl, rig, { mouth: "flat" }, 0.226);
  rgb(tl, q, "cyan", 0.232);

  for (const s of BOOT) {
    setState(tl, q, s.prop, "boot", s.at);
    flash(tl, el(`boot-glow-${s.screen}`), s.at, 0.014, 0.9);
    const bar = q(`[data-el="${s.screen}-boot-bar"]`)[0];
    if (bar) tl.fromTo(bar, scale(0.05, 1), { ...scale(1, 1), duration: 0.01, ease: "power1.inOut", immediateRender: false }, s.at + 0.001);
    setState(tl, q, s.prop, s.ready, s.at + 0.012);
  }

  // Terminal logs scroll while the camera lingers on the second monitor.
  const logs = el("terminal-scroll");
  tl.fromTo(logs, { attr: { transform: "translate(0 0)" } }, { attr: { transform: "translate(0 -68)" }, duration: 0.4 - 0.242, ease: "none", immediateRender: false }, 0.242);

  // Code scrolls with the page until the build breaks.
  q('[data-el^="code-scroll-"]').forEach((scroll) => {
    const block = Number((scroll as SVGGElement).dataset.block ?? 0);
    tl.fromTo(
      scroll,
      { attr: { transform: "translate(0 0)" } },
      { attr: { transform: `translate(0 ${-block})` }, duration: 0.67 - 0.246, ease: "none", immediateRender: false },
      0.246,
    );
  });

  // Chat on the laptop while the camera is there, then a browser tab.
  setState(tl, q, "screen-laptop", "browser", 0.304);

  typingWiggle(tl, rig, 0.232, 0.338 - 0.232);
  rgb(tl, q, "rainbow", 0.318);
}
