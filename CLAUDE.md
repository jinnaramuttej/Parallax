@AGENTS.md

# 24 Hours of a Dev

Scroll-driven (or autoplayed) parallax comic. Scroll position = time of day, from 5:59 AM to 3 AM.
Flat-vector inline SVG art. Layers, back to front: sky, skyline, room, foreground, each at its own speed.
A dev and his cat; comic captions; voice lines in speech balloons; synthesised sound.

## Acts (src/config/acts.ts)

0. 5:59 dark (cat asleep) · 1. 6:00 alarm (cat startles) · 2. 6:20 coffee (walk, sip) ·
3. 7 AM boot (screens boot, close-up tour) · 4. 10 AM focus · 5. 12:30 break (the anime push-in,
standup ping, whip pan; never call it anything else) · 6. 3 PM multitask (movie on the second screen) ·
7. 6 PM bug (cat on the keyboard, error flood, fix) · 8. 11 PM fridge · 9. 3 AM deploy (cat on his
shoulder, confetti, stats finale). Boot, break, multitask and bug get at least 120vh of scroll.

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
- `src/config/acts.ts`: the ten acts: start/end progress, chip label and anchor, clock range, linger span, camera (shot, focus, arrive window, `moves` beats incl. whip pans), voice line id, counter events; plus `MOMENTS` (deploy success, fridge door, standup ping). Acts start on time-map keys, so chips land on their label's time. Scroll, HUD chips and counters, camera, captions, audio, autoplay, confetti and fridge clicks read it.
- `src/config/shots.ts`: camera shot presets (wide, follow, pushIn, whipPan, orbit, split). New camera moves are config edits.
- `src/config/captions.ts`: comic captions (impact words, boxes, balloons): text, type, zones, tilt, size, enter/exit, entrance. Safe zones per act.
- `src/config/voice.ts`: voice lines (text, `/audio/voice/<id>.mp3`, balloon id, trigger). `src/config/sfx.ts`: synth sound cues, hum span, typing spans.
- `src/config/scroll.ts`: scroll to day progress. Track is `SCROLL_VH` (1300) + 100 = 1400vh. Inside each act's linger span the day advances `LINGER`x slower (smooth ramps); every act must get at least `MIN_ACT_VH` of scroll.

## Scene engine

- `src/scene/Scene.tsx`: tall scroll track with a sticky full-viewport stage; exposes `window.__director` (read-only) for scripts.
- `src/scene/timeline/master.ts`: the single master timeline. Its time axis is day progress (duration 1), it is paused and driven by a ScrollTrigger through `scroll.ts`. `dayStore` holds progress.
- `src/scene/timeline/acts/<act>.ts`: choreography per act, positioned in progress. `cameraDirector.ts` builds camera tweens from config. Small durations use `U` (1/15) from `fx.ts`.
- `<Camera>` (`src/scene/Camera.tsx`) wraps every layer and carries the room-plane framing (pan, zoom, tilt). `<ParallaxLayer speed>` layers off the room plane get only a depth residual (`timeline/camera.ts`); 0 = fixed sky, 1 = room plane, >1 = foreground. Outside the stage, ParallaxLayer is a plain scroll-speed layer.
- Scene art uses a 1600x900 design canvas. `.scene-canvas` sizes it from `--s` (set in `src/scene/viewport.ts`); children use `box(x, y, w, h)` in canvas units.
- SVG joints and props are tweened through their `transform` attribute (`rotate()`/`translate()` strings), not GSAP `svgOrigin` (that is in global SVG coordinates). `gsap.quickSetter` does not support the `scale` shorthand: set `scaleX` and `scaleY`.

## Systems

- Room art: `src/scene/room/` (furniture, `desk/`, `life/`), screens in `src/scene/screens/` (main, second, laptop states; original anime and movie clips). Props are data-driven: `StatefulG`/`StatefulDiv` (`src/scene/Stateful.tsx`) render every state, `setState(tl, q, prop, state, at)` crossfades them. Every prop and state: `/dev/gallery` (dev only).
- The cat: `src/scene/character/Cat.tsx` + `catPoses.ts`, driven by `src/scene/timeline/catRig.ts` (catPose, catWalk, catJump; tail/ear idle loops on real time).
- Captions: `src/components/ComicCaption.tsx` (layers), `src/scene/timeline/captions.ts` (scrubbed entrances, placement clear of `[data-face]`, `[data-screen-rect]` and HUD, `showBalloon(id)`, D = debug zones).
- Audio: `src/audio/` (AudioManager singleton, synth effects and lo-fi loop, director syncing voice lines and cues to the day, SoundButton). Sound is off until a gesture; voice mp3s found at build time by `src/app/page.tsx`, else speech synthesis.
- Autoplay: `src/autoplay/` (director drives Lenis `scrollTo` from a GSAP tween, stops at voice lines; Intro card, HUD transport). `src/scene/navigate.ts` holds scroll helpers.
- Moving pieces that change every frame live in their own small layers (wall clock hands in `RoomLife`, curtain flares in `Curtains`) so the big room SVG never repaints.

## Gotchas

- Dev server: edits to `globals.css` are sometimes not hot-reloaded (stale stylesheet, no error). Restart the dev server after CSS changes before judging screenshots; if new rules are still missing, delete `.next` (Turbopack's persistent cache) and restart.
- `getBoundingClientRect` ignores clip paths: measure `[data-screen-rect]` for a screen and `[data-face]` for his face, not the groups.
- `gsap.quickSetter(el, "rotation")` needs the `"deg"` unit or it writes invalid CSS silently.
- Scripts read `URL` (the dev server runs on :3000).

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Dev server for the preview pane: `.claude/launch.json` (`next-dev`)
- Checks (Playwright on the installed Chrome): `node scripts/verify-time.mjs --step 2` (clock vs time map, act starts, chip jumps), `node scripts/act-frames.mjs` (5 frames per act + vh per act), `node scripts/captions.mjs [dir] [mobile]` (caption overlaps), `node scripts/audio.mjs`, `node scripts/autoplay.mjs [--quick]`, `node scripts/reduced.mjs`, `node scripts/gallery.mjs`, `node scripts/capdebug.mjs <progress> <out>`, `node scripts/shoot.mjs --mode stops|percent [--viewport mobile] [--reduce]`, `scripts/strip.mjs` (filmstrip), `scripts/audit-layout.mjs`, `scripts/motion.mjs`, `scripts/perf.mjs [--dpr 2]`, `scripts/sync.mjs`, `scripts/net.mjs`. `bash scripts/serve-prod.sh` serves a production build on :3100 for perf runs.
- Deploy: `npx vercel deploy --prod` (folder is linked to Vercel project `parallax`; no Git integration yet)
- Live: https://parallax-three-chi.vercel.app
