import { StatefulG, type StatefulProps } from "../Stateful";
import { LAPTOP_SCREEN, MAIN_SCREEN, SECOND_SCREEN, SECOND_TILT, type Rect } from "../room/layout";
import { AnimeVideo } from "./AnimeVideo";
import { CodeEditor } from "./CodeEditor";
import { BootState, DeployState, ErrorState, OffState, SuccessState } from "./common";
import { MovieVideo } from "./MovieVideo";

const mono = { fontFamily: "var(--font-jetbrains), monospace" };

export type MainState = "off" | "boot" | "code" | "error" | "deploy" | "success";
export type SecondState = "off" | "boot" | "terminal" | "docs" | "anime" | "movie" | "error" | "deploy" | "success";
export type LaptopState = "off" | "boot" | "chat" | "browser" | "error" | "deploy" | "success";

function Frame({ id, rect, children, transform }: { id: string; rect: Rect; children: React.ReactNode; transform?: string }) {
  return (
    <g transform={transform}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx="2.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <g transform={`translate(${rect.x} ${rect.y})`}>{children}</g>
      </g>
      {/* The screen's visible area, for layout checks (captions keep off it). */}
      <rect data-screen-rect={id} x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill="none" />
    </g>
  );
}

/** Main monitor: code editor, error overlay (red), deploy, deploy success (green). */
export function MainScreen({ state = "off", visible = true }: StatefulProps<MainState>) {
  const { w, h } = MAIN_SCREEN;
  const id = "main";
  return (
    <Frame id={id} rect={MAIN_SCREEN}>
      <StatefulG<MainState>
        id="screen-main"
        state={state}
        visible={visible}
        states={{
          off: <OffState w={w} h={h} id={id} />,
          boot: <BootState w={w} h={h} id={id} />,
          code: <CodeEditor w={w} h={h} />,
          error: <ErrorState w={w} h={h} id={id} big />,
          deploy: <DeployState w={w} h={h} id={id} big />,
          success: <SuccessState w={w} h={h} id={id} big />,
        }}
      />
    </Frame>
  );
}

function Terminal({ w, h }: { w: number; h: number }) {
  const lines = [
    ["$ npm run dev", "var(--paper)"],
    ["  ready in 312ms", "var(--can)"],
    ["GET / 200 14ms", "var(--wall-shade)"],
    ["GET /api/day 200 9ms", "var(--wall-shade)"],
    ["compiled client 0.4s", "var(--window-cool)"],
    ["warn  unused var 'sleep'", "var(--sun)"],
    ["GET / 200 11ms", "var(--wall-shade)"],
    ["test  42 passed", "var(--can)"],
  ];
  return (
    <g>
      <rect width={w} height={h} fill="#0b0c1d" />
      <g data-el="terminal-scroll">
        {[...lines, ...lines].map(([t, c], i) => (
          <text key={i} x="5" y={10 + i * 8.5} fontSize="6" fill={c} style={mono}>
            {t}
          </text>
        ))}
      </g>
    </g>
  );
}

function Docs({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect width={w} height={h} fill="var(--paper)" />
      <rect width={w} height="9" fill="var(--wall-shade)" />
      <rect x="6" y="15" width={w * 0.5} height="6" rx="1" fill="var(--ink)" />
      {[27, 33, 39].map((y) => (
        <rect key={y} x="6" y={y} width={w - 30 + (y % 2) * 12} height="2.6" rx="1" fill="var(--indigo)" opacity="0.4" />
      ))}
      <rect x="6" y="47" width={w - 12} height="22" rx="2" fill="var(--screen)" />
      <rect x="10" y="52" width={w * 0.4} height="2.5" fill="var(--accent)" />
      <rect x="10" y="58" width={w * 0.55} height="2.5" fill="var(--can)" />
      <rect x="10" y="64" width={w * 0.3} height="2.5" fill="var(--window-cool)" />
      <rect x="6" y="74" width={w * 0.6} height="2.6" rx="1" fill="var(--indigo)" opacity="0.4" />
    </g>
  );
}

/**
 * Second monitor: terminal logs, a docs page, and two video players (an
 * original anime scene and a letterboxed movie), plus the shared states.
 */
export function SecondScreen({ state = "off", visible = true }: StatefulProps<SecondState>) {
  const { w, h } = SECOND_SCREEN;
  const id = "second";
  const frame = { x: 0, y: 0, w, h };
  return (
    <Frame id={id} rect={SECOND_SCREEN} transform={SECOND_TILT}>
      <StatefulG<SecondState>
        id="screen-second"
        state={state}
        visible={visible}
        states={{
          off: <OffState w={w} h={h} id={id} />,
          boot: <BootState w={w} h={h} id={id} />,
          terminal: <Terminal w={w} h={h} />,
          docs: <Docs w={w} h={h} />,
          anime: <AnimeVideo idPrefix="anime-small" frame={frame} />,
          movie: <MovieVideo idPrefix="movie-small" frame={frame} />,
          error: <ErrorState w={w} h={h} id={id} />,
          deploy: <DeployState w={w} h={h} id={id} />,
          success: <SuccessState w={w} h={h} id={id} />,
        }}
      />
    </Frame>
  );
}

function Chat({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect width={w} height={h} fill="var(--paper)" />
      <rect width="14" height={h} fill="var(--indigo-dark)" />
      <rect x="18" y="5" width={w * 0.45} height="7" rx="3.5" fill="var(--wall-shade)" />
      <rect x={w - 4 - w * 0.4} y="15" width={w * 0.4} height="7" rx="3.5" fill="var(--accent)" />
      <rect x="18" y="25" width={w * 0.5} height="7" rx="3.5" fill="var(--wall-shade)" />
      <rect x={w - 4 - w * 0.3} y="35" width={w * 0.3} height="7" rx="3.5" fill="var(--accent)" />
      <rect x="18" y={h - 7} width={w - 22} height="4" rx="2" fill="var(--wall-shade)" />
    </g>
  );
}

function Browser({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect width={w} height={h} fill="var(--paper)" />
      <rect width={w} height="8" fill="var(--wall-shade)" />
      <rect x="3" y="2" width="20" height="6" rx="1.5" fill="var(--paper)" />
      <rect x="25" y="2.5" width="16" height="5" rx="1.5" fill="var(--wall)" />
      <rect x="4" y="11" width={w - 8} height="5" rx="2.5" fill="var(--wall)" />
      <rect x="4" y="20" width={w - 8} height="14" rx="2" fill="var(--window-cool)" />
      <rect x="4" y="37" width={w * 0.55} height="3" rx="1" fill="var(--indigo)" opacity="0.5" />
      <rect x="4" y="42" width={w * 0.7} height="3" rx="1" fill="var(--indigo)" opacity="0.5" />
    </g>
  );
}

/** Laptop: a chat window, then a browser tab, plus the shared states. */
export function LaptopScreen({ state = "off", visible = true }: StatefulProps<LaptopState>) {
  const { w, h } = LAPTOP_SCREEN;
  const id = "laptop";
  return (
    <Frame id={id} rect={LAPTOP_SCREEN}>
      <StatefulG<LaptopState>
        id="screen-laptop"
        state={state}
        visible={visible}
        states={{
          off: <OffState w={w} h={h} id={id} />,
          boot: <BootState w={w} h={h} id={id} />,
          chat: <Chat w={w} h={h} />,
          browser: <Browser w={w} h={h} />,
          error: <ErrorState w={w} h={h} id={id} />,
          deploy: <DeployState w={w} h={h} id={id} />,
          success: <SuccessState w={w} h={h} id={id} />,
        }}
      />
    </Frame>
  );
}
