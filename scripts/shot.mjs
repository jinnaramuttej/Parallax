// Screenshot one spot: a CSS selector scrolled into view, or a progress 0-1.
//   node scripts/shot.mjs out.png ".stats" [mobile] [reduce]
import { chromium } from "playwright";
const [out, target, ...flags] = process.argv.slice(2);
const mobile = flags.includes("mobile");
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  reducedMotion: flags.includes("reduce") ? "reduce" : "no-preference",
  isMobile: mobile, hasTouch: mobile,
});
const p = await c.newPage();
await p.goto(process.env.URL ?? "http://localhost:3002", { waitUntil: "networkidle" });
await p.waitForFunction(() => !document.querySelector("[data-loader]:not([data-done])"), null, { timeout: 15000 }).catch(() => {});
await p.evaluate(async (target) => {
  const n = Number(target);
  if (Number.isFinite(n)) {
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(n * (t.offsetHeight - innerHeight)));
  } else {
    const el = document.querySelector(target);
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY);
  }
}, target);
await p.waitForTimeout(2200);
await p.screenshot({ path: out });
await b.close();
