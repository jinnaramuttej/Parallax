// Five frames per act (start, 25%, 50%, 75%, end), one filmstrip per act,
// plus the scroll length each act gets and any console errors.
//   node scripts/act-frames.mjs [outDir] [--viewport mobile] [--acts id,id]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--")) ?? "shots/acts";
const mobile = args.includes("mobile");
const only = args.includes("--acts") ? args[args.indexOf("--acts") + 1].split(",") : null;
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector("[data-loader][data-done]", { state: "attached", timeout: 20000 });

const { acts, vh } = await page.evaluate(() => ({ acts: window.__director.acts, vh: window.__director.actScrollVh }));
const scale = mobile ? 0.5 : 0.3;
for (const act of acts) {
  if (only && !only.includes(act.id)) continue;
  const frames = [];
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    const pr = Math.min(0.9999, act.startProgress + f * (act.endProgress - act.startProgress) - (f === 1 ? 0.0015 : 0));
    const clock = await page.evaluate(async (pr) => {
      const d = window.__director;
      const t = document.querySelector(".scene-track");
      window.scrollTo(0, Math.round(d.scrollFromProgress(pr) * (t.offsetHeight - innerHeight)));
      await new Promise((r) => setTimeout(r, 500));
      return document.querySelector(".hud-clock")?.textContent ?? "";
    }, pr);
    frames.push({ label: `${Math.round(f * 100)}% · ${pr.toFixed(3)} · ${clock}`, b64: (await page.screenshot()).toString("base64") });
  }
  const vp = page.viewportSize();
  const w = Math.round(vp.width * scale);
  const h = Math.round(vp.height * scale);
  const strip = await browser.newPage({ viewport: { width: 5 * (w + 6) + 6, height: h + 44 } });
  await strip.setContent(
    `<body style="margin:0;padding:3px;background:#111;color:#eee;font:12px monospace">
      <div>${act.id} (${act.label})</div>
      <div style="display:flex;gap:6px">${frames
        .map((fr) => `<figure style="margin:0"><img src="data:image/png;base64,${fr.b64}" style="display:block;width:${w}px;height:${h}px"><figcaption>${fr.label}</figcaption></figure>`)
        .join("")}</div></body>`,
  );
  const file = `${outDir}/${String(acts.indexOf(act)).padStart(2, "0")}-${act.id}${mobile ? "-mobile" : ""}.png`;
  await strip.screenshot({ path: file, fullPage: true });
  await strip.close();
  console.log(`wrote ${file}`);
}
console.log("scroll per act (vh):", vh.map((a) => `${a.id} ${a.vh.toFixed(0)}`).join(", "));
console.log(errors.length ? `console errors:\n${[...new Set(errors)].join("\n")}` : "console errors: none");
await browser.close();
