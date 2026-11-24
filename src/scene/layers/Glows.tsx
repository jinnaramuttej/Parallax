import { ParallaxLayer } from "@/components/ParallaxLayer";
import { box } from "../viewport";

/**
 * Light sources drawn above the tints with a screen blend: desk lamp,
 * monitor glow, fridge light spill. Opacity only.
 */
export function Glows() {
  return (
    <ParallaxLayer
      speed={1}
      className="scene-canvas"
      data-el="glows"
      aria-hidden
    >
      <div className="glow glow-lamp" style={box(860, 330, 480, 400)} />
      <div className="glow glow-screen" style={box(560, 330, 640, 420)} />
      <div
        className="glow glow-success"
        data-el="success-flash"
        style={box(520, 220, 840, 640)}
      />
      <div
        className="glow-spill"
        data-el="fridge-spill"
        style={box(900, 500, 450, 400)}
      >
        <svg viewBox="900 500 450 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spill" x1="1" x2="0" y1="0" y2="0.3">
              <stop
                offset="0"
                stopColor="var(--fridge-light)"
                stopOpacity="0.95"
              />
              <stop
                offset="1"
                stopColor="var(--fridge-light)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <path d="M1342 512V750L1350 900H900L1100 640Z" fill="url(#spill)" />
        </svg>
      </div>
    </ParallaxLayer>
  );
}
