import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";
import { alarm } from "./alarm";
import { boot } from "./boot";
import { breakAct } from "./break";
import { bug } from "./bug";
import { coffee } from "./coffee";
import { dark } from "./dark";
import { deploy } from "./deploy";
import { focus } from "./focus";
import { fridge } from "./fridge";
import { multitask } from "./multitask";

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  dark,
  alarm,
  coffee,
  boot,
  focus,
  break: breakAct,
  multitask,
  bug,
  fridge,
  deploy,
};
