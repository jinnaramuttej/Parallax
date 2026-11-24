// Crop regions of screenshots into one image for close inspection.
//   node scripts/crop.mjs out.png file.png:x,y,w,h [file2.png:x,y,w,h ...]
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
const [out, ...specs] = process.argv.slice(2);
const parts = await Promise.all(specs.map(async (s) => {
  const [file, rect] = s.split(/:(?=[\d,]+$)/);
  const [x, y, w, h] = rect.split(",").map(Number);
  return { b64: (await readFile(file)).toString("base64"), x, y, w, h, file };
}));
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.setContent(`<body style="margin:0;background:#111;display:flex;flex-wrap:wrap;gap:6px;padding:6px">${parts.map((q) => `<div style="width:${q.w}px;height:${q.h}px;overflow:hidden;position:relative"><img src="data:image/png;base64,${q.b64}" style="position:absolute;left:${-q.x}px;top:${-q.y}px"></div>`).join("")}</body>`);
await p.screenshot({ path: out, fullPage: true });
await b.close();
