// Autoplay run: click "Play the day" and let it play to the end. Reports the
// total duration, console errors, pause/resume behaviour, and any voice line
// that was cut off or skipped.
//   node scripts/autoplay.mjs [--quick]   (--quick: skip the pause/resume checks)
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const quick = process.argv.includes("--quick");
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
await page.waitForSelector(".intro-play", { state: "visible", timeout: 5000 });
await page.screenshot({ path: "shots/autoplay-intro.png" });

const progress = () =>
  page.evaluate(() => {
    const t = document.querySelector(".scene-track");
    return window.__director.progressFromScroll(Math.min(1, window.scrollY / (t.offsetHeight - innerHeight)));
  });
const state = () => page.evaluate(() => window.__autoplay.state());

const t0 = Date.now();
await page.click(".intro-play");
await page.waitForTimeout(800);
const checks = [];
const check = (name, ok, detail = "") => {
  checks.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
check("Play starts autoplay", (await state()) === "playing");
check("Play turns sound on (unlocked)", await page.evaluate(() => window.__audio.state().unlocked && window.__audio.state().wantsSound));
check("intro card hides", !(await page.isVisible(".intro-play")));

let paused = 0;
if (!quick) {
  await page.waitForTimeout(5000);
  await page.keyboard.press(" ");
  await page.waitForTimeout(700);
  check("space pauses", (await state()) === "paused");
  check("button reads Resume", (await page.getAttribute(".autoplay-controls", "aria-label")) === "Resume autoplay");
  await page.screenshot({ path: "shots/autoplay-paused.png" });
  const p1 = await progress();
  await page.waitForTimeout(1500);
  check("paused means the day holds still", Math.abs((await progress()) - p1) < 0.002);
  const tp = Date.now();
  await page.keyboard.press(" ");
  await page.waitForTimeout(500);
  check("space resumes", (await state()) === "playing");
  await page.waitForTimeout(3000);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(400);
  check("scrolling pauses", (await state()) === "paused");
  await page.click(".autoplay-controls");
  await page.waitForTimeout(400);
  check("Resume button continues", (await state()) === "playing");
  paused = Date.now() - tp - 3900;
}

// Let it play to the end (timeout 9 minutes).
const marks = [];
let last = -1;
while (Date.now() - t0 < 9 * 60 * 1000) {
  const s = await state();
  const p = await progress();
  const act = await page.evaluate((p) => window.__director.acts.findLast((a) => a.startProgress <= p + 1e-6)?.id, p);
  if (act !== last) {
    marks.push({ act, at: ((Date.now() - t0) / 1000).toFixed(1) });
    last = act;
  }
  if (s === "done") break;
  if (s !== "playing") {
    console.log(`autoplay stopped in state "${s}" at progress ${p.toFixed(3)}`);
    break;
  }
  await page.waitForTimeout(500);
}
const total = (Date.now() - t0) / 1000;
check("reaches the end", (await state()) === "done");
await page.screenshot({ path: "shots/autoplay-end.png" });

const log = await page.evaluate(() => window.__audio.log.map((l) => ({ ...l })));
const lines = await page.evaluate(() => [...document.querySelectorAll("[data-cap]")].map((e) => e.dataset.cap).filter((id) => /_\d$/.test(id)));
console.log("\nact timeline (s from Play):", marks.map((m) => `${m.act}@${m.at}`).join("  "));
console.log("\nvoice lines:");
let cut = 0;
for (const id of lines) {
  const entries = log.filter((l) => l.id === id);
  const played = entries.find((l) => l.ended);
  const ok = played?.completed === true;
  if (!ok) cut++;
  const dur = played ? ((played.ended - played.started) / 1000).toFixed(1) + "s" : "-";
  console.log(`  ${id.padEnd(10)} ${ok ? "complete" : "CUT OFF / MISSING"}  via ${played?.via ?? "-"}  ${dur}${entries.some((l) => l.skipped) ? "  (skipped: " + entries.filter((l) => l.skipped).map((l) => l.skipped).join(",") + ")" : ""}`);
}
check("no voice line cut off", cut === 0, `${cut} cut`);
console.log(`\ntotal: ${total.toFixed(1)}s (${(total - paused / 1000).toFixed(1)}s without the pause tests)`);
const real = [...new Set(errors)];
check("no console errors", real.length === 0, real.join(" | "));
console.log(`\n${checks.filter(Boolean).length}/${checks.length} checks passed`);
await browser.close();
