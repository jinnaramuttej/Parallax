import { ParallaxLayer } from "@/components/ParallaxLayer";
import { LaptopScreen, MainScreen, SecondScreen } from "../screens/Screens";

/**
 * All three screens' content (room plane, speed 1). Sits above the room and
 * below the guy; the night tint has holes over the screens so they stay bright.
 */
export function MonitorScreen() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <SecondScreen state="off" />
        <MainScreen state="off" />
        <LaptopScreen state="off" />
      </svg>
    </ParallaxLayer>
  );
}
