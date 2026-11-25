import { LAPTOP_LID, LAPTOP_SCREEN } from "../layout";

/** Laptop, front right on the desk, with a sticker on the lid. */
export function Laptop() {
  const l = LAPTOP_LID;
  const s = LAPTOP_SCREEN;
  return (
    <g data-prop="laptop">
      <path d="M1060 605H1160L1152 597H1068Z" fill="var(--wall-shade)" />
      <path d="M1060 605H1160V608H1060Z" fill="var(--indigo-dark)" opacity="0.5" />
      <rect x={l.x} y={l.y} width={l.w} height={l.h} rx="4" fill="var(--wall-shade)" />
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="1.5" fill="var(--screen)" />
      {/* Sticker: a little orange alarm clock, our own mark. */}
      <g transform={`translate(${l.x + 9} ${l.y + 3.5})`}>
        <circle r="4.2" fill="var(--accent)" />
        <circle r="2.4" fill="var(--paper)" />
        <path d="M0 0V-1.6M0 0L1.2 0.6" stroke="var(--ink)" strokeWidth="0.7" strokeLinecap="round" />
      </g>
    </g>
  );
}
