/** Wall shelf (the alarm clock sits on it) and the bed. Blanket is a prop. */
export function Bed() {
  return (
    <g>
      <rect
        x="66"
        y="544"
        width="180"
        height="10"
        rx="3"
        fill="var(--wood-dark)"
      />
      <path
        d="M86 554V572H96L106 554ZM226 554V572H216L206 554Z"
        fill="var(--wood-dark)"
      />
      <rect
        x="182"
        y="500"
        width="14"
        height="44"
        rx="2"
        fill="var(--accent)"
      />
      <rect
        x="198"
        y="506"
        width="12"
        height="38"
        rx="2"
        fill="var(--indigo)"
      />
      <rect
        x="212"
        y="512"
        width="16"
        height="32"
        rx="2"
        fill="var(--can-dark)"
        transform="rotate(8 220 528)"
      />

      <rect x="38" y="560" width="36" height="200" rx="10" fill="var(--wood)" />
      <rect x="456" y="640" width="26" height="120" rx="9" fill="var(--wood)" />
      <rect x="62" y="712" width="404" height="30" rx="6" fill="var(--wood)" />
      <rect x="72" y="742" width="14" height="18" fill="var(--wood-dark)" />
      <rect x="440" y="742" width="14" height="18" fill="var(--wood-dark)" />
      <rect
        x="70"
        y="674"
        width="392"
        height="42"
        rx="14"
        fill="var(--paper)"
      />
      <rect
        x="70"
        y="704"
        width="392"
        height="12"
        rx="6"
        fill="var(--wall-shade)"
      />
      <ellipse cx="128" cy="668" rx="54" ry="17" fill="var(--paper)" />
      <path
        d="M80 676C100 684 150 686 178 676"
        stroke="var(--wall-shade)"
        strokeWidth="4"
        fill="none"
      />
    </g>
  );
}
