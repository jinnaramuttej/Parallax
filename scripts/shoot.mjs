// Scroll through the scene with Playwright and screenshot it.
//
//   node scripts/shoot.mjs --mode stops   [--url http://localhost:3000] [--out shots]
//   node scripts/shoot.mjs --mode percent --step 5
//   node scripts/shoot.mjs --mode stops --viewport mobile --reduce
//
// Uses the locally installed Chrome (channel "chrome"), so no browser
// download is needed. Writes one PNG per position plus a contact sheet.
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") || all[i + 1] === undefined ? "true" : all[i + 1]]);
    return acc;
  }, []),
);

const url = args.url ?? process.env.URL ?? "http://localhost:3002";
const mode = args.mode ?? "stops";
const step = Number(args.step ?? 5);
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const vpName = args.viewport ?? "desktop";
const viewport = viewports[vpName];
const out = path.resolve(args.out ?? `shots/${mode}-${vpName}${args.reduce ? "-reduce" : ""}`);
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: args.headed !== "true" });
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  reducedMotion: args.reduce ? "reduce" : "no-preference",
  isMobile: vpName === "mobile",
  hasTouch: vpName === "mobile",
});
const page = await context.newPage();
const errors = [];
let collecting = true;
const log = (msg) => collecting && errors.push(msg);
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") log(`[${m.type()}] ${m.text()} @ ${m.location().url}`);
});
page.on("pageerror", (e) => log(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => log(`[requestfailed] ${r.url()}`));
page.on("response", (r) => r.status() >= 400 && log(`[${r.status()}] ${r.url()}`));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("[data-scene-stage]");
await page.evaluate(() => document.fonts.ready);
// Wait for the loading screen (if any) to finish.
await page.waitForFunction(() => !document.querySelector("[data-loader]:not([data-done])"), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(800);

const info = await page.evaluate(() => {
  const track = document.querySelector(".scene-track");
  return {
    top: track.getBoundingClientRect().top + window.scrollY,
    length: track.offsetHeight - window.innerHeight,
    // Act anchors as scroll fractions, from the page's director config.
    acts: window.__director.acts.map((a) => ({
      id: a.id,
      label: a.label,
      scroll: window.__director.scrollFromProgress(a.anchor),
    })),
  };
});

const targets =
  mode === "stops"
    ? info.acts.map((a, i) => ({ name: `act${i}-${a.id}`, label: a.label, progress: Math.min(a.scroll, 1) }))
    : Array.from({ length: Math.floor(100 / step) + 1 }, (_, i) => ({
        name: `p${String(i * step).padStart(3, "0")}`,
        label: `${i * step}%`,
        progress: (i * step) / 100,
      }));

const shots = [];
for (const t of targets) {
  const y = Math.round(info.top + t.progress * info.length);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(Number(args.wait ?? 900));
  const hud = await page.evaluate(() => document.querySelector(".hud-clock")?.textContent ?? "");
  const file = path.join(out, `${t.name}.png`);
  await page.screenshot({ path: file });
  shots.push({ ...t, file, hud });
  console.log(`${t.name}  ${t.label.padEnd(26)} clock=${hud}`);
}

// Contact sheet: all shots in a grid, labelled.
collecting = false;
const cols = vpName === "mobile" ? 6 : mode === "stops" ? 3 : 4;
const thumbW = vpName === "mobile" ? 260 : 480;
const imgs = await Promise.all(shots.map(async (s) => (await readFile(s.file)).toString("base64")));
await page.setViewportSize({ width: cols * (thumbW + 8) + 8, height: 800 });
await page.setContent(`<!doctype html><body style="margin:0;padding:4px;background:#111;font:13px monospace;color:#eee;display:grid;grid-template-columns:repeat(${cols},${thumbW}px);gap:8px">
${shots.map((s, i) => `<figure style="margin:0"><img src="data:image/png;base64,${imgs[i]}" style="width:${thumbW}px;display:block"><figcaption>${s.name} · ${s.label} · ${s.hud}</figcaption></figure>`).join("")}</body>`);
await page.screenshot({ path: path.join(out, "sheet.png"), fullPage: true });

await writeFile(path.join(out, "console.txt"), errors.join("\n") || "(no console errors or warnings)");
console.log(`\n${shots.length} shots -> ${out}`);
console.log(errors.length ? `console:\n${errors.slice(0, 20).join("\n")}` : "console: clean");
await browser.close();
