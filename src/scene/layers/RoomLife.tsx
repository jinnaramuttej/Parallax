import { ParallaxLayer } from "@/components/ParallaxLayer";
import { WallClock } from "../room/life/WallClock";

/**
 * Room-plane pieces (speed 1) that move every frame, kept out of the big
 * room SVG so they never repaint it: the wall clock's hands.
 */
export function RoomLife() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <WallClock />
    </ParallaxLayer>
  );
}
