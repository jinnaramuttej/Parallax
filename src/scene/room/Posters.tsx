import { StatefulG } from "../Stateful";

const mono = { fontFamily: "var(--font-jetbrains), monospace" };

export type ShipPosterState = "todo" | "done";

/**
 * Three wall posters: curly braces, a rocket, and a git graph whose caption
 * flips from "ship it" to "shipped" at the deploy (prop "poster-ship").
 * At night their glow-in-the-dark paint shows (PostersGlow, glow layer).
 */
export function Posters({ ship = "todo" }: { ship?: ShipPosterState }) {
  return (
    <g>
      <g transform="rotate(-3 145 435)">
        <rect
          x="90"
          y="360"
          width="110"
          height="150"
          rx="4"
          fill="var(--sun)"
        />
        <text
          x="145"
          y="452"
          textAnchor="middle"
          fontSize="58"
          fontWeight="800"
          fill="var(--ink)"
          style={mono}
        >
          {"{ }"}
        </text>
        <rect
          x="112"
          y="478"
          width="66"
          height="6"
          rx="3"
          fill="var(--ink)"
          opacity="0.6"
        />
        <circle cx="145" cy="370" r="5" fill="var(--error)" />
      </g>

      <g transform="rotate(4 278 435)">
        <rect
          x="228"
          y="384"
          width="100"
          height="104"
          rx="4"
          fill="var(--can)"
        />
        <path
          d="M278 398C296 414 300 440 292 462H264C256 440 260 414 278 398Z"
          fill="var(--paper)"
        />
        <circle cx="278" cy="428" r="8" fill="var(--indigo)" />
        <path
          d="M264 448L250 468H266ZM292 448L306 468H290Z"
          fill="var(--accent)"
        />
        <path d="M268 464H288L278 482Z" fill="var(--sun)" />
        <circle cx="278" cy="392" r="5" fill="var(--error)" />
      </g>

      <g transform="rotate(-2 1236 408)">
        <rect
          x="1176"
          y="340"
          width="120"
          height="136"
          rx="4"
          fill="var(--indigo)"
        />
        <path d="M1206 360V450" stroke="var(--paper)" strokeWidth="5" />
        <path
          d="M1206 382C1250 382 1260 400 1260 426V450"
          stroke="var(--accent)"
          strokeWidth="5"
          fill="none"
        />
        <circle cx="1206" cy="368" r="8" fill="var(--sun)" />
        <circle cx="1206" cy="406" r="8" fill="var(--sun)" />
        <circle cx="1260" cy="426" r="8" fill="var(--accent)" />
        <circle cx="1206" cy="450" r="9" fill="var(--can)" />
        <StatefulG<ShipPosterState>
          id="poster-ship"
          state={ship}
          states={{
            todo: (
              <text x="1236" y="470" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--paper)" style={mono}>
                ship it
              </text>
            ),
            done: (
              <text x="1236" y="470" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--can)" style={mono}>
                shipped ✓
              </text>
            ),
          }}
        />
        <circle cx="1236" cy="350" r="5" fill="var(--error)" />
      </g>
    </g>
  );
}

const STAR = "M0 -6L1.6 -1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6 -1.6Z";

/** Glow-in-the-dark paint on the posters; its layer fades in with --night. */
export function PostersGlow() {
  const star = (x: number, y: number, s = 1) => (
    <path key={`${x}-${y}`} d={STAR} transform={`translate(${x} ${y}) scale(${s})`} fill="var(--can)" />
  );
  return (
    <svg viewBox="0 0 1600 900" aria-hidden>
      <g transform="rotate(-3 145 435)">
        <rect x="90" y="360" width="110" height="150" rx="4" fill="none" stroke="var(--can)" strokeWidth="2.5" opacity="0.7" />
        {star(106, 382, 0.8)}
        {star(186, 496, 0.9)}
      </g>
      <g transform="rotate(4 278 435)">
        {star(244, 400)}
        {star(314, 404, 0.8)}
        {star(246, 472, 0.7)}
        {star(312, 476, 1.1)}
        {star(302, 424, 0.6)}
        <path d="M298 444C290 444 286 438 288 432C290 438 296 440 302 438C301 442 300 444 298 444Z" fill="var(--can)" />
      </g>
      <g transform="rotate(-2 1236 408)" fill="var(--can)">
        <circle cx="1206" cy="368" r="10" opacity="0.6" />
        <circle cx="1206" cy="406" r="10" opacity="0.6" />
        <circle cx="1260" cy="426" r="10" opacity="0.6" />
        <circle cx="1206" cy="450" r="11" opacity="0.8" />
      </g>
    </svg>
  );
}
