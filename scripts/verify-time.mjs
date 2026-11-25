// Verify the clock against the time map, independently of the page's code.
//
// Scrolls the page in STEP% increments and prints, for each step:
//   scroll %, day progress, clock shown, act highlighted, expected clock, expected act.
// Expected clock = timeAt(progress) with timeAt imported straight from
// src/config/timeMap.ts (Node strips the types). Progress comes from the
// page's scroll map (config), the clock shown from the HUD. Then it
// screenshots every act start and clicks every HUD chip.
//
//   URL=http://localhost:3000 node scripts/verify-time.mjs [--step 2]
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { formatClock, timeAt } from "../src/config/timeMap.ts";

const step = Number(process.argv[process.argv.indexOf("--step") + 1] || 2);
const fmt = (m) => {
  const c = formatClock(m);
  return `${c.time}${c.period}`;
};
const out = "shots/verify";
await mkdir(out, { recursive: true });

const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });
const acts = await p.evaluate(() => window.__director.acts);
const actAt = (progress) => [...acts].reverse().find((a) => progress >= a.startProgress - 1e-6) ?? acts[0];

const rows = [];
for (let pct = 0; pct <= 100 + 1e-9; pct += step) {
  const r = await p.evaluate(async (pct) => {
    const d = window.__director;
    const t = document.querySelector(".scene-track");
    const len = t.offsetHeight - innerHeight;
    window.scrollTo(0, Math.round((pct / 100) * len));
    await new Promise((res) => setTimeout(res, 220));
    const scroll = (window.scrollY - t.offsetTop) / len; // what we actually reached
    return {
      scroll,
      progress: d.progressFromScroll(scroll),
      clock: document.querySelector(".hud-clock").textContent,
      chip: document.querySelector(".scrubber-stop[aria-current]")?.dataset.act ?? "",
    };
  }, pct);
  const expectedClock = fmt(timeAt(r.progress));
  const expectedAct = actAt(r.progress).id;
  rows.push({ pct, ...r, expectedClock, expectedAct, ok: r.clock === expectedClock && r.chip === expectedAct });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("scroll %", 9)}${pad("progress", 10)}${pad("clock shown", 13)}${pad("act", 8)}${pad("expected", 11)}${pad("exp act", 9)}ok`);
for (const r of rows) {
  console.log(
    `${pad(r.pct.toFixed(0), 9)}${pad(r.progress.toFixed(4), 10)}${pad(r.clock, 13)}${pad(r.chip, 8)}${pad(r.expectedClock, 11)}${pad(r.expectedAct, 9)}${r.ok ? "yes" : "MISMATCH"}`,
  );
}
const bad = rows.filter((r) => !r.ok);
console.log(`\n${rows.length - bad.length}/${rows.length} steps match`);

// Screenshot every act start.
console.log("\nact starts:");
for (const a of acts) {
  const clock = await p.evaluate(async (start) => {
    const d = window.__director;
    const t = document.querySelector(".scene-track");
    window.scrollTo(0, Math.round(d.scrollFromProgress(start) * (t.offsetHeight - innerHeight)));
    await new Promise((res) => setTimeout(res, 700));
    return document.querySelector(".hud-clock").textContent;
  }, a.startProgress);
  await p.screenshot({ path: `${out}/${a.id}.png` });
  console.log(`  ${pad(a.id, 8)} start ${a.startProgress.toFixed(2)}  clock ${pad(clock, 9)} expected ${fmt(timeAt(a.startProgress))}`);
}

// Click every chip (Lenis eased scrollTo) and read where it lands.
console.log("\nchip jumps:");
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(600);
for (const a of acts) {
  await p.click(`.scrubber-stop[data-act="${a.id}"]`);
  await p.waitForTimeout(4200);
  const clock = await p.evaluate(() => document.querySelector(".hud-clock").textContent);
  console.log(`  ${pad(a.label, 11)} -> clock ${pad(clock, 9)} expected ${fmt(timeAt(a.anchor))} ${clock === fmt(timeAt(a.anchor)) ? "yes" : "MISMATCH"}`);
}

// Contact sheet of the act starts.
const imgs = await Promise.all(acts.map(async (a) => (await readFile(`${out}/${a.id}.png`)).toString("base64")));
await p.setViewportSize({ width: 4 * 488 + 8, height: 800 });
await p.setContent(`<body style="margin:0;padding:4px;background:#111;font:13px monospace;color:#eee;display:grid;grid-template-columns:repeat(4,480px);gap:8px">${acts.map((a, i) => `<figure style="margin:0"><img src="data:image/png;base64,${imgs[i]}" style="width:480px;display:block"><figcaption>${a.id} start ${a.startProgress}</figcaption></figure>`).join("")}</body>`);
await p.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await b.close();
process.exit(bad.length ? 1 : 0);
