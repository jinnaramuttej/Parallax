import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CatRig } from "@/scene/character/Cat";
import { CAT_POSES, type CatPoseName } from "@/scene/character/catPoses";
import { DeskMug, MugShape, type MugState } from "@/scene/props/Mug";
import { Desk } from "@/scene/room/Desk";
import { DeskMat } from "@/scene/room/desk/DeskMat";
import { Coaster, DeskPlant } from "@/scene/room/desk/DeskPlant";
import { HeadphoneStand } from "@/scene/room/desk/HeadphoneStand";
import { Keyboard } from "@/scene/room/desk/Keyboard";
import { Laptop } from "@/scene/room/desk/Laptop";
import { Mouse } from "@/scene/room/desk/Mouse";
import { Notepad, StickyNotes } from "@/scene/room/desk/Notepad";
import { RGB_STATES, RgbStrip } from "@/scene/room/desk/RgbStrip";
import { SecondMonitor } from "@/scene/room/desk/SecondMonitor";
import { LAPTOP_BEZEL_VIEW, MAIN_VIEW, SECOND_VIEW } from "@/scene/room/layout";
import { MonitorFrame } from "@/scene/room/MonitorFrame";
import {
  LaptopScreen,
  MainScreen,
  SecondScreen,
  type LaptopState,
  type MainState,
  type SecondState,
} from "@/scene/screens/Screens";
import { AnimeVideo } from "@/scene/screens/AnimeVideo";
import { MovieVideo } from "@/scene/screens/MovieVideo";

export const metadata: Metadata = {
  title: "Prop gallery",
  robots: { index: false, follow: false },
};

function Card({ title, viewBox, width = 300, children }: { title: string; viewBox: string; width?: number; children: ReactNode }) {
  const [, , vw, vh] = viewBox.split(" ").map(Number);
  return (
    <figure className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card={title}>
      <svg viewBox={viewBox} width={width} height={(width * vh) / vw} className="block rounded-lg bg-[var(--wall-shade)]">
        {children}
      </svg>
      <figcaption className="mt-1 font-mono text-xs">{title}</figcaption>
    </figure>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

/** Desk with everything on it, so screens and props are seen in place. */
function DeskSet({ children }: { children?: ReactNode }) {
  return (
    <>
      <Desk />
      <SecondMonitor />
      <MonitorFrame />
      <StickyNotes />
      <DeskMat />
      <Keyboard />
      <Mouse />
      <Coaster />
      <DeskMug />
      <Notepad />
      <DeskPlant />
      <Laptop />
      <HeadphoneStand />
      {children}
    </>
  );
}

const MAIN: MainState[] = ["off", "boot", "code", "error", "deploy", "success"];
const SECOND: SecondState[] = ["off", "boot", "terminal", "docs", "anime", "movie", "error", "deploy", "success"];
const LAPTOP: LaptopState[] = ["off", "boot", "chat", "browser", "error", "deploy", "success"];

/**
 * Every prop and every state, for screenshots (scripts/gallery.mjs).
 * Development only.
 */
export default function Gallery() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="min-h-screen bg-[var(--ink)] p-6 text-[var(--paper)]">
      <h1 className="mb-6 text-3xl font-bold">Prop gallery</h1>

      <Section title="Desk setup">
        <Card title="desk (all props)" viewBox="600 420 680 200" width={680}>
          <DeskSet />
        </Card>
      </Section>

      <Section title="Main monitor">
        {MAIN.map((s) => (
          <Card key={s} title={`main: ${s}`} viewBox={MAIN_VIEW}>
            <MonitorFrame />
            <MainScreen state={s} />
          </Card>
        ))}
      </Section>

      <Section title="Second monitor">
        {SECOND.map((s) => (
          <Card key={s} title={`second: ${s}`} viewBox={SECOND_VIEW} width={220}>
            <SecondMonitor />
            <SecondScreen state={s} />
          </Card>
        ))}
      </Section>

      <Section title="Laptop">
        {LAPTOP.map((s) => (
          <Card key={s} title={`laptop: ${s}`} viewBox={LAPTOP_BEZEL_VIEW} width={180}>
            <Laptop />
            <LaptopScreen state={s} />
          </Card>
        ))}
      </Section>

      <Section title="Video players (large)">
        <Card title="anime (original)" viewBox="0 0 160 90" width={480}>
          <AnimeVideo idPrefix="anime-gallery" frame={{ x: 0, y: 0, w: 160, h: 90 }} />
        </Card>
        <Card title="movie" viewBox="0 0 160 90" width={480}>
          <MovieVideo idPrefix="movie-gallery" frame={{ x: 0, y: 0, w: 160, h: 90 }} />
        </Card>
      </Section>

      <Section title="Cat poses">
        {(Object.keys(CAT_POSES) as CatPoseName[]).map((pose) => (
          <Card key={pose} title={`cat: ${pose}`} viewBox="-60 -72 120 82" width={200}>
            <rect x="-60" y="0" width="120" height="10" fill="var(--floor)" />
            <CatRig which={`gallery-${pose}`} pose={pose} />
          </Card>
        ))}
      </Section>

      <Section title="Mug, headphones">
        {(["filled", "empty"] as MugState[]).map((s) => (
          <Card key={s} title={`mug: ${s}`} viewBox="-30 -40 60 50" width={140}>
            <MugShape id={`gallery-mug-${s}`} state={s} />
          </Card>
        ))}
        <Card title="desk mug (filled)" viewBox="620 550 70 50" width={140}>
          <DeskMug />
        </Card>
        {(["onStand", "empty"] as const).map((s) => (
          <Card key={s} title={`headphones: ${s}`} viewBox="1150 500 110 110" width={160}>
            <HeadphoneStand state={s} />
          </Card>
        ))}
      </Section>

      <Section title="Keyboard RGB">
        {RGB_STATES.map((s) => (
          <figure key={s} className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card={`rgb: ${s}`}>
            <div className="relative overflow-hidden rounded-lg bg-[var(--screen)]" style={{ width: 280, height: 100 }}>
              <svg viewBox="680 560 140 50" width={280} height={100} className="absolute inset-0">
                <Keyboard />
              </svg>
              <div className="absolute" style={{ width: 3200, height: 1800, left: -1360, top: -1120, mixBlendMode: "screen" }}>
                <RgbStrip state={s} />
              </div>
            </div>
            <figcaption className="mt-1 font-mono text-xs">rgb: {s}</figcaption>
          </figure>
        ))}
      </Section>
    </main>
  );
}
