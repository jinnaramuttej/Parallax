import { ParallaxLayer } from "@/components/ParallaxLayer";
import { SCREEN } from "../room/MonitorFrame";

const mono = { fontFamily: "var(--font-jetbrains), monospace" };

type Token = [text: string, color?: string];
type Line = Token[];

const K = "var(--accent)"; // keywords
const S = "var(--can)"; // strings
const N = "var(--sun)"; // numbers, values
const C = "var(--window-cool)"; // calls

/** Three snippets; clicking the monitor cycles through them. */
export const SNIPPETS: Line[][] = [
  [
    [
      ["const ", K],
      ["day = "],
      ["new ", K],
      ["Day", C],
      ["("],
      ['"05:59"', S],
      [");"],
    ],
    [["while ", K], ["(day."], ["isAwake", C], ["()) {"]],
    [
      ["  const ", K],
      ["mug = "],
      ["await ", K],
      ["brew", C],
      ["("],
      ['"coffee"', S],
      [");"],
    ],
    [["  focus."], ["on", C], ["();"]],
    [
      ["  for ", K],
      ["("],
      ["const ", K],
      ["task "],
      ["of ", K],
      ["backlog) {"],
    ],
    [["    await ", K], ["ship", C], ["(task);"]],
    [["    commits"], ["++", N], [";"]],
    [["  }"]],
    [["  if ", K], ["(bugs.length) "], ["fix", C], ["(bugs);"]],
    [["}"]],
    [["// TODO: sleep", "var(--wall-shade)"]],
  ],
  [
    [["function ", K], ["deploy", C], ["(env = "], ['"prod"', S], [") {"]],
    [["  run", C], ["("], ['"npm run build"', S], [");"]],
    [["  if ", K], ["(!tests."], ["pass", C], ["()) {"]],
    [["    throw new ", K], ["Error", C], ["("], ['"nope"', S], [");"]],
    [["  }"]],
    [
      ["  return ", K],
      ["push", C],
      ["(env, { force: "],
      ["false", N],
      [" });"],
    ],
    [["}"]],
    [["deploy", C], ["();"]],
    [["// it works on my machine", "var(--wall-shade)"]],
  ],
  [
    [["<"], ["Room", C], [">"]],
    [["  <"], ["Desk ", C], ["lamp="], ['"on"', S], [" />"]],
    [["  <"], ["Monitor ", C], ["code={"], ["vibes", N], ["} />"]],
    [["  <"], ["Fridge ", C], ["cans={"], ["4", N], ["} />"]],
    [["  <"], ["Chair ", C], ["spins "], ["/>"]],
    [["</"], ["Room", C], [">"]],
    [[""]],
    [["export default ", K], ["Room", C], [";"]],
  ],
];

const LINE_H = 11.5;
const TOP = SCREEN.y + 26;
const LEFT = SCREEN.x + 24;

function Snippet({ lines, index }: { lines: Line[]; index: number }) {
  // Rendered twice back to back so the scroll can loop seamlessly.
  const block = lines.length * LINE_H + LINE_H;
  return (
    <g data-snippet={index} opacity={index === 0 ? 1 : 0}>
      <g data-el={`code-scroll-${index}`} data-block={block}>
        {[0, 1].map((copy) =>
          lines.map((line, i) => (
            <text
              key={`${copy}-${i}`}
              x={LEFT}
              y={TOP + copy * block + i * LINE_H}
              fontSize="9"
              fill="var(--paper)"
              style={mono}
            >
              {line.map(([text, color], j) => (
                <tspan key={j} fill={color}>
                  {text}
                </tspan>
              ))}
            </text>
          )),
        )}
      </g>
    </g>
  );
}

/**
 * Monitor screen content, clipped to the screen area: off, code (three
 * snippets), build error, deploy progress, deploy success.
 */
