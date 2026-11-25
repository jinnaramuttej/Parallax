import type { Rect } from "../room/layout";
import { VideoChrome } from "./VideoChrome";

export const MOVIE_LINES = [
  "Some days the city sleeps.",
  "Some days it ships.",
  "...he's typing again, isn't he?",
];

/**
 * A "movie" in a widescreen frame with cinematic letterboxing: a sunset
 * city, birds, subtitles, and player chrome. 160x90 canvas.
 */
export function MovieVideo({
  idPrefix = "movie",
  line = 0,
  frame,
}: {
  idPrefix?: string;
  line?: number;
  frame?: Rect;
}) {
  const g = `${idPrefix}-sky`;
  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      data-movie={idPrefix}
      x={frame?.x}
      y={frame?.y}
      width={frame?.w ?? "100%"}
      height={frame?.h ?? "100%"}
    >
      <defs>
        <linearGradient id={g} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5b3b8c" />
          <stop offset="0.55" stopColor="#ff8a5b" />
          <stop offset="1" stopColor="#ffd28a" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#${g})`} />
      <g data-movie-part="sun">
        <circle cx="110" cy="54" r="13" fill="#ffe7a3" />
      </g>
      <g data-movie-part="far">
        <path d="M-10 66V52H6V44H16V56H26V40H36V58H48V48H60V62H72V46H84V58H96V50H108V60H120V42H132V56H146V48H170V66Z" fill="#8a4f8f" />
      </g>
      <g data-movie-part="near">
        <path d="M-10 70V60H10V50H20V62H34V54H44V66H58V56H70V64H90V52H100V62H116V58H130V64H150V56H170V70Z" fill="#3e2a5c" />
        <path d="M-10 70H170V80H-10Z" fill="#2a1d45" />
      </g>
      <g data-movie-part="birds" stroke="#3e2a5c" strokeWidth="0.8" fill="none">
        <path d="M30 30q3 -3 6 0q3 -3 6 0" />
        <path d="M46 24q2 -2 4 0q2 -2 4 0" />
      </g>
      {/* Letterbox */}
      <rect width="160" height="12" fill="#000" />
      <rect y="70" width="160" height="20" fill="#000" />
      <g fontSize="5.2" textAnchor="middle" fill="#fff" style={{ fontFamily: "var(--font-bricolage), sans-serif" }}>
        {MOVIE_LINES.map((text, i) => (
          <text key={i} data-sub={i} x="80" y="77" opacity={i === line ? 1 : 0}>
            {text}
          </text>
        ))}
      </g>
      <VideoChrome id={`${idPrefix}`} />
    </svg>
  );
}
