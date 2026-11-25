import type { SfxName } from "@/audio/synth";
import { MOMENTS } from "./acts";

/**
 * Sound-effect cues on the day (all synthesised, src/audio/synth.ts). A cue
 * fires when the scroll passes it going forward at a normal pace.
 */
export const SFX_CUES: { at: number; sfx: SfxName }[] = [
  { at: 0.046, sfx: "alarm" },
  { at: 0.05, sfx: "meow" },
  { at: 0.229, sfx: "boot" },
  { at: MOMENTS.standupPing, sfx: "ping" },
  { at: 0.466, sfx: "whoosh" },
  { at: 0.668, sfx: "meow" },
  { at: 0.674, sfx: "error" },
  { at: 0.806, sfx: "crack" },
  { at: MOMENTS.deploySuccess, sfx: "pop" },
];

/** The fridge hums while its door is open. */
export const HUM_SPAN = MOMENTS.fridgeDoorOpen;

/** Spans where he is typing: key clicks while the day moves through them. */
export const TYPING_SPANS: [number, number][] = [
  [0.232, 0.415],
  [0.476, 0.646],
  [0.708, 0.734],
  [0.882, 0.93],
];
