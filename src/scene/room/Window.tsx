const CURTAIN =
  "M410 44H522C516 200 488 330 470 410C488 452 500 500 504 566H404C410 500 420 452 432 410C420 330 412 200 410 44Z";

function Curtain() {
  return (
    <g>
      <path d={CURTAIN} fill="var(--indigo)" />
      <path
        d="M444 52C446 200 446 320 450 410M480 52C476 200 468 320 458 410M448 426C448 470 444 520 440 562M466 426C474 470 480 520 484 562"
        stroke="var(--indigo-dark)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="424" y="402" width="56" height="16" rx="8" fill="var(--sun)" />
    </g>
  );
}

/** Window frame, sill, glass glints, rod and curtains. */
export function Window() {
  return (
    <g>
      <g fill="var(--paper)" opacity="0.14">
        <path d="M540 90H600L506 240H480V200Z" />
        <path d="M850 90H880L812 200V150Z" />
        <path d="M1000 290H1060L960 450H900Z" />
      </g>
      <g fill="var(--paper)">
        <rect x="466" y="56" width="668" height="16" />
        <rect x="466" y="56" width="16" height="420" />
        <rect x="1118" y="56" width="16" height="420" />
        <rect x="794" y="70" width="12" height="400" />
        <rect x="480" y="262" width="640" height="9" />
        <rect x="448" y="466" width="704" height="18" rx="4" />
      </g>
      <rect x="460" y="484" width="680" height="8" fill="var(--wall-shade)" />
      <rect
        x="392"
        y="38"
        width="816"
        height="9"
        rx="4.5"
        fill="var(--wood-dark)"
      />
      <circle cx="392" cy="42" r="10" fill="var(--wood-dark)" />
      <circle cx="1208" cy="42" r="10" fill="var(--wood-dark)" />
      <Curtain />
      <g transform="translate(1600 0) scale(-1 1)">
        <Curtain />
      </g>
    </g>
  );
}
