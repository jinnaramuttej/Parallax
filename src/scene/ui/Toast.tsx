/**
 * Desktop notification that interrupts the break ("standup in 2 min").
 * The timeline slides it in and out (transform and opacity only).
 */
export function Toast() {
  return (
    <div className="toast" data-el="standup-toast" role="status" aria-live="polite" style={{ opacity: 0 }}>
      <span className="toast-icon" aria-hidden>
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="3" fill="var(--paper)" />
          <rect x="3" y="5" width="18" height="5" rx="2" fill="var(--error)" />
          <path d="M8 3v4M16 3v4" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 14h8M8 17h5" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="toast-text">
        <strong>Standup in 2 min</strong>
        <span>Calendar · now</span>
      </span>
    </div>
  );
}
