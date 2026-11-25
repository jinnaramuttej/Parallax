import { SECOND_BEZEL, SECOND_SCREEN, SECOND_TILT } from "../layout";

/** Second monitor, left of the main one, turned slightly toward him. */
export function SecondMonitor() {
  const b = SECOND_BEZEL;
  const s = SECOND_SCREEN;
  return (
    <g data-prop="second-monitor">
      <rect x="731" y="566" width="14" height="32" fill="var(--ink)" />
      <rect x="708" y="597" width="60" height="6" rx="3" fill="var(--ink)" />
      <g transform={SECOND_TILT}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="7" fill="var(--ink)" />
        <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="2" fill="var(--screen)" />
        <circle cx={b.x + b.w / 2} cy={b.y + b.h - 3.5} r="1.6" fill="var(--can)" />
      </g>
    </g>
  );
}
