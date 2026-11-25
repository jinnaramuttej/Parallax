/** Notepad lying on the desk with a pen, plus sticky notes on the monitor bezels. */
export function Notepad() {
  return (
    <g data-prop="notepad">
      <path d="M962 605H1030L1023 596H968Z" fill="var(--paper)" />
      <path d="M969 599H1022M966 602H1026" stroke="var(--window-cool)" strokeWidth="0.8" />
      <g fill="var(--ink)">
        {Array.from({ length: 7 }, (_, i) => (
          <circle key={i} cx={972 + i * 8} cy="596.5" r="1.1" />
        ))}
      </g>
      <path d="M1000 600L1030 593" stroke="var(--accent-dark)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

export function StickyNotes() {
  return (
    <g data-prop="sticky-notes">
      <g transform="rotate(7 1052 442)">
        <rect x="1044" y="434" width="17" height="17" rx="1" fill="var(--sun)" />
        <path d="M1047 440h10M1047 444h7" stroke="var(--ink)" strokeWidth="1" opacity="0.5" />
      </g>
      <g transform="rotate(-5 830 578)">
        <rect x="822" y="571" width="15" height="15" rx="1" fill="var(--accent)" />
        <path d="M825 577h9" stroke="var(--ink)" strokeWidth="1" opacity="0.5" />
      </g>
      <g transform="rotate(4 805 470)">
        <rect x="798" y="463" width="13" height="13" rx="1" fill="var(--can)" />
      </g>
    </g>
  );
}
