const mono = { fontFamily: "var(--font-jetbrains), monospace" };

/** Three wall posters: curly braces, a rocket, and a git graph. */
export function Posters() {
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
        <text
          x="1236"
          y="470"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="var(--paper)"
          style={mono}
        >
          ship it
        </text>
        <circle cx="1236" cy="350" r="5" fill="var(--error)" />
      </g>
    </g>
  );
}
