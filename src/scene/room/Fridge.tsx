/** Hinge of the main door (right edge). The door opens by flipping scaleX here. */
export const FRIDGE_HINGE = { x: 1502, y: 632 };

function SmallCan({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="16" height="28" rx="4" fill="var(--can)" />
      <rect
        x={x + 1}
        y={y - 2}
        width="14"
        height="4"
        rx="2"
        fill="var(--can-dark)"
      />
    </g>
  );
}

/** Fridge with a working main door, its lit interior, and a plant on top. */
export function Fridge() {
  return (
    <g>
      <rect
        x="1330"
        y="380"
        width="172"
        height="380"
        rx="14"
        fill="var(--paper)"
      />
      <rect
        x="1342"
        y="512"
        width="148"
        height="238"
        rx="6"
        fill="var(--fridge-inside)"
      />
      <g fill="var(--wall-shade)">
        <rect x="1342" y="584" width="148" height="5" />
        <rect x="1342" y="660" width="148" height="5" />
      </g>
      <SmallCan x={1352} y={554} />
      <SmallCan x={1372} y={554} />
      <SmallCan x={1392} y={554} />
      <rect
        x="1430"
        y="534"
        width="32"
        height="48"
        rx="4"
        fill="var(--window-cool)"
      />
      <path d="M1430 534L1446 520L1462 534Z" fill="var(--window-cool)" />
      <rect
        x="1360"
        y="618"
        width="20"
        height="40"
        rx="8"
        fill="var(--error)"
      />
      <rect x="1400" y="628" width="60" height="30" rx="8" fill="var(--sun)" />

      <rect
        x="1330"
        y="380"
        width="172"
        height="122"
        rx="14"
        fill="var(--paper)"
      />
      <rect x="1330" y="498" width="172" height="6" fill="var(--wall-shade)" />
      <rect
        x="1340"
        y="424"
        width="8"
        height="52"
        rx="4"
        fill="var(--wall-shade)"
      />
      <rect
        x="1490"
        y="392"
        width="8"
        height="356"
        rx="4"
        fill="var(--wall-shade)"
        opacity="0.6"
      />

      <g data-el="fridge-door">
        <rect
          x="1330"
          y="504"
          width="172"
          height="256"
          rx="14"
          fill="var(--paper)"
        />
        <rect
          x="1340"
          y="522"
          width="8"
          height="84"
          rx="4"
          fill="var(--wall-shade)"
        />
        <circle cx="1404" cy="540" r="7" fill="var(--error)" />
        <circle cx="1462" cy="556" r="7" fill="var(--can)" />
        <g transform="rotate(5 1440 622)">
          <rect
            x="1414"
            y="598"
            width="52"
            height="48"
            rx="2"
            fill="var(--sun)"
          />
          <rect
            x="1422"
            y="610"
            width="34"
            height="4"
            rx="2"
            fill="var(--ink)"
            opacity="0.5"
          />
          <rect
            x="1422"
            y="620"
            width="26"
            height="4"
            rx="2"
            fill="var(--ink)"
            opacity="0.5"
          />
        </g>
      </g>
      <rect x="1340" y="756" width="20" height="6" fill="var(--ink)" />
      <rect x="1472" y="756" width="20" height="6" fill="var(--ink)" />

      <g>
        <path
          d="M1382 344C1362 320 1360 300 1372 292C1384 304 1388 322 1386 344Z"
          fill="var(--plant)"
        />
        <path
          d="M1384 344C1396 312 1414 304 1424 308C1420 324 1404 338 1388 346Z"
          fill="var(--plant-dark)"
        />
        <path
          d="M1382 344C1370 330 1350 326 1342 332C1352 344 1366 348 1380 348Z"
          fill="var(--plant-dark)"
        />
        <rect
          x="1360"
          y="342"
          width="48"
          height="38"
          rx="6"
          fill="var(--accent-dark)"
        />
      </g>
    </g>
  );
}
