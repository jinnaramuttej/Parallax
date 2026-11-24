# 24 Hours of a Dev

**Live:** https://parallax-three-chi.vercel.app

A scroll-driven parallax story of one developer's day, from a 5:59 AM alarm to a 3 AM deploy. Scrolling is time: the sky crossfades through dawn, noon, golden hour and night, the sun and moon arc past the window, city windows light up, and a flat-vector developer (built from posable SVG joints) wakes up, codes, hits a bug, raids the fridge and ships, across six stops with their own camera moves, light changes and one surprise each. Background and foreground layers move at different depths for a 2.5D feel; the fridge, monitor and coffee mug are clickable, he looks at your cursor, and the day ends with confetti and a terminal-style summary. All art is inline SVG, every animation uses only transform and opacity, and it respects `prefers-reduced-motion`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · Vercel

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## How it works

- `src/scene/Scene.tsx`: a tall scroll track with a sticky full-screen stage.
- `src/scene/timeline/master.ts`: one GSAP timeline, scrubbed over the track. `tl.progress()` is the day's progress (0 to 1).
- `src/scene/timing.ts`: story time in units (a hold at each stop, faster transitions between), mapped to a clock from 5:59 AM to 3:00 AM.
- `src/scene/timeline/stops/stop0.ts` … `stop5.ts`: per-stop choreography (camera, copy, light, surprise).
- `src/components/ParallaxLayer.tsx`: every scene layer. Inside the stage, `speed` scales the camera's pan, zoom and tilt for that layer; elsewhere it is a scroll-speed parallax layer.
- `src/components/SmoothScroll.tsx`: Lenis driven by `gsap.ticker`, feeding `ScrollTrigger.update`.

## Checks

Scripts in `scripts/` drive the installed Chrome with Playwright against a running server (`URL=http://localhost:3000`):

- `shoot.mjs`: screenshots of each stop or every N% of scroll, plus a contact sheet
- `audit-layout.mjs`: checks text never covers the character or monitor, on four screen sizes
- `motion.mjs`: flags abrupt motion between small scroll steps
- `perf.mjs`: wheel-scrolls the whole day under a Chrome trace (FPS, long tasks, layout shifts, repaints)
- `sync.mjs`: checks Lenis and ScrollTrigger stay in the same frame
