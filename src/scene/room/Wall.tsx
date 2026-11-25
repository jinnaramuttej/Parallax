/** Window opening in the wall, in canvas units. The sky layers show through it. */
export const WINDOW = { x: 480, y: 70, w: 640, h: 400 };

/** Wall (with the window cut out), wainscot, floor and rug. */
export function Wall() {
  const { x, y, w, h } = WINDOW;
  return (
    <g>
      <path
        fillRule="evenodd"
        fill="var(--wall)"
        d={`M-700 -500H2300V760H-700Z M${x} ${y}V${y + h}H${x + w}V${y}Z`}
      />
      <rect
        x="-700"
        y="610"
        width="3000"
        height="150"
        fill="var(--wall-shade)"
      />
      <rect
        x="-700"
        y="604"
        width="3000"
        height="8"
        fill="var(--paper)"
        opacity="0.7"
      />
      <rect x="-700" y="760" width="3000" height="700" fill="var(--floor)" />
      <rect x="-700" y="750" width="3000" height="12" fill="var(--paper)" />
      <g fill="var(--floor-shade)">
        <rect x="-700" y="806" width="3000" height="4" />
        <rect x="-700" y="866" width="3000" height="5" />
        <rect x="-700" y="940" width="3000" height="6" />
      </g>
      {/* Rug: flat, wide, in floor perspective; the chair stands on it. */}
      <path d="M470 748H1010L1050 790H430Z" fill="var(--indigo)" />
      <path
        d="M492 753H988L1018 785H462Z"
        fill="none"
        stroke="var(--indigo-dark)"
        strokeWidth="4"
      />
      <path d="M454 769H1026" stroke="var(--indigo-dark)" strokeWidth="3" />
      <path
        d="M466.2 752h-10M460.5 758h-10M454.8 764h-10M449.0 770h-10M443.3 776h-10M437.6 782h-10M431.9 788h-10M1013.8 752h10M1019.5 758h10M1025.2 764h10M1031.0 770h10M1036.7 776h10M1042.4 782h10M1048.1 788h10"
        stroke="var(--indigo-dark)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}
