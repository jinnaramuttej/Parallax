// Screenshot the prop gallery (/dev/gallery): one full-page image, plus one
// image per section when --sections is passed.
//   node scripts/gallery.mjs [out.png] [--sections]
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:3000";
const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith("--")) ?? "shots/gallery.png";
const sections = args.includes("--sections");

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`${URL}/dev/gallery`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: out, fullPage: true });
console.log(`wrote ${out}`);

if (sections) {
  const handles = await page.$$("main > section");
  for (const [i, h] of handles.entries()) {
    const title = (await h.$eval("h2", (n) => n.textContent ?? "")).replace(/\W+/g, "-").toLowerCase();
    const file = out.replace(/\.png$/, `-${i}-${title}.png`);
    await h.screenshot({ path: file });
    console.log(`wrote ${file}`);
  }
}
console.log(`cards: ${await page.$$eval("[data-card]", (n) => n.length)}`);
console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "console errors: none");
await browser.close();
