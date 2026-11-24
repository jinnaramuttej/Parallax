/** Sheet anchor points: they start stacked flat on the desk, right of the monitor. */
export const PAPERS = [
  { x: 1014, y: 598 },
  { x: 1018, y: 595 },
  { x: 1012, y: 592 },
];

/** A small stack of printouts. Each sheet is drawn around its centre so it can fly and spin. */
export function Papers() {
  return (
    <g>
      {PAPERS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <g data-paper={i} transform="scale(1 0.12)">
            <rect
              x="-22"
              y="-28"
              width="44"
              height="56"
              rx="2"
              fill="var(--paper)"
            />
            <g fill="var(--indigo)" opacity="0.45">
              <rect x="-15" y="-19" width="30" height="3" rx="1.5" />
              <rect x="-15" y="-11" width="24" height="3" rx="1.5" />
              <rect x="-15" y="-3" width="28" height="3" rx="1.5" />
              <rect x="-15" y="5" width="18" height="3" rx="1.5" />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}
