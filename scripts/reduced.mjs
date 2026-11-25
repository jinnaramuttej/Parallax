// Reduced motion: the page loads, autoplay still plays (no smooth scroll),
// captions only fade, and there are no console errors.
//   node scripts/reduced.mjs
import { chromium } from "playwright";
const URL = process.env.URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(URL, { waitUntil: "networkidle" });
await p.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
await p.waitForSelector(".intro-play", { state: "visible" });
await p.click(".intro-play");
await p.waitForTimeout(12000);
const state = await p.evaluate(() => ({ autoplay: window.__autoplay.state(), y: window.scrollY, lenis: document.documentElement.classList.contains("lenis") }));
await p.screenshot({ path: "shots/reduced-autoplay.png" });
console.log(JSON.stringify(state));
console.log(state.autoplay === "playing" && state.y > 200 ? "PASS  autoplay plays with reduced motion" : "FAIL  autoplay did not advance");
console.log(errors.length ? `FAIL  console errors: ${[...new Set(errors)].join(" | ")}` : "PASS  no console errors");
await b.close();
