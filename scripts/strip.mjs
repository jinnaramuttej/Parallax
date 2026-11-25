// Filmstrip: crop one region at several day-progress points.
//   node scripts/strip.mjs out.png x,y,w,h 0.20,0.21,0.22 [mobile]
import { chromium } from "playwright";
const [out, rect, points, vp] = process.argv.slice(2);
const [x, y, w, h] = rect.split(",").map(Number);
const ps = points.split(",").map(Number);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: vp === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
const frames = [];
for (const pr of ps) {
  const clock = await p.evaluate(async (pr) => {
    const d = window.__director;
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => setTimeout(r, 450));
    return document.querySelector(".hud-clock").textContent;
  }, pr);
  frames.push({ pr, clock, b64: (await p.screenshot({ clip: { x, y, width: w, height: h } })).toString("base64") });
}
await p.setViewportSize({ width: Math.min(1900, frames.length * (w + 6) + 6), height: h + 40 });
await p.setContent(`<body style="margin:0;padding:3px;background:#111;color:#eee;font:12px monospace;display:flex;gap:6px">${frames.map((f) => `<figure style="margin:0"><img src="data:image/png;base64,${f.b64}" style="display:block"><figcaption>${f.pr} · ${f.clock}</figcaption></figure>`).join("")}</body>`);
await p.screenshot({ path: out, fullPage: true });
await b.close();
