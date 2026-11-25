/** A small succulent between the notepad and the laptop. */
export function DeskPlant() {
  return (
    <g data-prop="desk-plant">
      <path d="M1047 590C1040 580 1040 570 1046 566C1050 574 1050 582 1048 590Z" fill="var(--plant)" />
      <path d="M1049 590C1054 580 1060 576 1064 578C1062 584 1056 589 1050 591Z" fill="var(--plant-dark)" />
      <path d="M1046 590C1040 584 1033 584 1031 587C1035 591 1041 592 1046 591Z" fill="var(--plant-dark)" />
      <path d="M1037 590H1059L1056 604H1040Z" fill="var(--accent-dark)" />
    </g>
  );
}

/** Cork coaster under the mug. */
export function Coaster() {
  return (
    <g data-prop="coaster">
      <ellipse cx="667" cy="604" rx="20" ry="3" fill="var(--floor)" />
      <ellipse cx="667" cy="603" rx="16" ry="1.8" fill="var(--floor-shade)" />
    </g>
  );
}
