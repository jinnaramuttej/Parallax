/**
 * The cat's rig. Like the guy, every joint is a <g data-cj="..."> whose
 * local origin is the joint, so a pose is a rotation per joint (degrees,
 * 0 = the drawn rest shape, positive = clockwise on screen). The cat is
 * drawn facing right with its feet on y = 0.
 *
 * `drop` lowers the body centre (crouch, sit, loaf); `reach` lengthens
 * the front legs. `eyes`, `fur` and
 * `tailWrap` are shape swaps (opacity crossfades).
 */

export const CAT_JOINTS = [
  "body",
  "head",
  "earNear",
  "earFar",
  "tail",
  "tailTip",
  "frontNear",
  "frontFar",
  "backNear",
  "backFar",
] as const;

export type CatJoint = (typeof CAT_JOINTS)[number];
export type CatEyes = "open" | "closed" | "wide";
export type CatPose = Record<CatJoint, number> & {
  drop: number;
  /** Extra front-leg length (sitting upright needs longer front legs). */
  reach: number;
  eyes: CatEyes;
  fur: boolean;
  tailWrap: boolean;
};

/** Height of the body centre above the feet when standing. */
export const CAT_HIP = 24;

const stand: CatPose = {
  drop: 0,
  reach: 0,
  body: 0,
  head: 0,
  earNear: 0,
  earFar: 0,
  tail: 0,
  tailTip: 0,
  frontNear: 0,
  frontFar: 0,
  backNear: 0,
  backFar: 0,
  eyes: "open",
  fur: false,
  tailWrap: false,
};

const loaf: CatPose = {
  ...stand,
  drop: 12,
  frontNear: -80,
  frontFar: -76,
  backNear: -70,
  backFar: -66,
  tail: -62,
  tailTip: -30,
};

export const CAT_POSES = {
  stand,
  /** Curled up asleep: loaf, head down on the paws, tail wrapped round. */
  asleep: {
    ...loaf,
    drop: 13,
    body: 6,
    head: 34,
    earNear: -12,
    earFar: -8,
    eyes: "closed",
    tailWrap: true,
  },
  /** Fur up, back arched, legs stiff, ears flat, tail straight up. */
  startled: {
    ...stand,
    drop: -7,
    head: -8,
    earNear: -38,
    earFar: -32,
    tail: 42,
    tailTip: 34,
    frontNear: -12,
    frontFar: -6,
    backNear: 12,
    backFar: 6,
    eyes: "wide",
    fur: true,
  },
  /** Stretched out mid-leap. */
  leap: {
    ...stand,
    drop: -2,
    body: -14,
    head: 10,
    earNear: -20,
    earFar: -16,
    tail: -12,
    tailTip: 10,
    frontNear: -58,
    frontFar: -48,
    backNear: 52,
    backFar: 44,
    eyes: "wide",
  },
  walkA: {
    ...stand,
    tail: 14,
    tailTip: 18,
    frontNear: -22,
    frontFar: 16,
    backNear: 18,
    backFar: -16,
  },
  walkB: {
    ...stand,
    tail: 8,
    tailTip: 26,
    frontNear: 16,
    frontFar: -22,
    backNear: -16,
    backFar: 18,
  },
  /** Sitting upright on its haunches, looking up at the screens. */
  sit: {
    ...stand,
    drop: 0.5,
    reach: 9,
    body: -30,
    head: 18,
    frontNear: 30,
    frontFar: 27,
    backNear: -56,
    backFar: -52,
    tail: -18,
    tailTip: 52,
  },
  /** Loaf with the head up: on his shoulder, tail hanging down his back. */
  shoulder: {
    ...loaf,
    head: -6,
    earNear: 4,
    tail: -86,
    tailTip: -24,
  },
  /** Dangling while he lifts it off the keyboard. */
  held: {
    ...stand,
    drop: -4,
    head: -14,
    earNear: -26,
    earFar: -22,
    tail: -70,
    tailTip: -16,
    frontNear: 8,
    frontFar: 14,
    backNear: 6,
    backFar: 12,
    eyes: "wide",
  },
} satisfies Record<string, CatPose>;

export type CatPoseName = keyof typeof CAT_POSES;

/** Where the cat spends the day (feet position in canvas units). */
export const CAT_SPOTS = {
  /** Curled on the blanket at the foot of the bed. */
  bed: { x: 424, y: 640 },
  /** On the floor after the startle jump. */
  floorByBed: { x: 520, y: 760 },
  /** Sitting on the floor beside the chair, watching the second monitor. */
  besideChair: { x: 506, y: 760 },
  /** Walking across the keyboard (the keys' top edge). */
  keyboardStart: { x: 686, y: 592 },
  keyboardEnd: { x: 836, y: 592 },
  /** Following him to the fridge. */
  fridge: { x: 1270, y: 760 },
} as const;
