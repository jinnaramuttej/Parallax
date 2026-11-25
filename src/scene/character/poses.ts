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

/**
 * Hip height standing (thigh 70 + shin and shoe 90 above the floor at 760)
 * and seated (thighs resting on the chair seat at 674, feet on the floor).
 */
export const STAND_Y = 600;
export const SIT_Y = 668;

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

// Thighs along the seat, near shin straight down to the floor, far foot
// tucked back under the chair.
const sit = {
  x: 600,
  y: SIT_Y,
  body: 0,
  legNearU: -88,
  legNearL: 88,
  legFarU: -84,
  legFarL: 103,
};

export const POSES = {
  asleep: {
    ...stand,
    x: 270,
    y: 640,
    body: -90,
    head: -6,
    armFarU: 4,
    armFarL: -6,
    armNearU: 2,
    armNearL: -8,
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
  // Sitting at the desk, hands resting on the desk edge.
  seated: {
    ...stand,
    ...sit,
    torso: 8,
    head: -8,
    armFarU: -25,
    armFarL: -100,
    armNearU: -29,
    armNearL: -95,
  },
  // Near hand on the desk mug's handle (652, 592).
  reachMug: {
    ...stand,
    ...sit,
    torso: 6,
    head: -6,
    armFarU: -25,
    armFarL: -100,
    armNearU: 2,
    armNearL: -137,
  },
  // Mug at his mouth, head tipped back a little.
  sip: {
    ...stand,
    ...sit,
    torso: 4,
    head: -12,
    armFarU: -25,
    armFarL: -100,
    armNearU: -57,
    armNearL: -136,
  },
  // Leaning in toward the keyboard, elbows on the desk edge, hands on keys.
  typing: {
    ...stand,
    ...sit,
    torso: 16,
    head: -12,
    armFarU: -56,
    armFarL: -70,
    armNearU: -60,
    armNearL: -64,
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
    // Legs stretched out, heels on the floor.
    legNearU: -80,
    legNearL: 50,
    legFarU: -76,
    legFarL: 42,
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
  // Slouched back in the chair, watching the second monitor.
  slump: {
    ...stand,
    ...sit,
    x: 592,
    torso: -12,
    head: 8,
    armFarU: -12,
    armFarL: -46,
    armNearU: -16,
    armNearL: -54,
    legNearU: -80,
    legNearL: 62,
    legFarU: -76,
    legFarL: 70,
  },
  // Slouched, a snack at his mouth.
  snack: {
    ...stand,
    ...sit,
    x: 592,
    torso: -10,
    head: 2,
    armFarU: -12,
    armFarL: -46,
    armNearU: -52,
    armNearL: -138,
    legNearU: -80,
    legNearL: 62,
    legFarU: -76,
    legFarL: 70,
  },
  // Bolt upright, arms flung out.
  jolt: {
    ...stand,
    ...sit,
    torso: 0,
    head: -20,
    armFarU: -74,
    armFarL: -40,
    armNearU: -86,
    armNearL: -26,
  },
  // Both arms reaching forward to lift the cat off the keyboard.
  liftCat: {
    ...stand,
    ...sit,
    torso: 14,
    head: -4,
    armFarU: -96,
    armFarL: -24,
    armNearU: -102,
    armNearL: -18,
  },
  // Standing at the fridge, cracking the can open with both hands.
  crackCan: {
    ...stand,
    x: 1240,
    torso: 4,
    head: 10,
    armFarU: -40,
    armFarL: -96,
    armNearU: -44,
    armNearL: -90,
  },
  // Standing, can at his mouth.
  sipCan: {
    ...stand,
    x: 1240,
    torso: -2,
    head: -14,
    armFarU: -10,
    armFarL: -20,
    armNearU: -60,
    armNearL: -134,
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
