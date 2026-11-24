/** Office chair, seen from the side. The character sits at hip (600, 677). */
export function Chair() {
  return (
    <g data-el="chair" fill="var(--indigo-dark)">
      <rect
        x="542"
        y="526"
        width="30"
        height="166"
        rx="15"
        transform="rotate(-7 557 609)"
      />
      <rect x="556" y="690" width="116" height="15" rx="7.5" />
      <rect x="607" y="704" width="12" height="30" />
      <rect x="566" y="732" width="96" height="9" rx="4.5" />
      <circle cx="572" cy="750" r="8" fill="var(--ink)" />
      <circle cx="656" cy="750" r="8" fill="var(--ink)" />
      <circle cx="613" cy="752" r="8" fill="var(--ink)" />
    </g>
  );
}
