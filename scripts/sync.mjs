// Lenis <-> ScrollTrigger sync: while wheel-scrolling (Lenis smoothing), record
// per animation frame the scroll position and the scene's state. If the
// timeline lags Lenis, the scene keeps changing after scrollY has stopped.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector("[data-loader][data-done]"), null, { timeout: 20000 });
await p.evaluate(() => {
  window.__rec = [];
  const room = document.querySelector("[data-camera]");
  const loop = () => {
    window.__rec.push([scrollY, document.querySelector(".hud-clock").textContent, room.style.transform]);
    if (window.__rec.length < 4000) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
});
await p.mouse.move(700, 400);
for (let burst = 0; burst < 6; burst++) {
  for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(16); }
  await p.waitForTimeout(1600);
}
const rec = await p.evaluate(() => window.__rec);
// For each burst: frame index where scrollY last changed vs where the scene last changed.
let lags = [], lastScroll = 0, lastScene = 0;
for (let i = 1; i < rec.length; i++) {
  if (rec[i][0] !== rec[i - 1][0]) lastScroll = i;
  if (rec[i][1] !== rec[i - 1][1] || rec[i][2] !== rec[i - 1][2]) lastScene = i;
  const idle = i - lastScroll;
  if (idle === 40) lags.push(Math.max(0, lastScene - lastScroll));
}
const html = await p.evaluate(() => document.documentElement.className);
console.log({ frames: rec.length, bursts: lags.length, sceneFramesAfterScrollStopped: lags, lenisActive: html.includes("lenis") });
await b.close();
