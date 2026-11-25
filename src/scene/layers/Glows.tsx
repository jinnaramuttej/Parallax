import { ParallaxLayer } from "@/components/ParallaxLayer";
import { RgbStrip } from "../room/desk/RgbStrip";
import { StringLightsGlow } from "../room/life/StringLights";
import { PostersGlow } from "../room/Posters";
import { box } from "../viewport";

/**
 * Light sources drawn above the tints with a screen blend: desk lamp,
 * string lights, glow-in-the-dark poster paint, monitor glow, fridge
 * light spill. Opacity only.
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
      <div className="glow-lights" data-el="string-lights-glow">
        <StringLightsGlow />
      </div>
      <div className="glow-posters">
        <PostersGlow />
      </div>
      <div className="glow-rgb" data-el="rgb-glow">
        <RgbStrip state="cyan" />
      </div>
      <div className="glow glow-screen" style={box(500, 400, 440, 360)} />
      {/* Each screen flashes as it boots (boot act). */}
      <div className="glow glow-boot" data-el="boot-glow-second" style={box(630, 430, 216, 176)} />
      <div className="glow glow-boot" data-el="boot-glow-main" style={box(770, 390, 340, 250)} />
      <div className="glow glow-boot" data-el="boot-glow-laptop" style={box(1046, 506, 130, 116)} />
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
