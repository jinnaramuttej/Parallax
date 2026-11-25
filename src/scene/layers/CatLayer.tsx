import { ParallaxLayer } from "@/components/ParallaxLayer";
import { CatRig } from "../character/Cat";
import { CAT_SPOTS } from "../character/catPoses";

/**
 * The room cat, on the room plane (speed 1) in front of the guy and the
 * bed blanket. It starts curled up asleep at the foot of the bed; the
 * timeline moves and poses it (src/scene/timeline/catRig.ts).
 */
export function CatLayer() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <CatRig which="room" pose="asleep" x={CAT_SPOTS.bed.x} y={CAT_SPOTS.bed.y} face={-1} />
      </svg>
    </ParallaxLayer>
  );
}
