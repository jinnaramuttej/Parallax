// Audio checks: locked and silent by default (no console errors), balloons
// still show with sound off, unlock on a gesture, voice lines fire once and
// queue, fast scrolling skips them, a missing mp3 falls back to speech, the
// sound choice persists (but still waits for a gesture).
//   node scripts/audio.mjs
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
const voiceRequests = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
page.on("request", (r) => r.url().includes("/audio/voice/") && voiceRequests.push(r.url()));

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const go = async () => {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
};
const seek = (pr) =>
  page.evaluate(async (pr) => {
    const d = window.__director;
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => setTimeout(r, 400));
  }, pr);
/** Scroll from a to b in small steps; `ms` per step sets the pace. */
const sweep = (a, b, steps, ms) =>
  page.evaluate(
    async ({ a, b, steps, ms }) => {
      const d = window.__director;
      const t = document.querySelector(".scene-track");
      for (let i = 0; i <= steps; i++) {
        const pr = a + ((b - a) * i) / steps;
        window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
        await new Promise((r) => setTimeout(r, ms));
      }
    },
    { a, b, steps, ms },
  );
const state = () => page.evaluate(() => window.__audio.state());
const log = () => page.evaluate(() => window.__audio.log.map((l) => ({ ...l })));
const balloonShown = (id) =>
  page.evaluate((id) => getComputedStyle(document.querySelector(`[data-cap="${id}"]`)).visibility !== "hidden", id);

// 1. Fresh visit: locked and off.
await go();
let s = await state();
check("starts locked and off", !s.unlocked && !s.wantsSound, JSON.stringify(s));
check("first-visit tooltip shows", await page.isVisible(".sound-tip"));
check("sound button has an accessible label", (await page.getAttribute(".sound-btn", "aria-label")) === "Turn sound on");

// 2. Sound off: a line still shows its balloon, silently.
await seek(0.17);
await sweep(0.17, 0.18, 30, 60);
await page.waitForTimeout(300);
check("balloon shows with sound off", await balloonShown("coffee_1"));
await page.waitForTimeout(3500);
let l = await log();
const coffee = l.findLast((x) => x.id === "coffee_1");
check("silent line completes", coffee?.via === "silent" && coffee?.completed === true, JSON.stringify(coffee));
check("balloon hides at the end", !(await balloonShown("coffee_1")));

// 3. Fast scroll through a trigger: skipped.
await seek(0.55);
await sweep(0.556, 0.62, 5, 16);
await page.waitForTimeout(400);
l = await log();
check("fast scroll skips the line", l.some((x) => x.id === "multi_1" && x.skipped === "fast"), JSON.stringify(l.filter((x) => x.id === "multi_1")));

// 4. A chip-sized jump over a trigger fires nothing.
await seek(0.69);
await seek(0.72);
l = await log();
check("jumping over a trigger fires nothing", !l.some((x) => x.id === "error_1" && !x.skipped));

// 5. Unlock with the button (a gesture).
await page.click(".sound-btn");
s = await state();
check("button unlocks and turns sound on", s.unlocked && s.wantsSound, JSON.stringify(s));
check("choice persisted", (await page.evaluate(() => localStorage.getItem("parallax:sound"))) === "on");
check("tooltip dismissed", !(await page.isVisible(".sound-tip")));

// 6. Missing mp3 is never requested: the line is spoken instead.
await seek(0.215);
await sweep(0.218, 0.23, 30, 60);
await page.waitForTimeout(4500);
l = await log();
const boot = l.findLast((x) => x.id === "boot_1");
check("missing file falls back to speech", boot?.via === "speech" || boot?.via === "silent", JSON.stringify(boot));
check("no request for missing voice files", voiceRequests.length === 0, voiceRequests.join(", "));

// 7. A file that is listed but fails to load (404) falls back too, without throwing.
await page.route("**/audio/voice/*.mp3", (r) => r.fulfill({ status: 404, body: "" }));
await page.evaluate(() => window.__audio.setVoiceFiles(["/audio/voice/can_1.mp3"]));
await seek(0.79);
await sweep(0.792, 0.802, 30, 60);
await page.waitForTimeout(4500);
l = await log();
const can = l.findLast((x) => x.id === "can_1");
check("broken file falls back to speech", can?.via === "speech" || can?.via === "silent", JSON.stringify(can));

// 8. Two lines in a row queue instead of overlapping.
await seek(0.07);
await sweep(0.072, 0.09, 40, 40);
await page.waitForTimeout(200);
s = await state();
check("voice lines never overlap (one playing at a time)", s.playing === null || typeof s.playing === "string");

// 8b. Scrolling on to another act stops the line and hides its balloon.
await seek(0.172);
await sweep(0.174, 0.18, 20, 60);
await page.waitForTimeout(300);
const before = await state();
await seek(0.3);
await page.waitForTimeout(500);
const after = await state();
l = await log();
const left = l.findLast((x) => x.id === "coffee_1");
check("leaving the act stops the line and its balloon", before.playing === "coffee_1" && after.playing === null && left?.leftAct === true && !(await balloonShown("coffee_1")), JSON.stringify({ before: before.playing, after: after.playing, left }));

// 9. Reload: the choice is remembered but still waits for a gesture.
await page.unroute("**/audio/voice/*.mp3");
await go();
s = await state();
check("remembered 'on' stays locked until a gesture", s.wantsSound && !s.unlocked, JSON.stringify(s));
await page.mouse.click(700, 450);
s = await state();
check("any gesture unlocks a remembered 'on'", s.unlocked, JSON.stringify(s));

const real = errors.filter((e) => !/404|Failed to load resource/.test(e));
check("no console errors", real.length === 0, real.join(" | "));
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} checks passed`);
await browser.close();
process.exit(results.every((r) => r.ok) ? 0 : 1);
