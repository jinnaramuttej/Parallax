/** Desk lamp pointing at the keyboard. Its glow lives in the Glows layer. */
export const LAMP_BULB = { x: 1092, y: 500 };

export function Lamp() {
  return (
    <g>
      <ellipse cx="1150" cy="603" rx="26" ry="6" fill="var(--ink)" />
      <path
        d="M1150 600L1172 522L1112 478"
        stroke="var(--ink)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="1172" cy="522" r="6" fill="var(--ink)" />
      <path d="M1088 460L1130 474L1118 508L1068 492Z" fill="var(--ink)" />
      <ellipse
        cx={LAMP_BULB.x}
        cy={LAMP_BULB.y}
        rx="22"
        ry="7"
        transform={`rotate(18 ${LAMP_BULB.x} ${LAMP_BULB.y})`}
        fill="var(--sun)"
      />
    </g>
  );
}
