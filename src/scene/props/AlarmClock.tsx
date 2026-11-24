/** Centre of the alarm clock on the shelf; it shakes around this point. */
export const ALARM = { x: 124, y: 520 };

/** Twin-bell alarm clock. Shape reused by the loading screen. */
export function AlarmClockShape({ ringing = false }: { ringing?: boolean }) {
  return (
    <g>
      <g
        data-el="alarm-ring"
        opacity={ringing ? 1 : 0}
        stroke="var(--error)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M-40 -26Q-48 -2 -40 22" />
        <path d="M-52 -34Q-64 -2 -52 30" />
        <path d="M40 -26Q48 -2 40 22" />
        <path d="M52 -34Q64 -2 52 30" />
      </g>
      <path
        d="M-16 18L-24 30M16 18L24 30"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="-16" cy="-22" r="10" fill="var(--sun)" />
      <circle cx="16" cy="-22" r="10" fill="var(--sun)" />
      <circle r="25" fill="var(--error)" />
      <circle r="18" fill="var(--paper)" />
      <path
        d="M0 0V-12M0 0L8 4"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle r="2.5" fill="var(--ink)" />
    </g>
  );
}

export function AlarmClock() {
  return (
    <g transform={`translate(${ALARM.x} ${ALARM.y})`}>
      <g data-el="alarm">
        <AlarmClockShape />
      </g>
    </g>
  );
}
