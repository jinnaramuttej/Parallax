import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";
import { dark } from "./dark";

/** Acts not choreographed yet. */
const pending = () => {};

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  dark: dark,
  alarm: pending,
  coffee: pending,
  boot: pending,
  focus: pending,
  break: pending,
  multitask: pending,
  bug: pending,
  fridge: pending,
  deploy: pending,
};
