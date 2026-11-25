/**
 * Energy-drink cans ("KRNL", our own made-up brand). Slots 0-5 stack on the
 * desk for the story's cans; slots 6+ pile up under the desk for cans
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

export function Can() {
  return (
    <g>
      <rect x="0" y="2" width="20" height="32" rx="4" fill="var(--can)" />
      <rect x="1" y="0" width="18" height="4" rx="2" fill="var(--can-dark)" />
      <rect x="0" y="12" width="20" height="10" fill="var(--can-dark)" />
      <path d="M12 7L6 18H10L8 28L15 16H11Z" fill="var(--paper)" />
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
