// Evaluate an expression in the page at a given progress (0-1).
//   node scripts/probe-eval.mjs 0.4 "document.title"
import { chromium } from "playwright";
const [progress, expr] = [Number(process.argv[2] ?? 0), process.argv[3] ?? "1"];
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3002", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await p.evaluate(async (progress) => {
  const t = document.querySelector(".scene-track");
  window.scrollTo(0, Math.round(progress * (t.offsetHeight - innerHeight)));
  await new Promise((r) => setTimeout(r, 1000));
}, progress);
console.log(JSON.stringify(await p.evaluate(expr), null, 1));
await b.close();
