// Caption placement debug: seek to a day progress, press D, screenshot.
//   node scripts/capdebug.mjs 0.46 shots/capdebug.png [fromProgress]
import { chromium } from "playwright";
const [pr, out, from] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
if (from) {
  await p.evaluate(async (pr) => {
    const d = window.__director; const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(d.scrollFromProgress(Number(pr)) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => setTimeout(r, 700));
  }, from);
}
await p.evaluate(async (pr) => {
  const d = window.__director; const t = document.querySelector(".scene-track");
  window.scrollTo(0, Math.round(d.scrollFromProgress(Number(pr)) * (t.offsetHeight - innerHeight)));
  await new Promise((r) => setTimeout(r, 700));
}, pr);
await p.keyboard.press("d");
await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(() => window.__captions.placements())));
await p.screenshot({ path: out });
await b.close();
