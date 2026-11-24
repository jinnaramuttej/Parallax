/**
 * The guy's rig. Every joint is a <g data-j="..."> whose local origin is
 * the joint, so a pose is just a rotation per joint (degrees, 0 = limb
 * hanging straight down, negative = swung forward/toward +x).
 * `x`/`y` place the hip in canvas units; `face` is 1 (right) or -1 (left).
 */

export const ROTATION_JOINTS = [
  "body",
  "torso",
  "head",
  "armFarU",
  "armFarL",
  "armNearU",
  "armNearL",
  "legFarU",
  "legFarL",
  "legNearU",
  "legNearL",
] as const;

export type RotationJoint = (typeof ROTATION_JOINTS)[number];
export type Pose = Record<RotationJoint, number> & { x: number; y: number };

/** Hip height when standing on the floor / sitting on the chair. */
export const STAND_Y = 618;
export const SIT_Y = 677;

const stand: Pose = {
  x: 700,
  y: STAND_Y,
  body: 0,
  torso: 0,
  head: 0,
  armFarU: -4,
  armFarL: -10,
  armNearU: 4,
  armNearL: -12,
  legFarU: 0,
  legFarL: 0,
  legNearU: 0,
  legNearL: 0,
};

const sit = {
  x: 600,
  y: SIT_Y,
  body: 0,
  legNearU: -88,
  legNearL: 84,
  legFarU: -84,
  legFarL: 80,
};

export const POSES = {
  asleep: {
    ...stand,
    x: 278,
    y: 640,
    body: -90,
    head: -6,
    armFarU: 4,
    armFarL: -6,
    armNearU: -10,
    armNearL: -34,
    legNearU: -4,
    legNearL: 4,
  },
  sitUp: {
    ...stand,
    x: 360,
    y: 650,
    body: -20,
    torso: 8,
    head: 10,
    armFarU: -20,
    armFarL: -30,
    armNearU: -30,
    armNearL: -40,
    legFarU: -60,
    legFarL: 60,
    legNearU: -66,
    legNearL: 64,
  },
  stand: { ...stand, x: 498 },
  stretch: {
    ...stand,
    x: 498,
    torso: -7,
    head: -16,
    armFarU: 174,
    armFarL: 6,
    armNearU: 158,
    armNearL: 12,
  },
  walkA: {
    ...stand,
    torso: 5,
    armFarU: -22,
    armFarL: -30,
    armNearU: 22,
    armNearL: -20,
    legFarU: 22,
    legFarL: 30,
    legNearU: -26,
    legNearL: 18,
  },
  walkB: {
    ...stand,
    torso: 5,
    armFarU: 22,
    armFarL: -20,
    armNearU: -22,
    armNearL: -30,
    legFarU: -26,
    legFarL: 18,
    legNearU: 22,
    legNearL: 30,
  },
  typing: {
    ...stand,
    ...sit,
    torso: 10,
    head: -2,
    armFarU: -74,
    armFarL: -30,
    armNearU: -70,
    armNearL: -38,
  },
  leanBack: {
    ...stand,
    ...sit,
    x: 596,
    torso: -14,
    head: -12,
    armFarU: -150,
    armFarL: -96,
    armNearU: -145,
    armNearL: -100,
    legNearU: -80,
    legNearL: 70,
    legFarU: -76,
    legFarL: 66,
  },
  atFridge: {
    ...stand,
    x: 1258,
    torso: 6,
    head: 6,
    armFarU: -20,
    armFarL: -30,
    armNearU: -82,
    armNearL: -8,
    legNearU: -6,
    legFarU: 8,
  },
  holdCan: {
    ...stand,
    x: 1240,
    armNearU: -30,
    armNearL: -80,
  },
  celebrate: {
    ...stand,
    x: 720,
    torso: -5,
    head: -14,
    armFarU: -156,
    armFarL: -12,
    armNearU: 150,
    armNearL: 14,
  },
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;
