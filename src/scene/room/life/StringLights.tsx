import { r1 } from "../../random";

/** Hooks along the top of the wall; the wire sags between them. */
const HOOKS = [60, 330, 640, 960, 1270, 1540];
const HOOK_Y = 22;
const SAG = 30;
const COLORS = ["var(--sun)", "var(--accent)", "var(--window-cool)", "var(--can)", "var(--rgb-violet)"];

type Bulb = { x: number; y: number; angle: number; color: string };

/** Point and slope on a quadratic span from (x0, HOOK_Y) to (x1, HOOK_Y). */
function onSpan(x0: number, x1: number, t: number) {
  const cx = (x0 + x1) / 2;
  const cy = HOOK_Y + SAG * 2;
  const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
  const y = (1 - t) ** 2 * HOOK_Y + 2 * (1 - t) * t * cy + t ** 2 * HOOK_Y;
  const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
  const dy = 2 * (1 - t) * (cy - HOOK_Y) + 2 * t * (HOOK_Y - cy);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

export const BULBS: Bulb[] = HOOKS.slice(1).flatMap((x1, s) =>
  [0.14, 0.32, 0.5, 0.68, 0.86].map((t, i) => {
    const p = onSpan(HOOKS[s], x1, t);
    return { x: r1(p.x), y: r1(p.y), angle: r1(p.angle), color: COLORS[(s * 5 + i) % COLORS.length] };
  }),
);

const WIRE = HOOKS.slice(1)
  .map((x1, s) => `M${HOOKS[s]} ${HOOK_Y}Q${(HOOKS[s] + x1) / 2} ${HOOK_Y + SAG * 2} ${x1} ${HOOK_Y}`)
  .join("");

/** Fairy lights strung along the top of the wall (unlit art; the glow layer lights them). */
export function StringLights() {
  return (
    <g data-el="string-lights">
      <path d={WIRE} stroke="var(--ink)" strokeWidth="2" fill="none" opacity="0.7" />
      {HOOKS.map((x) => (
        <circle key={x} cx={x} cy={HOOK_Y} r="3.5" fill="var(--ink)" />
      ))}
      {BULBS.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}>
          <rect x="-2.5" y="0" width="5" height="5" rx="1" fill="var(--ink)" />
          <ellipse cx="0" cy="10" rx="4.4" ry="6" fill={b.color} opacity="0.75" />
        </g>
      ))}
    </g>
  );
}

/** Lit bulbs and their halos, for the glow layer (opacity follows --lights). */
export function StringLightsGlow() {
  return (
    <svg viewBox="0 0 1600 900" aria-hidden>
      <defs>
        <radialGradient id="bulb-halo">
          <stop offset="0" stopColor="var(--paper)" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="var(--sun)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--sun)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {BULBS.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}>
          <circle cx="0" cy="10" r="20" fill="url(#bulb-halo)" />
          <ellipse cx="0" cy="10" rx="4.4" ry="6" fill={b.color} />
          <ellipse cx="-1.2" cy="8" rx="1.4" ry="2.4" fill="var(--paper)" opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}
