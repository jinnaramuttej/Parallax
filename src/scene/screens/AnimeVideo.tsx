import type { Rect } from "../room/layout";
import { VideoChrome } from "./VideoChrome";

/** Dramatic subtitle lines, one at a time (the timeline swaps them). */
export const ANIME_LINES = [
  "Not yet... this build is NOT over!",
  "Every red line... makes me stronger.",
  "Final form: CLEAN CODE!",
  "HAAAAAAAAA!!",
];

const RAYS = Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2);
/** Polar point, rounded so server and client render identical strings. */
const pt = (a: number, r: number) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;

/**
 * An original flat-vector anime-style scene (no real show or characters):
 * a dark-haired hero in a red scarf charging a cyan energy orb, speed lines
 * bursting behind him, subtitles at the bottom. Drawn on a 160x90 canvas.
 * `idPrefix` keeps ids unique when the scene is drawn more than once.
 */
export function AnimeVideo({
  idPrefix = "anime",
  line = 0,
  frame,
}: {
  idPrefix?: string;
  line?: number;
  /** Where to draw it inside a parent SVG (omit to fill the parent). */
  frame?: Rect;
}) {
  const g = `${idPrefix}-grad`;
  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      data-anime={idPrefix}
      x={frame?.x}
      y={frame?.y}
      width={frame?.w ?? "100%"}
      height={frame?.h ?? "100%"}
    >
      <defs>
        <radialGradient id={g} cx="0.62" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="0.35" stopColor="#ff7a59" />
          <stop offset="1" stopColor="#2a1f5e" />
        </radialGradient>
        <radialGradient id={`${g}-orb`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#9ff0ff" />
          <stop offset="1" stopColor="#2ec4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#${g})`} />
      <g transform="translate(100 40)">
        <g data-anime-part="lines">
          {RAYS.map((a, i) => (
            <path
              key={i}
              d={`M${pt(a, 18)}L${pt(a - 0.03, 140)}L${pt(a + 0.03, 140)}Z`}
              fill="#fff"
              opacity={i % 3 === 0 ? 0.55 : 0.28}
            />
          ))}
        </g>
      </g>
      <g data-anime-part="hero" transform="translate(56 92)">
        {/* Shoulders and red scarf */}
        <path d="M-40 0C-36 -26 -16 -34 0 -34C18 -34 36 -26 40 0Z" fill="#3b3f8f" />
        <path d="M-20 -30C-6 -22 12 -22 22 -32L26 -24C14 -12 -8 -12 -24 -22Z" fill="#ff4d5e" />
        <path d="M22 -30L44 -38L40 -26Z" fill="#ff4d5e" />
        {/* Face */}
        <path d="M-12 -40C-14 -58 -6 -66 4 -66C16 -66 22 -56 20 -42C18 -34 10 -30 4 -30C-6 -30 -10 -34 -12 -40Z" fill="#f2c39b" />
        {/* Spiky hair */}
        <path
          d="M-16 -50L-30 -60L-14 -62L-26 -80L-8 -70L-6 -92L4 -72L16 -88L16 -68L32 -76L24 -58L36 -54L20 -50C14 -60 0 -62 -10 -54Z"
          fill="#1f1b3d"
        />
        <path d="M-6 -88L0 -74L8 -84" stroke="#4ad6ff" strokeWidth="1.5" fill="none" />
        {/* Determined eye */}
        <path d="M6 -50L18 -52L17 -46L7 -45Z" fill="#fff" />
        <circle cx="13" cy="-48.5" r="2.4" fill="#1f1b3d" />
        <circle cx="13.8" cy="-49.4" r="0.8" fill="#fff" />
        <path d="M4 -55L19 -58" stroke="#1f1b3d" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 -37L16 -38" stroke="#a0573a" strokeWidth="1.4" strokeLinecap="round" />
        {/* Arm raised toward the orb */}
        <path d="M24 -18C34 -26 40 -34 42 -44" stroke="#3b3f8f" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="43" cy="-46" r="5" fill="#f2c39b" />
      </g>
      <g data-anime-part="orb" transform="translate(100 44)">
        <circle r="22" fill={`url(#${g}-orb)`} opacity="0.7" />
        <circle r="11" fill={`url(#${g}-orb)`} />
        <path d="M-14 -4L-6 -1L-10 5M10 -12L5 -4L12 -2M6 10L2 4L-3 12" stroke="#fff" strokeWidth="1" fill="none" />
      </g>
      <g data-anime-part="subs" fontSize="6.4" fontWeight="800" textAnchor="middle" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
        {ANIME_LINES.map((text, i) => (
          <text
            key={i}
            data-sub={i}
            x="80"
            y="77"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.6"
            paintOrder="stroke"
            opacity={i === line ? 1 : 0}
          >
            {text}
          </text>
        ))}
      </g>
      <VideoChrome id={`${idPrefix}`} />
    </svg>
  );
}
