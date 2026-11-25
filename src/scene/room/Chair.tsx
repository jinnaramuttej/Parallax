/** Office chair, seen from the side. Seat top at y 674; the guy sits at hip (600, 668). */
export function Chair() {
  return (
    <g data-el="chair" fill="var(--indigo-dark)">
      <rect x="542" y="505" width="30" height="172" rx="15" transform="rotate(-7 557 591)" />
      <rect x="556" y="674" width="116" height="15" rx="7.5" />
      <rect x="607" y="689" width="12" height="45" />
      <rect x="566" y="732" width="96" height="9" rx="4.5" />
      <circle cx="572" cy="750" r="8" fill="var(--ink)" />
      <circle cx="656" cy="750" r="8" fill="var(--ink)" />
      <circle cx="613" cy="752" r="8" fill="var(--ink)" />
    </g>
  );
}
