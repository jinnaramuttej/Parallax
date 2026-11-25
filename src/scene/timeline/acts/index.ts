import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";
import { alarm } from "./alarm";
import { boot } from "./boot";
import { breakAct } from "./break";
import { bug } from "./bug";
import { coffee } from "./coffee";
import { dark } from "./dark";
import { focus } from "./focus";
import { fridge } from "./fridge";
import { multitask } from "./multitask";

/** Acts not choreographed yet. */
const pending = () => {};

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  dark: dark,
  alarm: alarm,
  coffee: coffee,
  boot: boot,
  focus: focus,
  break: breakAct,
  multitask: multitask,
  bug: bug,
  fridge: fridge,
  deploy: pending,
};
