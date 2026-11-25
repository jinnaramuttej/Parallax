const hand = { fontFamily: "var(--font-hand), 'Comic Sans MS', cursive" };

/** Today's list. Each item gets a tick as the day gets it done. */
export const TODO_ITEMS = ["coffee", "standup", "fix the bug", "ship it"] as const;

export const WHITEBOARD = { x: 118, y: 150, w: 240, h: 168 };

/**
 * A small whiteboard with a checklist. Ticks are [data-el="todo-tick-N"]
 * groups that the timeline pops in with a scale (transform only).
 * `ticked` sets how many start ticked (for the gallery).
 */
export function Whiteboard({ ticked = 0 }: { ticked?: number }) {
  const { x, y, w, h } = WHITEBOARD;
  return (
    <g data-el="whiteboard">
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="8" fill="var(--wall-shade)" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="var(--paper)" />
      <rect x={x + 40} y={y + h + 4} width={w - 80} height="7" rx="3" fill="var(--wall-shade)" />
      <rect x={x + 54} y={y + h + 1} width="22" height="5" rx="2" fill="var(--error)" />
      <rect x={x + 82} y={y + h + 1} width="22" height="5" rx="2" fill="var(--indigo)" />
      <text x={x + 18} y={y + 30} fontSize="22" fill="var(--indigo)" style={hand}>
        TODAY
      </text>
      <path d={`M${x + 18} ${y + 36}h76`} stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      {TODO_ITEMS.map((item, i) => {
        const cy = y + 58 + i * 28;
        return (
          <g key={item}>
            <rect x={x + 18} y={cy - 9} width="18" height="18" rx="3" fill="none" stroke="var(--ink)" strokeWidth="2.2" />
            <text x={x + 46} y={cy + 6} fontSize="19" fill="var(--ink)" style={hand}>
              {item}
            </text>
            <g transform={`translate(${x + 27} ${cy})`}>
              <g data-el={`todo-tick-${i}`} transform={`scale(${i < ticked ? 1 : 0})`}>
                <path d="M-8 -1L-2 6L11 -11" stroke="var(--can-dark)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </g>
          </g>
        );
      })}
      {/* A tiny cat doodle in the corner. */}
      <g transform={`translate(${x + w - 40} ${y + h - 32})`} stroke="var(--indigo)" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M0 14C0 4 6 0 12 0S24 4 24 14M2 4L4 -4L9 1M22 4L20 -4L15 1" />
        <path d="M8 8h1M15 8h1M12 11v1" />
      </g>
    </g>
  );
}
