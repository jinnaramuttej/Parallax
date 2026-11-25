import { MAIN_BEZEL, MAIN_SCREEN } from "./layout";

/** Screen area inside the main monitor's bezel (kept for older imports). */
export const SCREEN = MAIN_SCREEN;

/** Main monitor bezel and stand. */
export function MonitorFrame() {
  const b = MAIN_BEZEL;
  const s = MAIN_SCREEN;
  return (
    <g data-prop="main-monitor">
      <rect x="926" y="586" width="28" height="18" fill="var(--ink)" />
      <rect x="888" y="600" width="104" height="6" rx="3" fill="var(--ink)" />
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" fill="var(--ink)" />
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="3" fill="var(--screen)" />
      <circle cx="940" cy="584" r="2.5" fill="var(--can)" />
    </g>
  );
}
