import { ParallaxLayer } from "@/components/ParallaxLayer";
import { Bed } from "./Bed";
import { Chair } from "./Chair";
import { Desk } from "./Desk";
import { Fridge } from "./Fridge";
import { Lamp } from "./Lamp";
import { MonitorFrame } from "./MonitorFrame";
import { Posters } from "./Posters";
import { Wall } from "./Wall";
import { Window } from "./Window";

/** The room plane (speed 1). The skyline shows through the window cut-out. */
export function Room() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <Wall />
        <Window />
        <Posters />
        <Bed />
        <Fridge />
        <Desk />
        <MonitorFrame />
        <Lamp />
        <Chair />
      </svg>
    </ParallaxLayer>
  );
}
