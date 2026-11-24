/** Desk, drawers, keyboard and mouse. The monitor is its own component. */
export function Desk() {
  return (
    <g>
      <rect x="645" y="620" width="14" height="140" fill="var(--wood-dark)" />
      <rect
        x="1040"
        y="620"
        width="132"
        height="140"
        rx="4"
        fill="var(--wood)"
      />
      <g fill="var(--wood-dark)">
        <rect x="1050" y="634" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1050" y="676" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1050" y="718" width="112" height="34" rx="4" opacity="0.45" />
        <rect x="1092" y="648" width="28" height="6" rx="3" />
        <rect x="1092" y="690" width="28" height="6" rx="3" />
        <rect x="1092" y="732" width="28" height="6" rx="3" />
      </g>
      <rect x="636" y="604" width="548" height="18" rx="5" fill="var(--wood)" />
      <rect
        x="636"
        y="618"
        width="548"
        height="6"
        rx="3"
        fill="var(--wood-dark)"
      />
      <rect
        x="682"
        y="594"
        width="110"
        height="11"
        rx="4"
        fill="var(--indigo-dark)"
      />
      <path
        d="M690 598h94M690 601.5h94"
        stroke="var(--paper)"
        strokeWidth="1.6"
        strokeDasharray="5 3"
        opacity="0.5"
      />
      <ellipse cx="810" cy="600" rx="10" ry="5.5" fill="var(--indigo-dark)" />
    </g>
  );
}
