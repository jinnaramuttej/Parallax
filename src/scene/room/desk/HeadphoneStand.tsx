import { StatefulG, type StatefulProps } from "../../Stateful";

export type HeadphoneStandState = "onStand" | "empty";

/** The headphones themselves (also used for the pair flying off his head). */
export function HeadphonesShape() {
  return (
    <g>
      <path d="M-15 10C-15 -10 15 -10 15 10" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="-19" y="6" width="9" height="16" rx="4" fill="var(--accent-dark)" />
      <rect x="10" y="6" width="9" height="16" rx="4" fill="var(--accent-dark)" />
    </g>
  );
}

/** Headphone stand with its cable running to the laptop. */
export function HeadphoneStand({ state = "onStand", visible = true }: StatefulProps<HeadphoneStandState>) {
  return (
    <g data-prop="headphone-stand-base" opacity={visible ? 1 : 0}>
      <ellipse cx="1178" cy="603" rx="13" ry="3" fill="var(--ink)" />
      <rect x="1176" y="550" width="4" height="53" rx="2" fill="var(--ink)" />
      <path d="M1170 550H1186" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      <StatefulG<HeadphoneStandState>
        id="headphones-stand"
        state={state}
        states={{
          onStand: (
            <g>
              <path
                d="M1191 572C1198 586 1196 598 1186 601C1176 604 1164 603 1152 602"
                stroke="var(--ink)"
                strokeWidth="1.6"
                fill="none"
              />
              <g transform="translate(1178 546)">
                <HeadphonesShape />
              </g>
            </g>
          ),
          empty: (
            <path
              d="M1158 603C1170 604 1182 603 1190 598"
              stroke="var(--ink)"
              strokeWidth="1.6"
              fill="none"
            />
          ),
        }}
      />
    </g>
  );
}
