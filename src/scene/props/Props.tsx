import { ParallaxLayer } from "@/components/ParallaxLayer";
import { AlarmClock } from "./AlarmClock";
import { Blanket } from "./Blanket";
import { Cans, DeskCan } from "./Cans";
import { DeskSteam } from "./DeskSteam";
import { Papers } from "./Papers";
import { Zzz } from "./Zzz";

/** Room props that sit in front of the guy (speed 1, same plane as the room). */
export function Props() {
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <Blanket />
        <AlarmClock />
        <Papers />
        <Cans />
        <DeskCan />
      </svg>
      <Zzz />
      <DeskSteam />
    </ParallaxLayer>
  );
}
