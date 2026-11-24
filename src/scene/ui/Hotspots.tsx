import { ParallaxLayer } from "@/components/ParallaxLayer";
import { SCREEN } from "../room/MonitorFrame";
import { box } from "../viewport";

/**
 * Invisible, focusable buttons over the clickable parts of the room. They
 * sit on the room plane (speed 1) so they track the fridge and monitor.
 */
export function Hotspots() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas">
      <button
        type="button"
        className="hotspot"
        data-hotspot="fridge"
        aria-label="Open the fridge and grab another can"
        style={box(1330, 380, 172, 380)}
      />
      <button
        type="button"
        className="hotspot"
        data-hotspot="monitor"
        aria-label="Show the next code snippet"
        style={box(SCREEN.x - 12, SCREEN.y - 12, SCREEN.w + 24, SCREEN.h + 24)}
      />
    </ParallaxLayer>
  );
}
