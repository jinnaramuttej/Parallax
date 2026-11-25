import { DESK } from "./layout";

/** The desk: a wide top, one leg on the left, drawers on the right. */
export function Desk() {
  const { x, y, w } = DESK;
  return (
    <g>
      <rect x={x + 12} y={y + 16} width="14" height={760 - y - 16} fill="var(--wood-dark)" />
      <rect x="1120" y={y + 16} width="132" height={760 - y - 16} rx="4" fill="var(--wood)" />
      <g fill="var(--wood-dark)">
        <rect x="1130" y="634" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1130" y="676" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1130" y="718" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1172" y="648" width="28" height="6" rx="3" />
        <rect x="1172" y="690" width="28" height="6" rx="3" />
        <rect x="1172" y="732" width="28" height="6" rx="3" />
      </g>
      <rect x={x} y={y} width={w} height="18" rx="5" fill="var(--wood)" />
      <rect x={x} y={y + 14} width={w} height="6" rx="3" fill="var(--wood-dark)" />
    </g>
  );
}
