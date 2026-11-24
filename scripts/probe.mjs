import { chromium } from "playwright";
const stop = Number(process.argv[2] ?? 2);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3002", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
const out = await p.evaluate(async (stop) => {
  const t = document.querySelector(".scene-track");
  const len = t.offsetHeight - innerHeight;
  const anchors = JSON.parse(t.dataset.anchors);
  window.scrollTo(0, Math.round((anchors[stop] / Number(t.dataset.total)) * len));
  await new Promise((r) => setTimeout(r, 1200));
  return [document.querySelector(".hud-clock").textContent, ...[...document.querySelectorAll("[data-j]")].map((e) => `${e.dataset.j}: ${e.getAttribute("transform")} | svgOrigin=${e.getAttribute("data-svg-origin")}`)].join("\n");
}, stop);
console.log(out);
await b.close();
