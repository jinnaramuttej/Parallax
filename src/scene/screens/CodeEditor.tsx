/**
 * The code editor shown on the main monitor, in the screen's local
 * coordinates. Three snippets; clicking the monitor cycles through them,
 * and the timeline scrolls [data-el="code-scroll-N"] while he types.
 */
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
const TOP = 26;
const LEFT = 24;

function Snippet({ lines, index }: { lines: Line[]; index: number }) {
  // Rendered twice back to back so the scroll can loop seamlessly.
  const block = lines.length * LINE_H + LINE_H;
  return (
    <g data-snippet={index} opacity={index === 0 ? 1 : 0}>
      <g data-el={`code-scroll-${index}`} data-block={block}>
        {[0, 1].map((copy) =>
          lines.map((line, i) => (
            <text key={`${copy}-${i}`} x={LEFT} y={TOP + copy * block + i * LINE_H} fontSize="9" fill="var(--paper)" style={mono}>
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

export function CodeEditor({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect width={w} height={h} fill="var(--screen)" />
      {SNIPPETS.map((lines, i) => (
        <Snippet key={i} lines={lines} index={i} />
      ))}
      <rect width={w} height="14" fill="var(--ink)" />
      <circle cx="9" cy="7" r="2.6" fill="var(--error)" />
      <circle cx="18" cy="7" r="2.6" fill="var(--sun)" />
      <circle cx="27" cy="7" r="2.6" fill="var(--can)" />
      <text x="40" y="10" fontSize="7" fill="var(--wall-shade)" style={mono}>
        day.ts
      </text>
      <rect y="14" width="16" height={h - 14} fill="var(--ink)" opacity="0.6" />
    </g>
  );
}
