import type { ActId } from "./acts";

/**
 * Comic captions and SFX lettering, by id. Each act lists its captions here
 * (text, type, where they may go, tilt, size, when they enter and leave,
 * and how they come in). The scroll scrubs them; speech balloons for the
 * voice lines (src/config/voice.ts) are shown by the audio system through
 * showBalloon(id) instead.
 *
 * Placement: a caption tries its anchors in order and takes the first one
 * where it covers neither his face, the screens, the HUD nor another
 * caption (press D in the scene to see the zones).
 */

/** Impact = big SFX word (Bangers); balloon = speech at his head; box = narration box. */
export type CaptionType = "impact" | "balloon" | "box";
/** pop: overshoot; shake: jitter in place; stamp: slams down; scatter: letters fly in. */
export type Entrance = "pop" | "shake" | "stamp" | "scatter";

/**
 * Screen zones, as fractions of the stage (x, y of the caption's centre).
 * Named zones first; the grid zones are the fallback when none is clear.
 */
export const ZONES = {
  "top-left": [0.25, 0.22],
  top: [0.5, 0.17],
  "top-right": [0.75, 0.22],
  left: [0.2, 0.46],
  right: [0.8, 0.46],
  "bottom-left": [0.26, 0.68],
  "bottom-right": [0.74, 0.68],
  bottom: [0.5, 0.74],
  "far-left": [0.14, 0.3],
  "far-right": [0.86, 0.3],
  "low-left": [0.14, 0.58],
  "low-right": [0.86, 0.58],
} as const;
export type Zone = keyof typeof ZONES;

export type Caption = {
  id: string;
  text: string;
  type: CaptionType;
  act: ActId;
  /** Day progress window it is on screen. */
  enter: number;
  exit: number;
  /** Zones to try, in order (defaults to the act's safe zones). */
  anchors?: Zone[];
  /** Tilt in degrees (impact words lean back -6 to -12). */
  rotation: number;
  /** Font size in canvas units (1600x900 design canvas). */
  size: number;
  entrance: Entrance;
  /** Letter fill (palette variable). */
  color?: string;
};

/** Where captions may go in each act, best first: away from his face and the screens. */
export const SAFE_ZONES: Record<ActId, Zone[]> = {
  dark: ["top-right", "top", "right"],
  alarm: ["top-right", "right", "top", "bottom-right"],
  coffee: ["top-right", "top-left", "right", "top"],
  boot: ["top-left", "top", "bottom-left", "top-right"],
  focus: ["top-left", "top-right", "bottom-left", "bottom-right"],
  break: ["top-left", "top", "bottom-left", "top-right"],
  multitask: ["top-left", "bottom-left", "top-right", "top"],
  bug: ["top-left", "top", "bottom-left", "top-right"],
  fridge: ["top-left", "left", "top", "bottom-left"],
  deploy: ["top", "top-right", "top-left", "bottom-right"],
};

export const CAPTIONS: Caption[] = [
  { id: "brring", text: "BRRRING!!", type: "impact", act: "alarm", enter: 0.047, exit: 0.071, anchors: ["top-left", "top", "top-right"], rotation: -10, size: 104, entrance: "shake", color: "var(--sun)" },
  { id: "lock-in", text: "LOCK IN.", type: "impact", act: "alarm", enter: 0.108, exit: 0.128, rotation: -8, size: 96, entrance: "stamp", color: "var(--accent)" },
  { id: "sip", text: "SIP.", type: "impact", act: "coffee", enter: 0.199, exit: 0.213, anchors: ["top-right", "top", "top-left"], rotation: -7, size: 78, entrance: "pop", color: "var(--paper)" },
  { id: "boot-seq", text: "BOOT SEQUENCE", type: "box", act: "boot", enter: 0.228, exit: 0.25, rotation: -3, size: 40, entrance: "scatter" },
  { id: "flow", text: "flow state.", type: "box", act: "focus", enter: 0.348, exit: 0.386, rotation: -2, size: 44, entrance: "pop" },
  { id: "one-more-ep", text: "ONE MORE EP…", type: "box", act: "break", enter: 0.421, exit: 0.437, rotation: -3, size: 40, entrance: "pop" },
  { id: "wait-what", text: "WAIT WHAT", type: "impact", act: "break", enter: 0.4588, exit: 0.4668, anchors: ["top-left", "bottom-left", "top"], rotation: -12, size: 96, entrance: "shake", color: "var(--sun)" },
  { id: "back-to-work", text: "BACK TO WORK!!", type: "impact", act: "break", enter: 0.4705, exit: 0.488, anchors: ["top", "top-left", "top-right"], rotation: -8, size: 92, entrance: "stamp", color: "var(--accent)" },
  { id: "multitasking", text: "multitasking™", type: "box", act: "multitask", enter: 0.562, exit: 0.606, rotation: -3, size: 42, entrance: "pop" },
  { id: "error-x3", text: "ERROR ERROR ERROR", type: "impact", act: "bug", enter: 0.676, exit: 0.698, anchors: ["top", "top-left", "bottom-left"], rotation: -10, size: 84, entrance: "scatter", color: "var(--error)" },
  { id: "cat", text: "...CAT.", type: "balloon", act: "bug", enter: 0.689, exit: 0.704, rotation: 0, size: 34, entrance: "pop" },
  { id: "pssht", text: "PSSHT!", type: "impact", act: "fridge", enter: 0.809, exit: 0.824, anchors: ["top-left", "left", "top"], rotation: -9, size: 90, entrance: "pop", color: "var(--can)" },
  { id: "shipped", text: "SHIPPED!!", type: "impact", act: "deploy", enter: 0.968, exit: 1.01, anchors: ["top", "top-left", "top-right"], rotation: -8, size: 132, entrance: "stamp", color: "var(--can)" },
];

/** Comic font size of the voice-line balloons, in canvas units. */
export const BALLOON_SIZE = 30;
