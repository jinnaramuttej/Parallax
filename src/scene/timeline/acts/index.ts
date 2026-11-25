import type { ActId } from "@/config/acts";
import type { ActContext } from "../master";
import { alarm } from "./alarm";
import { bug } from "./bug";
import { deploy } from "./deploy";
import { desk } from "./desk";
import { focus } from "./focus";
import { fridge } from "./fridge";
import { wake } from "./wake";

/** Choreography per act id (timing and framing come from src/config/acts.ts). */
export const ACT_BUILDERS: Record<ActId, (ctx: ActContext) => void> = {
  alarm,
  wake,
  desk,
  focus,
  bug,
  fridge,
  deploy,
};
