// Exercise the click/hover interactions and report what changed.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(m.text()));
await p.goto(process.env.URL ?? "http://localhost:3002", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector("[data-loader][data-done]"), null, { timeout: 15000 });
// Go to 1 PM (desk), via the scrubber.
await p.click('.scrubber-stop:nth-child(3)');
await p.waitForTimeout(3500);
const state = () => p.evaluate(() => ({
  clock: document.querySelector(".hud-clock").textContent,
  cans: document.querySelector('[data-counter="cans"]').textContent.trim(),
  floorCan: getComputedStyle(document.querySelector('[data-can="6"]')).opacity,
  door: document.querySelector('[data-el="fridge-door"]').getAttribute("transform"),
  snippet: [0, 1, 2].map((i) => getComputedStyle(document.querySelector(`[data-snippet="${i}"]`)).opacity),
  pupil: document.querySelector('[data-el="pupil"]').getAttribute("transform"),
  current: document.querySelector(".scrubber-stop[aria-current]")?.textContent,
}));
console.log("after scrubber -> 1 PM:", await state());
await p.click('[data-hotspot="fridge"]');
await p.waitForTimeout(350);
console.log("fridge mid-open:", (await state()).door);
await p.waitForTimeout(1600);
console.log("after fridge click:", await state());
await p.click('[data-hotspot="monitor"]');
await p.waitForTimeout(500);
console.log("after monitor click:", (await state()).snippet);
await p.click('[data-hotspot="mug"]');
await p.waitForTimeout(250);
console.log("mug puff opacity:", await p.evaluate(() => getComputedStyle(document.querySelector("[data-puff='3']")).opacity));
const head = await p.evaluate(() => { const r = document.querySelector('[data-j="head"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await p.mouse.move(head.x + 40, head.y + 60);
await p.mouse.move(head.x + 70, head.y - 40, { steps: 5 });
await p.waitForTimeout(500);
console.log("hover look:", (await state()).pupil, await p.evaluate(() => document.querySelector('[data-j="look"]').getAttribute("transform")));
await p.screenshot({ path: "shots/interact.png" });
console.log(errors.length ? errors.join("\n") : "console: clean");
await b.close();
