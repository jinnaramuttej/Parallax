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

## Scene engine

- `src/scene/timing.ts`: story time in "units" (each stop has a hold, plus transitions between stops), the clock mapping, and stop anchors. Scroll maps linearly to units.
- `src/scene/Scene.tsx`: tall scroll track with a sticky full-viewport stage, and builds the master timeline.
- `src/scene/timeline/master.ts`: the single scrubbed master timeline. `dayStore` holds `dayProgress` (0–1).
- Scene art uses a 1600×900 design canvas. `.scene-canvas` sizes it from `--s` (set in `src/scene/viewport.ts`), and children use `box(x, y, w, h)` in canvas units.
- `<ParallaxLayer speed>`: inside the stage, speed scales the camera (pan, zoom, tilt) applied to that layer (0 = fixed sky, 1 = room plane, >1 = foreground). Outside the stage, it is a normal scroll-speed parallax layer.

- Per-stop choreography lives in `src/scene/timeline/stops/stopN.ts`; copy, counter events and camera shots per stop are in `src/scene/story.ts`.
- SVG joints and props are tweened through their `transform` attribute (`rotate()`/`translate()` strings), not GSAP `svgOrigin` (that is in global SVG coordinates).

## Gotchas

- Dev server: edits to `globals.css` are sometimes not hot-reloaded (stale stylesheet, no error). Restart the dev server after CSS changes before judging screenshots.
- The ports for `next dev` move around (3000 is taken on this machine); scripts read `URL`.

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Dev server for the preview pane: `.claude/launch.json` (`next-dev`)
- Checks (Playwright on the installed Chrome): `node scripts/shoot.mjs --mode stops|percent [--viewport mobile] [--reduce]`, `scripts/audit-layout.mjs`, `scripts/motion.mjs`, `scripts/perf.mjs [--dpr 2]`, `scripts/sync.mjs`, `scripts/net.mjs`. `bash scripts/serve-prod.sh` serves a production build on :3100 for perf runs.
- Deploy: `npx vercel deploy --prod` (folder is linked to Vercel project `parallax`; no Git integration yet)
- Live: https://parallax-three-chi.vercel.app
