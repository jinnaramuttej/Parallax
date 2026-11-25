// Layout audit: at every 1% of scroll, check that visible captions never cover
// his face, the screens or the HUD; that the HUD, chips, sound and transport
// buttons and the toast stay off his face and the screens; and that he stays
// on screen. Runs on several viewports.
import { chromium } from "playwright";
const ONLY = process.env.VP?.split(",");
const VIEWPORTS_ALL = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const VIEWPORTS = Object.fromEntries(Object.entries(VIEWPORTS_ALL).filter(([k]) => !ONLY || ONLY.includes(k)));
const b = await chromium.launch({ channel: "chrome" });
for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  const p = await b.newPage({ viewport, isMobile: name === "mobile", hasTouch: name === "mobile" });
  await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "networkidle" });
  await p.waitForFunction(() => document.querySelector("[data-loader][data-done]"), null, { timeout: 15000 });
  const issues = [];
  for (let pct = 0; pct <= 100; pct += 1) {
    const found = await p.evaluate(async (pct) => {
      const t = document.querySelector(".scene-track");
      window.scrollTo(0, Math.round((pct / 100) * (t.offsetHeight - innerHeight)));
      // The intro card belongs to the first screen only.
      await new Promise((r) => setTimeout(r, 160));
      const rect = (el) => el && el.getBoundingClientRect();
      const visible = (el) => { const cs = getComputedStyle(el); return cs.visibility !== "hidden" && Number(cs.opacity) > 0.05; };
      const hit = (a, b, pad = 0) => a && b && a.left < b.right - pad && a.right > b.left + pad && a.top < b.bottom - pad && a.bottom > b.top + pad;
      const body = rect(document.querySelector('[data-j="body"]'));
      const face = rect(document.querySelector("[data-face]"));
      const screens = [...document.querySelectorAll("[data-screen-rect]")].map((el) => ({ name: el.dataset.screenRect, r: rect(el) }));
      const ui = [".hud", ".scrubber", "[data-sound-button]", ".autoplay-controls", "[data-el='standup-toast']", ".intro"]
        .map((sel) => document.querySelector(sel))
        .filter((el) => el && visible(el))
        .map((el) => ({ name: el.className || el.dataset.el, r: rect(el) }));
      const out = [];
      document.querySelectorAll("[data-cap]").forEach((c) => {
        if (!visible(c)) return;
        const r = rect(c.querySelector(".cap-body"));
        if (hit(r, face, 2)) out.push(`caption ${c.dataset.cap} covers his face`);
        for (const s of screens) if (hit(r, s.r, 4)) out.push(`caption ${c.dataset.cap} covers the ${s.name} screen`);
        for (const u of ui) if (hit(r, u.r)) out.push(`caption ${c.dataset.cap} overlaps ${u.name}`);
      });
      for (const u of ui) {
        if (hit(u.r, face, 2)) out.push(`${u.name} covers his face`);
        for (const s of screens) if (hit(u.r, s.r, 6)) out.push(`${u.name} overlaps the ${s.name} screen`);
      }
      const vw = innerWidth, vh = innerHeight;
      if (body && (body.left < -10 || body.right > vw + 10 || body.top < -10 || body.bottom > vh + 10)) out.push(`character partly off screen (${body.left|0},${body.top|0},${body.right|0},${body.bottom|0})`);
      return { clock: document.querySelector(".hud-clock").textContent, out };
    }, pct);
    for (const o of found.out) issues.push(`${String(pct).padStart(3)}% ${found.clock.padEnd(8)} ${o}`);
  }
  console.log(`\n[${name} ${viewport.width}x${viewport.height}] ${issues.length ? issues.length + " issue frames" : "no issues"}`);
  // Collapse consecutive frames with the same message.
  let prev = "";
  for (const line of issues) { const msg = line.slice(14); if (msg !== prev) console.log("  " + line); prev = msg; }
  await p.close();
}
await b.close();
