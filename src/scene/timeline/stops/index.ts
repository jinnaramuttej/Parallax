import type { StopContext } from "../master";
import { stop0 } from "./stop0";
import { stop1 } from "./stop1";
import { stop2 } from "./stop2";
import { stop3 } from "./stop3";
import { stop4 } from "./stop4";
import { stop5 } from "./stop5";

/** One builder per stop. Each owns its arrival (camera), copy, light and surprise. */
export const STOP_BUILDERS: ((ctx: StopContext) => void)[] = [
  stop0,
  stop1,
  stop2,
  stop3,
  stop4,
  stop5,
];
