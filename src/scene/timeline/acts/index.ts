import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";

/** Acts not choreographed yet. */
const pending = () => {};

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  dark: pending,
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
