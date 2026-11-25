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
import { Can, CanStack, DeskCan, type DeskCanState } from "@/scene/props/Cans";
import { Fridge, type FridgeState } from "@/scene/room/Fridge";
import { BeanBag } from "@/scene/room/life/BeanBag";
import { CoffeeShelf } from "@/scene/room/life/CoffeeShelf";
import { Dust } from "@/scene/room/life/Dust";
import { StringLights, StringLightsGlow } from "@/scene/room/life/StringLights";
import { WallClock } from "@/scene/room/life/WallClock";
import { TODO_ITEMS, Whiteboard } from "@/scene/room/life/Whiteboard";
import { Posters, PostersGlow, type ShipPosterState } from "@/scene/room/Posters";
import { CurtainFlare, CurtainTop } from "@/scene/room/Window";
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


      <Section title="Room life">
        <Card title="coffee shelf" viewBox="1330 196 176 96" width={260}>
          <CoffeeShelf />
        </Card>
        <Card title="bean bag" viewBox="1110 680 210 100" width={260}>
          <BeanBag />
        </Card>
        {[0, TODO_ITEMS.length].map((n) => (
          <Card key={n} title={`whiteboard: ${n} ticked`} viewBox="108 140 260 194" width={260}>
            <Whiteboard ticked={n} />
          </Card>
        ))}
        <Card title="curtain (top + swaying flare)" viewBox="396 36 132 540" width={100}>
          <CurtainTop />
          <CurtainFlare />
        </Card>
        {(["todo", "done"] as ShipPosterState[]).map((s) => (
          <Card key={s} title={`poster: ${s}`} viewBox="1166 330 140 156" width={160}>
            <Posters ship={s} />
          </Card>
        ))}
      </Section>

      <Section title="Lit at night (HTML / glow layer)">
        {[359, 1380, 1620].map((m) => (
          <figure key={m} className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card={`clock ${m}`}>
            <div className="relative rounded-lg bg-[var(--wall-shade)]" style={{ width: 120, height: 120 }}>
              <div className="absolute inset-0" style={{ width: 1600 * 1.364, height: 900 * 1.364, left: -1214 * 1.364, top: -120 * 1.364 }}>
                <WallClock minutes={m} />
              </div>
            </div>
            <figcaption className="mt-1 font-mono text-xs">
              clock {Math.floor(m / 60) % 24}:{String(m % 60).padStart(2, "0")}
            </figcaption>
          </figure>
        ))}
        <figure className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card="string lights">
          <div className="relative overflow-hidden rounded-lg bg-[var(--tint-night)]" style={{ width: 640, height: 60 }}>
            <svg viewBox="40 10 1520 70" width={640} height={30} className="absolute left-0 top-0">
              <StringLights />
            </svg>
            <div className="absolute left-0" style={{ top: 30, width: 640, height: 30 }}>
              <svg viewBox="40 10 1520 70" width={640} height={30} className="absolute" style={{ mixBlendMode: "screen" }}>
                <StringLights />
              </svg>
              <div className="absolute" style={{ width: 1600 * 0.421, height: 900 * 0.421, left: -40 * 0.421, top: -10 * 0.421 }}>
                <StringLightsGlow />
              </div>
            </div>
          </div>
          <figcaption className="mt-1 font-mono text-xs">string lights: off (top), on (bottom)</figcaption>
        </figure>
        <figure className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card="posters glow">
          <svg viewBox="80 330 1240 190" width={620} height={95} className="block rounded-lg bg-[var(--tint-night)]">
            <Posters />
          </svg>
          <div className="relative overflow-hidden rounded-lg bg-[var(--sky-night-1)]" style={{ width: 620, height: 95 }}>
            <div className="absolute" style={{ width: 1600 * 0.5, height: 900 * 0.5, left: -80 * 0.5, top: -330 * 0.5 }}>
              <PostersGlow />
            </div>
          </div>
          <figcaption className="mt-1 font-mono text-xs">posters: night glow paint</figcaption>
        </figure>
        <figure className="m-0 rounded-xl bg-[var(--wall)] p-2 text-[var(--ink)]" data-card="dust">
          <div className="relative overflow-hidden rounded-lg" style={{ width: 300, height: 249, background: "var(--sun)", ["--s" as string]: 0.3 }}>
            <Dust seed={11} clip="polygon(0% 0%, 64% 0%, 64% 48.2%, 100% 100%, 38% 100%, 0% 48.2%)" />
          </div>
          <figcaption className="mt-1 font-mono text-xs">dust motes in the morning beam</figcaption>
        </figure>
      </Section>

      <Section title="Cans and fridge">
        <Card title="can (own logo)" viewBox="-6 -4 32 42" width={90}>
          <Can />
        </Card>
        {(["upright", "spill"] as DeskCanState[]).map((s) => (
          <Card key={s} title={`desk can: ${s}`} viewBox="846 556 120 56" width={200}>
            <rect x="846" y="604" width="120" height="10" fill="var(--wood)" />
            <DeskCan state={s} />
          </Card>
        ))}
        <Card title="can stack" viewBox="1190 490 90 120" width={120}>
          <CanStack />
        </Card>
        {(["closed", "open"] as FridgeState[]).map((s) => (
          <Card key={s} title={`fridge: ${s}`} viewBox="1230 280 290 490" width={190}>
            <Fridge state={s} />
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
