@AGENTS.md

# 24 Hours of a Dev

Scroll-driven parallax site: a flat-vector SVG scene where scroll = time of day.
Layers (back to front): sky, skyline, room, foreground. Each moves at its own speed.

## Stack

- Next.js 16 App Router + TypeScript + Tailwind v4, code in `src/`. Cache Components is on (scaffold default).
- Smooth scroll: `src/components/SmoothScroll.tsx` runs Lenis from `gsap.ticker` and calls `ScrollTrigger.update` on every Lenis scroll. Use `useLenis()` from there for `scrollTo`.
- Import `gsap` / `ScrollTrigger` only from `@/lib/gsap`, where plugins are registered once.
- `<ParallaxLayer speed={n}>` (`src/components/ParallaxLayer.tsx`): 0 = fixed to viewport, 1 = normal scroll, <1 = background, >1 = foreground. Inside a sticky stage, pass `pinned` and `trigger={trackRef}` (the tall scroll track).
- Also installed, not wired yet: `motion`, `@rive-app/react-canvas`, `@lottiefiles/dotlottie-react`, `animejs`, `@theatre/core`, `@theatre/studio`. Keep `@theatre/studio` out of production bundles (dynamic import, dev only).
- `src/app/page.tsx` is a temporary setup-check page; the scene replaces it.

## Rules

1. Animate only `transform` and `opacity`. Never animate layout-triggering properties (top, left, width, height, margin, padding, etc.). For sky colour changes, crossfade stacked layers with opacity.
2. Scene art is inline SVG, flat vector, with a small cohesive palette defined once (CSS variables) and reused everywhere.
3. Before writing GSAP, Lenis or Motion code, check current docs with the Context7 MCP.
4. After scene changes, use the Playwright MCP to screenshot every scroll stop (desktop and mobile widths) and fix layout bugs before committing.
5. Commit in small steps, one working piece at a time.
6. Keep a live Vercel deployment; redeploy after each meaningful change.
7. Keep `prefers-reduced-motion` working (SmoothScroll and ParallaxLayer already honour it).

## Commands

- `npm run dev` / `npm run build` / `npm run lint`
- Dev server for the preview pane: `.claude/launch.json` (`next-dev`)
- Deploy: `npx vercel deploy --prod` (folder is linked to Vercel project `parallax`; no Git integration yet)
- Live: https://parallax-three-chi.vercel.app
