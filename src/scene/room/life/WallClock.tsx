import { box } from "../../viewport";

export const CLOCK = { cx: 1262, cy: 168, r: 40 };

/**
 * Wall clock that always shows the HUD's time. Face is static SVG; each hand
 * is its own HTML box rotated about the clock centre (transform only), set
 * by the world from the time map (src/scene/timeline/world.ts).
 */
export function WallClock({ minutes = 359 }: { minutes?: number }) {
  const { cx, cy, r } = CLOCK;
  const angle = { hour: ((minutes / 60) % 12) * 30, minute: (minutes % 60) * 6 };
  const size = r * 2 + 8;
  const frame = box(cx - size / 2, cy - size / 2, size, size);
  const vb = `${cx - size / 2} ${cy - size / 2} ${size} ${size}`;
  const hand = (name: "hour" | "minute", len: number, width: number, color: string) => (
    <div className="clock-hand" data-el={`clock-${name}`} style={{ transform: `rotate(${angle[name]}deg)` }}>
      <svg viewBox={vb}>
        <line x1={cx} y1={cy + 6} x2={cx} y2={cy - len} stroke={color} strokeWidth={width} strokeLinecap="round" />
      </svg>
    </div>
  );
  return (
    <div className="wall-clock" style={frame} data-el="wall-clock">
      <svg viewBox={vb}>
        <circle cx={cx} cy={cy} r={r} fill="var(--paper)" stroke="var(--ink)" strokeWidth="6" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy - r + 7}
            x2={cx}
            y2={cy - r + (i % 3 === 0 ? 15 : 11)}
            stroke="var(--ink)"
            strokeWidth={i % 3 === 0 ? 3.2 : 1.8}
            strokeLinecap="round"
            transform={`rotate(${i * 30} ${cx} ${cy})`}
          />
        ))}
      </svg>
      {hand("hour", 20, 5, "var(--ink)")}
      {hand("minute", 30, 3.2, "var(--ink)")}
      <svg viewBox={vb} className="clock-pin">
        <circle cx={cx} cy={cy} r="4" fill="var(--accent)" />
      </svg>
    </div>
  );
}
