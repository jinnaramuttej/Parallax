# 24 Hours of a Dev

**Live:** https://parallax-three-chi.vercel.app

One developer's day as a scroll-driven (or autoplayed) comic: from a 5:59 AM alarm to a 3 AM deploy, in ten acts. Scrolling is time. The sky turns from dawn to golden hour to night, the sun and moon cross the window, the city lights up, and a flat-vector dev and his cat wake up, drink coffee, boot three screens, sneak an anime episode, multitask, survive a cat-on-keyboard build failure, raid the fridge and ship. Every act has its own camera move, light and one surprise; captions land like comic lettering; voice lines play in speech balloons. All art is inline SVG, every animation is transform or opacity, and it respects `prefers-reduced-motion`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · Howler.js + Web Audio · Vercel

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Press **Play the day** to watch it as an autoplayed short (about two and a half minutes), or just scroll. Keys: space plays and pauses, left and right arrows jump to the previous and next act, D shows the caption safe zones. Any scroll pauses autoplay; Resume picks up where you are.

`/dev/gallery` (development only) shows every prop in every state.

## How it works

The config is the source of truth:

- `src/config/timeMap.ts`: what the clock says at each point of the day (the only clock).
- `src/config/acts.ts`: the ten acts (time span, linger zone, camera shot and beats, voice line, counter events).
- `src/config/captions.ts`: comic captions per act (text, type, zones, tilt, size, timing, entrance).
- `src/config/voice.ts`: voice lines (text, file, balloon, trigger) · `src/config/sfx.ts`: sound cues.
- `src/config/shots.ts`: camera presets · `src/config/scroll.ts`: scroll to day progress.

The engine: `src/scene/timeline/master.ts` builds one paused GSAP timeline whose time axis is day progress, scrubbed by ScrollTrigger; each act's choreography lives in `src/scene/timeline/acts/`. A `<Camera>` wrapper carries the framing and every scene layer is a `<ParallaxLayer speed>` with its own depth. Props are data-driven (`state`, `visible`) and switch by opacity.

## Sound and voice lines

Sound is off until you turn it on (top right); nothing plays before a click or key press, and everything works with sound off (balloons still show). Effects and the lo-fi loop are synthesised with Web Audio. Voice lines play from mp3 files when they exist, otherwise the browser speaks them.

To record the voice lines:

1. Record each line in `src/config/voice.ts` (ids `wake_1`, `coffee_1`, `boot_1`, `anime_1`, `multi_1`, `error_1`, `can_1`, `ship_1`). Mono, 44.1 kHz, trimmed close to the words, about -16 LUFS.
2. Export as `public/audio/voice/<id>.mp3` (for example `public/audio/voice/wake_1.mp3`).
3. Rebuild. The page lists the files it finds at build time; a missing file is never requested and falls back to speech synthesis.

## Checks

Scripts in `scripts/` drive the installed Chrome with Playwright against a running server (`URL=http://localhost:3000`):

- `verify-time.mjs`: clock vs time map, act starts, chip jumps
- `act-frames.mjs`: five frames per act and each act's scroll length
- `captions.mjs`: every caption and balloon, with overlap checks against face, screens and HUD
- `audio.mjs`: audio locked by default, unlock, voice sync and fallbacks, no console errors
- `autoplay.mjs`: plays the whole day; total duration, pause and resume, cut-off voice lines, console errors
- `motion.mjs`, `perf.mjs`, `audit-layout.mjs`, `gallery.mjs`: motion steps, performance traces, layout, prop gallery
