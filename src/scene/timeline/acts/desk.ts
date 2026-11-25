import { exitCopy, revealCopy } from "../copy";
import type { ActContext } from "../master";
import { express, poseTo } from "../rig";
import { screen, typingWiggle } from "./shared";

/**
 * 0.20-0.46, 7:00 AM to 1:00 PM. At the desk at 7:00, the monitor wakes,
 * he starts typing; the morning flies past while the code scrolls.
 */
export function desk({ tl, el, q, copy, rig }: ActContext) {
  revealCopy(tl, copy.get("desk"), 0.168);
  exitCopy(tl, copy.get("desk"), 0.275);

  screen(tl, el, "code", 0.2, true);
  poseTo(tl, rig, "typing", 0.21, 0.012);
  express(tl, rig, { mouth: "flat" }, 0.215);
  typingWiggle(tl, rig, 0.222, 0.46 - 0.222);

  // Code scrolls with the page from here until the build breaks at 6 PM.
  q('[data-el^="code-scroll-"]').forEach((scroll) => {
    const block = Number((scroll as SVGGElement).dataset.block ?? 0);
    tl.fromTo(
      scroll,
      { attr: { transform: "translate(0 0)" } },
      { attr: { transform: `translate(0 ${-block})` }, duration: 0.65 - 0.21 },
      0.21,
    );
  });

  // The morning coffee goes cold.
  tl.to(el("steam"), { opacity: 0, duration: 0.03 }, 0.3);
}
