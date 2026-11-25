// Before/after frames for the audit: reproduce each problem the way the
// layout audit found it (a 1% scroll sweep, then a screenshot).
//   node scripts/before-after.mjs <prefix> [case]   e.g. shots/audit/before
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const URL = process.env.URL ?? "http://localhost:3100";
const prefix = process.argv[2] ?? "shots/audit/before";
await mkdir(path.dirname(prefix), { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const only = process.argv[3];
const cases = [
  { name: "balloon-lingers", vp: { width: 1440, height: 900 }, from: 6, to: 20, step: 0.75, ms: 200 },
  { name: "toast-under-tip", vp: { width: 1440, height: 900 }, progress: 0.457 },
  { name: "stamp-overscale", vp: { width: 1440, height: 900 }, progress: 0.4712 },
  { name: "anime-balloon", vp: { width: 1440, height: 900 }, from: 44, to: 49, debug: true },
  { name: "shipped-tablet", vp: { width: 768, height: 1024 }, from: 92, to: 97 },
  { name: "brring-mobile", vp: { width: 390, height: 844 }, from: 4, to: 7 },
];
for (const c of cases.filter((c) => !only || c.name === only)) {
  const p = await b.newPage({ viewport: c.vp });
  await p.goto(URL, { waitUntil: "networkidle" });
  await p.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
  await p.evaluate(async (c) => {
    const t = document.querySelector(".scene-track");
    const max = t.offsetHeight - innerHeight;
    if (c.progress !== undefined) {
      window.scrollTo(0, Math.round(window.__director.scrollFromProgress(c.progress) * max));
      await new Promise((r) => setTimeout(r, 300));
      return;
    }
    for (let pct = c.from; pct <= c.to; pct += c.step ?? 1) {
      window.scrollTo(0, Math.round((pct / 100) * max));
      await new Promise((r) => setTimeout(r, c.ms ?? 160));
    }
  }, c);
  await p.waitForTimeout(150);
  if (c.debug) await p.keyboard.press("d");
  await p.waitForTimeout(c.debug ? 100 : 0);
  await p.screenshot({ path: `${prefix}-${c.name}.png` });
  console.log(`wrote ${prefix}-${c.name}.png`);
  await p.close();
}
await b.close();
