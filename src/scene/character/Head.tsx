/**
 * The head, drawn around the neck pivot at (0, 0), facing right.
 * Expressions are alternate shapes toggled with opacity.
 */
export function Head() {
  return (
    <g data-j="look">
      <circle data-face cx="4" cy="-30" r="30" fill="var(--skin)" />
      <ellipse cx="-8" cy="-28" rx="6" ry="8" fill="var(--skin-dark)" />
      <path
        d="M-27 -24C-32 -58 0 -74 26 -60C34 -54 37 -46 35 -40C22 -47 8 -47 -3 -43C-8 -35 -11 -29 -11 -18C-18 -15 -24 -17 -27 -24Z"
        fill="var(--hair)"
      />
      <circle cx="34" cy="-24" r="4.5" fill="var(--skin-dark)" />
      <path
        d="M11 -33L-5 -35"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g data-el="eyes-open" opacity="0">
        <circle data-el="pupil" cx="21" cy="-32" r="3.3" fill="var(--ink)" />
      </g>
      <path
        data-el="eyes-closed"
        d="M15 -31Q20.5 -27 26 -31"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="20"
        cy="-32"
        r="9.5"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      <path
        data-el="brow"
        d="M12 -46Q19.5 -50 27 -46"
        stroke="var(--hair)"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        data-el="mouth-smile"
        d="M21 -14Q27 -9 33 -14"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0"
      />
      <path
        data-el="mouth-flat"
        d="M22 -12H32"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <ellipse
        data-el="mouth-o"
        cx="27"
        cy="-12"
        rx="5"
        ry="6.5"
        fill="var(--ink)"
        opacity="0"
      />
      <g
        data-el="dnd"
        opacity="0"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M-30 -46Q-40 -30 -30 -14" />
        <path d="M-42 -54Q-56 -30 -42 -6" />
        <path d="M-54 -62Q-72 -30 -54 2" />
      </g>
      <g data-el="headphones" opacity="0">
        <path
          d="M-15 -34C-15 -76 32 -78 36 -46"
          stroke="var(--ink)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <rect
          x="-18"
          y="-42"
          width="18"
          height="26"
          rx="7"
          fill="var(--accent-dark)"
        />
      </g>
    </g>
  );
}
