/** Coffee corner: a wall shelf over the fridge with a drip machine, a bean jar and two mugs. */
export function CoffeeShelf() {
  return (
    <g data-el="coffee-shelf">
      <path d="M1352 270H1366L1356 288ZM1484 270H1470L1480 288Z" fill="var(--wood-dark)" />
      <rect x="1336" y="262" width="164" height="9" rx="3" fill="var(--wood)" />

      {/* Drip machine with a half-full carafe. */}
      <rect x="1346" y="204" width="38" height="58" rx="6" fill="var(--indigo-dark)" />
      <rect x="1346" y="204" width="38" height="14" rx="6" fill="var(--indigo)" />
      <circle cx="1376" cy="211" r="2.6" fill="var(--error)" />
      <rect x="1352" y="234" width="26" height="25" rx="5" fill="var(--window-cool)" opacity="0.85" />
      <rect x="1352" y="246" width="26" height="13" rx="4" fill="var(--wood-dark)" />
      <path d="M1378 238h4a3 3 0 0 1 0 12h-4" stroke="var(--window-cool)" strokeWidth="2.5" fill="none" />

      {/* Bean jar. */}
      <rect x="1394" y="226" width="28" height="36" rx="6" fill="var(--paper)" opacity="0.92" />
      <rect x="1392" y="220" width="32" height="9" rx="3" fill="var(--wood)" />
      <g fill="var(--wood-dark)">
        <ellipse cx="1402" cy="252" rx="3" ry="2" />
        <ellipse cx="1410" cy="256" rx="3" ry="2" />
        <ellipse cx="1415" cy="248" rx="3" ry="2" />
        <ellipse cx="1404" cy="243" rx="3" ry="2" />
        <ellipse cx="1412" cy="238" rx="3" ry="2" />
        <ellipse cx="1400" cy="257" rx="3" ry="2" />
      </g>

      {/* Two mugs. */}
      <rect x="1432" y="240" width="22" height="22" rx="4" fill="var(--sun)" />
      <path d="M1454 245h3a4 4 0 0 1 0 10h-3" stroke="var(--sun)" strokeWidth="3" fill="none" />
      <rect x="1464" y="236" width="22" height="26" rx="4" fill="var(--accent)" />
      <path d="M1486 242h3a4 4 0 0 1 0 12h-3" stroke="var(--accent)" strokeWidth="3" fill="none" />
      <path d="M1470 248h10" stroke="var(--paper)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}
