import { KEYBOARD } from "../layout";

/**
 * Mechanical keyboard. The RGB strip along its front is a separate,
 * glowing component (RgbStrip) so it stays bright above the night tint.
 */
export function Keyboard() {
  const { x, y, w, h } = KEYBOARD;
  const keys = Array.from({ length: 12 }, (_, i) => x + 5 + i * 8.8);
  return (
    <g data-prop="keyboard">
      <rect x={x} y={y} width={w} height={h} rx="3" fill="var(--ink)" />
      <g fill="var(--indigo-dark)">
        {keys.map((kx, i) => (
          <rect key={i} x={kx} y={y - 4} width="7" height="6" rx="1.5" />
        ))}
      </g>
      <g fill="var(--indigo)">
        {keys.slice(0, 11).map((kx, i) => (
          <rect key={i} x={kx + 4} y={y + 3} width="7" height="5" rx="1.5" />
        ))}
      </g>
    </g>
  );
}
