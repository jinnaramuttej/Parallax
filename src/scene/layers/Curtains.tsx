import { ParallaxLayer } from "@/components/ParallaxLayer";
import { CurtainFlare, CurtainTop, FLARE_BOX } from "../room/Window";
import { box } from "../viewport";

const { x, y, w, h } = FLARE_BOX;
const vb = `${x} ${y} ${w} ${h}`;

/**
 * Window curtains, between the wall and the rest of the room. The loose
 * flare under each tie-back is its own small box swaying on a CSS loop
 * (transform only, so it never repaints the room). Static for reduced motion.
 */
export function Curtains() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <CurtainTop />
        <g transform="translate(1600 0) scale(-1 1)">
          <CurtainTop />
        </g>
      </svg>
      <div className="curtain-flare" style={box(x, y, w, h)}>
        <svg viewBox={vb}>
          <CurtainFlare />
        </svg>
      </div>
      <div className="curtain-flare curtain-flare-right" style={box(1600 - x - w, y, w, h)}>
        <svg viewBox={vb} style={{ transform: "scaleX(-1)" }}>
          <CurtainFlare />
        </svg>
      </div>
    </ParallaxLayer>
  );
}
