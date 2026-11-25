import { StatefulG, type StatefulProps } from "../Stateful";

/**
 * The real coffee mug. The same drawing is used on the desk and in his
 * hand, with the handle at the origin and the body to its right, so the
 * swap between the two is seamless when his hand is on the handle.
 * States: filled (coffee inside) and empty. Steam is DeskSteam (HTML).
 */
export const DESK_MUG_HANDLE = { x: 652, y: 592 };
export type MugState = "filled" | "empty";

function MugBody() {
  return (
    <g>
      <path d="M4 -6C-6 -6 -6 6 4 6" stroke="var(--paper)" strokeWidth="4" fill="none" />
      <rect x="4" y="-12" width="22" height="24" rx="4" fill="var(--paper)" />
      <rect x="4" y="-4" width="22" height="5" fill="var(--accent)" />
    </g>
  );
}

export function MugShape({ id = "mug", state = "filled" }: { id?: string } & StatefulProps<MugState>) {
  return (
    <g>
      <MugBody />
      <StatefulG<MugState>
        id={id}
        state={state}
        states={{
          filled: <ellipse cx="15" cy="-12" rx="11" ry="2.5" fill="var(--wood-dark)" />,
          empty: <ellipse cx="15" cy="-12" rx="11" ry="2.5" fill="var(--wall-shade)" />,
        }}
      />
    </g>
  );
}

/** The mug standing on the desk (room plane, behind his near arm). */
export function DeskMug({ state = "filled", visible = true }: StatefulProps<MugState>) {
  return (
    <g transform={`translate(${DESK_MUG_HANDLE.x} ${DESK_MUG_HANDLE.y})`}>
      <g data-el="desk-mug" opacity={visible ? 1 : 0}>
        <MugShape id="mug-desk" state={state} />
      </g>
    </g>
  );
}
