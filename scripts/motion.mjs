// Sample the scroll in small steps and flag abrupt motion: frames where the
// character, camera or copy moves much more than usual per step.
//   node scripts/motion.mjs [--step 0.5]
import { chromium } from "playwright";
const step = Number(process.argv[process.argv.indexOf("--step") + 1] || 0.5);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3003", { waitUntil: "networkidle" });
await p.waitForTimeout(1000);
const samples = [];
for (let pct = 0; pct <= 100.001; pct += step) {
  const s = await p.evaluate(async (pct) => {
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round((pct / 100) * (t.offsetHeight - innerHeight)));
    await new Promise((r) => setTimeout(r, 180));
    const c = document.querySelector('[data-el="character"]').getBoundingClientRect();
    const room = new DOMMatrix(getComputedStyle(document.querySelector('[data-parallax-speed="1"]')).transform);
    const sky = new DOMMatrix(getComputedStyle(document.querySelector('[data-parallax-speed="0.55"]')).transform);
    return {
      pct,
      clock: document.querySelector(".hud-clock").textContent,
      cx: c.x + c.width / 2, cy: c.y + c.height / 2,
      roomX: room.e, roomY: room.f, zoom: room.a, skylineX: sky.e,
    };
  }, pct);
  samples.push(s);
}
const deltas = samples.slice(1).map((s, i) => {
  const a = samples[i];
  return {
    at: `${a.pct.toFixed(1)}-${s.pct.toFixed(1)}%`, clock: s.clock,
    character: Math.hypot(s.cx - a.cx, s.cy - a.cy),
    camera: Math.hypot(s.roomX - a.roomX, s.roomY - a.roomY) + Math.abs(s.zoom - a.zoom) * 1000,
    parallax: Math.abs((s.roomX - s.skylineX) - (a.roomX - a.skylineX)),
  };
});
const median = (k) => [...deltas].map((d) => d[k]).sort((x, y) => x - y)[Math.floor(deltas.length / 2)] || 1;
for (const k of ["character", "camera", "parallax"]) {
  const m = median(k);
  const top = [...deltas].sort((x, y) => y[k] - x[k]).slice(0, 6);
  console.log(`\n${k}: median ${m.toFixed(1)}px/step, largest:`);
  for (const d of top) console.log(`  ${d.at.padEnd(12)} ${d.clock.padEnd(8)} ${d[k].toFixed(1)}px (${(d[k] / Math.max(m, 0.5)).toFixed(1)}x median)`);
}
await b.close();
