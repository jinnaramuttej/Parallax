import { StatefulG, type StatefulProps } from "../Stateful";

/**
 * Generic green cans with our own mark (no real brand). Slots 0-5 stack on
 * the desk for the story's cans; slots 6+ pile up under the desk for cans
 * dropped from the fridge by clicking it.
 */
export const DESK_SLOTS: [number, number][] = [
  [1204, 570],
  [1224, 570],
  [1244, 570],
  [1214, 536],
  [1234, 536],
  [1224, 502],
];

export const FLOOR_SLOTS: [number, number][] = [
  [896, 726],
  [918, 726],
  [940, 726],
  [962, 726],
  [984, 726],
  [1006, 726],
  [907, 692],
  [929, 692],
  [951, 692],
  [973, 692],
  [995, 692],
  [918, 658],
  [940, 658],
  [962, 658],
  [984, 658],
];

/**
 * The can's logo: an original mark (a bolt in a ring). Swap this one
 * component to put your own logo on every can in the scene.
 */
export function CanLogo() {
  return (
    <g>
      <circle cx="10" cy="18" r="6.4" fill="var(--paper)" />
      <path d="M11.6 13.2L7.2 18.8H10.2L8.7 23.2L13.1 17.4H10.1Z" fill="var(--can-dark)" />
    </g>
  );
}

/** One upright can, 20 x 34, top-left at the origin. */
export function Can() {
  return (
    <g>
      <rect x="0" y="2" width="20" height="32" rx="4" fill="var(--can)" />
      <rect x="1" y="0" width="18" height="4" rx="2" fill="var(--can-dark)" />
      <rect x="0" y="29" width="20" height="3" fill="var(--can-dark)" />
      <rect x="3" y="6" width="2.5" height="20" rx="1.2" fill="var(--paper)" opacity="0.35" />
      <CanLogo />
    </g>
  );
}

/** Where his open can stands, right of the mouse. */
export const DESK_CAN = { x: 866, y: 570 };
export type DeskCanState = "upright" | "spill";

/**
 * His open can on the desk: upright, or knocked over with a green puddle
 * (prop "desk-can"; the cat walking off the keyboard tips it).
 */
export function DeskCan({ state = "upright", visible = true }: StatefulProps<DeskCanState>) {
  const { x, y } = DESK_CAN;
  return (
    <StatefulG<DeskCanState>
      id="desk-can"
      state={state}
      visible={visible}
      states={{
        upright: (
          <g transform={`translate(${x} ${y})`}>
            <Can />
          </g>
        ),
        spill: (
          <g>
            <path
              d={`M${x - 6} ${y + 34}C${x + 6} ${y + 30} ${x + 40} ${y + 29} ${x + 68} ${y + 32}C${x + 78} ${y + 33} ${x + 76} ${y + 36} ${x + 64} ${y + 36}H${x - 4}C${x - 12} ${y + 36} ${x - 12} ${y + 35} ${x - 6} ${y + 34}Z`}
              fill="var(--can)"
              opacity="0.8"
            />
            <circle cx={x + 84} cy={y + 34} r="2.4" fill="var(--can)" opacity="0.8" />
            <circle cx={x + 92} cy={y + 35} r="1.6" fill="var(--can)" opacity="0.8" />
            <g transform={`translate(${x + 2} ${y + 34}) rotate(-90)`}>
              <Can />
            </g>
          </g>
        ),
      }}
    />
  );
}

/** The finished pile: all six desk cans stacked (the 3 AM state, and the gallery). */
export function CanStack() {
  return (
    <g data-prop="can-stack">
      {DESK_SLOTS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <Can />
        </g>
      ))}
    </g>
  );
}

export function Cans() {
  return (
    <g>
      {[...DESK_SLOTS, ...FLOOR_SLOTS].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g data-can={i} opacity="0">
            <Can />
          </g>
        </g>
      ))}
    </g>
  );
}
