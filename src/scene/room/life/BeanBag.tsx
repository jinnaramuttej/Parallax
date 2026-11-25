/** A slouchy bean bag in front of the desk drawers. */
export function BeanBag() {
  return (
    <g data-el="bean-bag">
      <ellipse cx="1214" cy="772" rx="94" ry="8" fill="var(--floor-shade)" />
      <path
        d="M1130 772C1116 742 1130 704 1172 692C1208 682 1262 688 1290 712C1312 732 1308 760 1298 772Z"
        fill="var(--rgb-violet)"
      />
      <path
        d="M1150 744C1176 724 1236 722 1276 742C1262 756 1180 760 1150 744Z"
        fill="var(--indigo)"
        opacity="0.3"
      />
      <path
        d="M1172 694C1190 712 1196 736 1194 770M1250 694C1236 716 1234 744 1240 770"
        stroke="var(--indigo)"
        strokeOpacity="0.35"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}
