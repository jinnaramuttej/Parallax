// Every comic caption and voice balloon: seek to it, screenshot, and measure
// how much it overlaps his face, the screens and the HUD (should be 0).
//   node scripts/captions.mjs [outDir] [mobile]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const outDir = args.find((a) => a !== "mobile") ?? "shots/captions";
const mobile = args.includes("mobile");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });

const seek = (pr) =>
  page.evaluate(async (pr) => {
    const d = window.__director;
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => setTimeout(r, 650));
  }, pr);

/** Overlap (px²) of each visible caption with the face, screens and HUD. */
const measure = () =>
  page.evaluate(() => {
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    };
    const ov = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const shown = (el) => el && getComputedStyle(el).visibility !== "hidden" && Number(getComputedStyle(el).opacity) > 0.05;
    const zones = { face: document.querySelector("[data-face]") };
    for (const s of ["main", "second", "laptop"]) zones[`screen-${s}`] = document.querySelector(`[data-screen-rect="${s}"]`);
    zones.hud = document.querySelector(".hud");
    zones.chips = document.querySelector(".scrubber");
    zones.sound = document.querySelector("[data-sound-button]");
    const out = [];
    for (const cap of document.querySelectorAll("[data-cap]")) {
      if (!shown(cap)) continue;
      const body = cap.querySelector(".cap-body");
      const r = rect(body);
      const hits = {};
      for (const [k, el] of Object.entries(zones)) {
        if (!el) continue;
        const a = ov(r, rect(el));
        if (a > 4) hits[k] = Math.round(a);
      }
      const inView = r.x >= 0 && r.y >= 0 && r.x + r.w <= innerWidth && r.y + r.h <= innerHeight;
      out.push({ id: cap.dataset.cap, hits, inView, zone: window.__captions.placements().find((p) => p.id === cap.dataset.cap)?.zone });
    }
    return out;
  });

// Captions on the page (voice balloons have ids like wake_1).
const list = await page.evaluate(() =>
  [...document.querySelectorAll("[data-cap]")].map((el) => ({ id: el.dataset.cap, type: el.dataset.capType })),
);

// Timing: read from the scrubbed timeline by probing where each caption is visible.
const windows = await page.evaluate(async (ids) => {
  const d = window.__director;
  const t = document.querySelector(".scene-track");
  const found = {};
  for (let pr = 0; pr <= 1.0001; pr += 0.001) {
    window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const id of ids) {
      const el = document.querySelector(`[data-cap="${id}"]`);
      if (getComputedStyle(el).visibility !== "hidden") (found[id] ??= []).push(pr);
    }
  }
  return found;
}, list.filter((c) => !/_\d$/.test(c.id)).map((c) => c.id));

const report = [];
for (const [id, prs] of Object.entries(windows)) {
  const mid = prs[Math.floor(prs.length * 0.6)];
  await seek(mid);
  const m = await measure();
  await page.screenshot({ path: `${outDir}/${id}${mobile ? "-mobile" : ""}.png` });
  report.push({ id, at: mid.toFixed(3), shown: m });
}

// Voice balloons: show each one at its trigger.
const VOICE_AT = { wake_1: 0.079, coffee_1: 0.176, boot_1: 0.226, anime_1: 0.4635, multi_1: 0.566, error_1: 0.706, can_1: 0.798, ship_1: 0.97 };
for (const [id, at] of Object.entries(VOICE_AT)) {
  await seek(at);
  await page.evaluate((id) => window.__captions.showBalloon(id), id);
  await page.waitForTimeout(600);
  const m = await measure();
  await page.screenshot({ path: `${outDir}/${id}${mobile ? "-mobile" : ""}.png` });
  await page.evaluate((id) => window.__captions.hideBalloon(id), id);
  report.push({ id, at: String(at), shown: m });
}

let bad = 0;
for (const r of report) {
  const mine = r.shown.filter((s) => s.id === r.id);
  const issues = mine.flatMap((s) => [...Object.entries(s.hits).map(([k, a]) => `${k} ${a}px²`), ...(s.inView ? [] : ["off-screen"])]);
  if (issues.length) bad++;
  console.log(`${r.id.padEnd(14)} @${r.at}  ${mine[0]?.zone ?? "?"}  ${issues.length ? "OVERLAP: " + issues.join(", ") : "clear"}`);
}
console.log(`\n${report.length} captions, ${bad} with overlaps`);
console.log(errors.length ? `console errors:\n${[...new Set(errors)].join("\n")}` : "console errors: none");
await browser.close();
