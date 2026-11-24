// List failed or 4xx/5xx requests while loading and scrolling the page.
import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
p.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
p.on("requestfailed", (r) => bad.push(`failed ${r.url()} ${r.failure()?.errorText}`));
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) bad.push(`[${m.type()}] ${m.text()} @ ${m.location().url}:${m.location().lineNumber}`); });
await p.goto(process.env.URL ?? "http://localhost:3002", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 1500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
await p.waitForTimeout(800);
console.log(bad.length ? bad.join("\n") : "no failed requests, no console errors/warnings");
await b.close();
