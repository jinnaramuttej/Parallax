import { ParallaxLayer } from "@/components/ParallaxLayer";
import { Bed } from "./Bed";
import { Chair } from "./Chair";
import { Desk } from "./Desk";
import { DeskMug } from "../props/Mug";
import { Fridge } from "./Fridge";
import { MonitorFrame } from "./MonitorFrame";
import { DeskMat } from "./desk/DeskMat";
import { Coaster, DeskPlant } from "./desk/DeskPlant";
import { HeadphoneStand } from "./desk/HeadphoneStand";
import { Keyboard } from "./desk/Keyboard";
import { Laptop } from "./desk/Laptop";
import { Mouse } from "./desk/Mouse";
import { Notepad, StickyNotes } from "./desk/Notepad";
import { SecondMonitor } from "./desk/SecondMonitor";
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
        <SecondMonitor />
        <MonitorFrame />
        <StickyNotes />
        <DeskMat />
        <Keyboard />
        <Mouse />
        <Coaster />
        <DeskMug />
        <Notepad />
        <DeskPlant />
        <Laptop />
        <HeadphoneStand />
        <Chair />
      </svg>
    </ParallaxLayer>
  );
}
