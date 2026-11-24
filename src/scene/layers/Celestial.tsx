import { ParallaxLayer } from "@/components/ParallaxLayer";
import { box } from "../viewport";

/** Sun and moon arcs are centred on this point (the horizon behind the window). */
export const ARC = { cx: 800, cy: 470, rx: 330, ry: 380 };
export const SUN_SIZE = 140;
export const MOON_SIZE = 110;

export function Celestial() {
  return (
    <ParallaxLayer speed={0.1} className="scene-canvas" aria-hidden>
      <div
        data-el="sun"
        className="absolute will-change-transform"
        style={box(ARC.cx - SUN_SIZE / 2, ARC.cy - SUN_SIZE / 2, SUN_SIZE, SUN_SIZE)}
      >
        <svg viewBox="-70 -70 140 140" className="h-full w-full overflow-visible">
          <circle r="68" fill="var(--sun)" opacity="0.18" />
          <circle r="52" fill="var(--sun)" opacity="0.28" />
          <circle r="36" fill="var(--sun)" />
        </svg>
      </div>
      <div
        data-el="moon"
        className="absolute will-change-transform"
        style={box(ARC.cx - MOON_SIZE / 2, ARC.cy - MOON_SIZE / 2, MOON_SIZE, MOON_SIZE)}
      >
        <svg viewBox="-55 -55 110 110" className="h-full w-full overflow-visible">
          <circle r="54" fill="var(--moon)" opacity="0.12" />
          <circle r="30" fill="var(--moon)" />
          <circle cx="-9" cy="-6" r="6" fill="var(--moon-shade)" />
          <circle cx="10" cy="9" r="4" fill="var(--moon-shade)" />
          <circle cx="6" cy="-14" r="3" fill="var(--moon-shade)" />
        </svg>
      </div>
    </ParallaxLayer>
  );
}