export function MonitorScreen() {
  const { x, y, w, h } = SCREEN;
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <defs>
          <clipPath id="screen-clip">
            <rect x={x} y={y} width={w} height={h} rx="3" />
          </clipPath>
        </defs>
        <g clipPath="url(#screen-clip)" data-el="screen" data-hit="monitor">
          <rect x={x} y={y} width={w} height={h} fill="var(--screen)" />

          <g data-el="screen-code" opacity="0">
            {SNIPPETS.map((lines, i) => (
              <Snippet key={i} lines={lines} index={i} />
            ))}
            <rect x={x} y={y} width={w} height="14" fill="var(--ink)" />
            <circle cx={x + 9} cy={y + 7} r="2.6" fill="var(--error)" />
            <circle cx={x + 18} cy={y + 7} r="2.6" fill="var(--sun)" />
            <circle cx={x + 27} cy={y + 7} r="2.6" fill="var(--can)" />
            <text
              x={x + 40}
              y={y + 10}
              fontSize="7"
              fill="var(--wall-shade)"
              style={mono}
            >
              day.ts
            </text>
            <rect
              x={x}
              y={y + 14}
              width="16"
              height={h - 14}
              fill="var(--ink)"
              opacity="0.6"
            />
          </g>

          <g data-el="screen-error" opacity="0">
            <rect x={x} y={y} width={w} height={h} fill="var(--error)" />
            <circle cx={x + 34} cy={y + 46} r="16" fill="var(--paper)" />
            <path
              d={`M${x + 27} ${y + 39}l14 14m0 -14l-14 14`}
              stroke="var(--error)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text
              x={x + 60}
              y={y + 44}
              fontSize="15"
              fontWeight="800"
              fill="var(--paper)"
              style={mono}
            >
              Build failed
            </text>
            <text
              x={x + 60}
              y={y + 58}
              fontSize="8"
              fill="var(--paper)"
              style={mono}
            >
              exit code 1
            </text>
            <text
              x={x + 16}
              y={y + 90}
              fontSize="8.5"
              fill="var(--paper)"
              style={mono}
            >
              TypeError: cannot read
            </text>
            <text
              x={x + 16}
              y={y + 102}
              fontSize="8.5"
              fill="var(--paper)"
              style={mono}
            >
              {`properties of undefined ('prod')`}
            </text>
            <text
              x={x + 16}
              y={y + 120}
              fontSize="8"
              fill="var(--paper)"
              opacity="0.7"
              style={mono}
            >
              at deploy (day.ts:42:7)
            </text>
          </g>

          <g data-el="screen-deploy" opacity="0">
            <text
              x={x + 16}
              y={y + 34}
              fontSize="10"
              fill="var(--can)"
              style={mono}
            >
              $ ship --prod
            </text>
            <text
              x={x + 16}
              y={y + 58}
              fontSize="9"
              fill="var(--paper)"
              style={mono}
            >
              Building... Uploading...
            </text>
            <rect
              x={x + 16}
              y={y + 76}
              width={w - 32}
              height="12"
              rx="6"
              fill="var(--ink)"
            />
            <g transform={`translate(${x + 16} ${y + 76})`}>
              <rect
                data-el="deploy-bar"
                width={w - 32}
                height="12"
                rx="6"
                fill="var(--can)"
                transform="scale(0.02 1)"
              />
            </g>
            <text
              x={x + 16}
              y={y + 110}
              fontSize="8"
              fill="var(--wall-shade)"
              style={mono}
            >
              3 regions, 0 errors
            </text>
          </g>

          <g data-el="screen-success" opacity="0">
            <rect x={x} y={y} width={w} height={h} fill="var(--can)" />
            <circle cx={x + w / 2} cy={y + 52} r="24" fill="var(--paper)" />
            <path
              d={`M${x + w / 2 - 11} ${y + 52}l8 8l15 -16`}
              stroke="var(--can-dark)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              x={x + w / 2}
              y={y + 100}
              textAnchor="middle"
              fontSize="16"
              fontWeight="800"
              fill="var(--ink)"
              style={mono}
            >
              Deployed
            </text>
            <text
              x={x + w / 2}
              y={y + 116}
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--ink)"
              style={mono}
            >
              live in production
            </text>
          </g>

          <path
            d={`M${x + w - 70} ${y}h40l-${70} ${h}h-40z`}
            fill="var(--paper)"
            opacity="0.05"
          />
        </g>
      </svg>
    </ParallaxLayer>
  );
}
