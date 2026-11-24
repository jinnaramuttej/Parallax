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
      <div className="glow glow-lamp" style={box(940, 400, 320, 280)} />
      <div className="glow glow-screen" style={box(500, 400, 440, 360)} />
      <div
        className="glow glow-success"
        data-el="success-flash"
        style={box(520, 220, 840, 640)}
      />
      <div
        className="glow-spill"
        data-el="fridge-spill"
        style={box(1000, 470, 500, 430)}
      />
    </ParallaxLayer>
  );
}
