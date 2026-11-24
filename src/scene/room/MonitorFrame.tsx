/** Screen area inside the bezel, in canvas units. MonitorScreen draws into it. */
export const SCREEN = { x: 832, y: 444, w: 216, h: 134 };

/** Monitor bezel and stand. */
export function MonitorFrame() {
  return (
    <g>
      <rect x="926" y="586" width="28" height="18" fill="var(--ink)" />
      <rect x="888" y="600" width="104" height="6" rx="3" fill="var(--ink)" />
      <rect
        x="820"
        y="432"
        width="240"
        height="158"
        rx="10"
        fill="var(--ink)"
      />
      <rect
        x={SCREEN.x}
        y={SCREEN.y}
        width={SCREEN.w}
        height={SCREEN.h}
        rx="3"
        fill="var(--screen)"
      />
      <circle cx="940" cy="584" r="2.5" fill="var(--can)" />
    </g>
  );
}
