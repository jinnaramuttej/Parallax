/** Blanket over the bed. Drawn above the guy so he sleeps under it. */
export function Blanket() {
  return (
    <g data-el="blanket">
      <path
        d="M196 652C232 630 300 628 344 634C392 640 430 628 464 634L466 716H196Z"
        fill="var(--plant)"
      />
      <g fill="var(--plant-dark)">
        <rect x="256" y="636" width="14" height="80" />
        <rect x="330" y="634" width="14" height="82" />
        <rect x="404" y="634" width="14" height="82" />
      </g>
      <path
        d="M196 652C232 630 300 628 344 634C392 640 430 628 464 634"
        stroke="var(--paper)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}
