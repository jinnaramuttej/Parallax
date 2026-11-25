@AGENTS.md

# 24 Hours of a Dev

Scroll-driven parallax site. Scroll position = time of day, from 5:59 AM to 3 AM.
Flat-vector inline SVG art. Layers, back to front: sky, skyline, room, foreground, each at its own speed.

## Stops

0. 5:59 AM: alarm
1. 6–9 AM: wake up + coffee
2. 1 PM: deep focus
3. 6 PM: golden hour + bug
4. 11 PM: fridge run + moon
5. 3 AM: deploy + confetti + stats finale

## Rules

1. Animate only `transform` and `opacity`. No layout-triggering properties (top, left, width, height, margin, padding, etc.). Colour changes are opacity crossfades of stacked layers.
2. Small commits, one working piece at a time.
3. Check GSAP and Lenis docs with Context7 before writing code that uses them.
4. Every scene layer is a `<ParallaxLayer speed={...}>`.
5. Respect `prefers-reduced-motion`.
6. No external image dependencies: all art is inline SVG or CSS.
7. One small, cohesive palette, defined once as CSS variables in `src/app/globals.css`.
8. After scene changes, screenshot every stop with Playwright (desktop and mobile) and fix layout bugs before committing.
9. Keep the Vercel deployment live; redeploy after meaningful changes.

## Stack

- Next.js 16 App Router + TypeScript + Tailwind v4, code in `src/`. Cache Components is on (scaffold default).
- GSAP + ScrollTrigger + SplitText, registered once in `@/lib/gsap`. Import them only from there.
- Lenis: `src/components/SmoothScroll.tsx` drives Lenis from `gsap.ticker` and calls `ScrollTrigger.update` on every Lenis scroll. `useLenis()` gives the instance for `scrollTo`.
- Also installed, unused: `motion`, `@rive-app/react-canvas`, `@lottiefiles/dotlottie-react`, `animejs`, `@theatre/core`, `@theatre/studio`. Keep `@theatre/studio` out of production bundles.

## Director model (config is the source of truth)

- `src/config/timeMap.ts`: TIME MAP, `[progress, "HH:MM"]` keys with monotone cubic easing. `timeAt(progress)` is the only clock: HUD, sky, sun/moon, skyline windows, room light and clouds all read it, never raw scroll. Dependency-free so Node scripts can import it.
- `src/config/acts.ts`: the seven acts (5:59, 6:00 wake, 7:00 desk, 1 PM, 6 PM, 11 PM, 3 AM): start/end progress, chip anchor, clock range, linger span, camera (shot, focus, arrive window), voice/caption/sfx ids, counter events; plus `MOMENTS` (deploy success, fridge door). Acts start on time-map keys, so chips land on their label's time. Scroll, HUD chips and counters, camera, captions, confetti and fridge clicks read it; autoplay and audio should too.
- `src/config/shots.ts`: camera shot presets (wide, pushIn, whipPan, orbit, split). New camera moves are config edits.
- `src/config/captions.ts`: sticky-note copy by caption id.
- `src/config/scroll.ts`: scroll to day progress. Track is `SCROLL_VH` (1100) + 100 = 1200vh. Inside each act's linger span the day advances `LINGER`x slower (smooth ramps); every act must get at least `MIN_ACT_VH` of scroll.

## Scene engine

- `src/scene/Scene.tsx`: tall scroll track with a sticky full-viewport stage; exposes `window.__director` (read-only) for scripts.
- `src/scene/timeline/master.ts`: the single master timeline. Its time axis is day progress (duration 1), it is paused and driven by a ScrollTrigger through `scroll.ts`. `dayStore` holds progress.
- `src/scene/timeline/acts/<act>.ts`: choreography per act, positioned in progress. `cameraDirector.ts` builds camera tweens from config. Small durations use `U` (1/15) from `fx.ts`.
- `<Camera>` (`src/scene/Camera.tsx`) wraps every layer and carries the room-plane framing (pan, zoom, tilt). `<ParallaxLayer speed>` layers off the room plane get only a depth residual (`timeline/camera.ts`); 0 = fixed sky, 1 = room plane, >1 = foreground. Outside the stage, ParallaxLayer is a plain scroll-speed layer.
- Scene art uses a 1600x900 design canvas. `.scene-canvas` sizes it from `--s` (set in `src/scene/viewport.ts`); children use `box(x, y, w, h)` in canvas units.
- SVG joints and props are tweened through their `transform` attribute (`rotate()`/`translate()` strings), not GSAP `svgOrigin` (that is in global SVG coordinates). `gsap.quickSetter` does not support the `scale` shorthand: set `scaleX` and `scaleY`.

## Gotchas

- Dev server: edits to `globals.css` are sometimes not hot-reloaded (stale stylesheet, no error). Restart the dev server after CSS changes before judging screenshots.
- Scripts read `URL` (the dev server runs on :3000).

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Dev server for the preview pane: `.claude/launch.json` (`next-dev`)
- Checks (Playwright on the installed Chrome): `node scripts/verify-time.mjs --step 2` (clock vs time map, act starts, chip jumps), `node scripts/shoot.mjs --mode stops|percent [--viewport mobile] [--reduce]`, `scripts/strip.mjs` (filmstrip), `scripts/audit-layout.mjs`, `scripts/motion.mjs`, `scripts/perf.mjs [--dpr 2]`, `scripts/sync.mjs`, `scripts/net.mjs`. `bash scripts/serve-prod.sh` serves a production build on :3100 for perf runs.
- Deploy: `npx vercel deploy --prod` (folder is linked to Vercel project `parallax`; no Git integration yet)
- Live: https://parallax-three-chi.vercel.app
