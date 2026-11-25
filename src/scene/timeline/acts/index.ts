import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";
import { alarm } from "./alarm";
import { boot } from "./boot";
import { coffee } from "./coffee";
import { dark } from "./dark";
import { focus } from "./focus";

/** Acts not choreographed yet. */
const pending = () => {};

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  dark: dark,
  alarm: alarm,
  coffee: coffee,
  boot: boot,
  focus: focus,
  break: pending,
  multitask: pending,
  bug: pending,
  fridge: pending,
  deploy: pending,
};
