import { StatefulG, type StatefulProps } from "../../Stateful";
import { KEYBOARD } from "../layout";

export const RGB_STATES = ["off", "cyan", "violet", "green", "red", "gold", "rainbow"] as const;
export type RgbState = (typeof RGB_STATES)[number];

const COLORS: Record<Exclude<RgbState, "off" | "rainbow">, string> = {
  cyan: "var(--window-cool)",
  violet: "var(--rgb-violet)",
  green: "var(--can)",
  red: "var(--error)",
  gold: "var(--sun)",
};

/**
 * The keyboard's RGB underglow: a thin strip plus a soft halo. Lives in the
 * glow layer (screen blend) so it reads at night. One state per colour; the
 * choreography picks a colour per act.
 */
export function RgbStrip({ state = "cyan", visible = true }: StatefulProps<RgbState>) {
  const { x, y, w, h } = KEYBOARD;
  const strip = (fill: string) => (
    <>
      <rect x={x - 6} y={y + h - 6} width={w + 12} height="14" rx="7" fill={fill} opacity="0.35" filter="url(#rgb-blur)" />
      <rect x={x + 1} y={y + h - 2.5} width={w - 2} height="2.5" rx="1.2" fill={fill} />
    </>
  );
  return (
    <svg viewBox="0 0 1600 900" aria-hidden>
      <defs>
        <filter id="rgb-blur" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <linearGradient id="rgb-rainbow" x1="0" x2="1">
          <stop offset="0" stopColor="var(--error)" />
          <stop offset="0.25" stopColor="var(--sun)" />
          <stop offset="0.5" stopColor="var(--can)" />
          <stop offset="0.75" stopColor="var(--window-cool)" />
          <stop offset="1" stopColor="var(--rgb-violet)" />
        </linearGradient>
      </defs>
      <StatefulG<RgbState>
        id="rgb"
        state={state}
        visible={visible}
        states={{
          off: null,
          cyan: strip(COLORS.cyan),
          violet: strip(COLORS.violet),
          green: strip(COLORS.green),
          red: strip(COLORS.red),
          gold: strip(COLORS.gold),
          rainbow: strip("url(#rgb-rainbow)"),
        }}
      />
    </svg>
  );
}
