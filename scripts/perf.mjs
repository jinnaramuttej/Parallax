// Performance trace while scrolling the whole day with the mouse wheel
// (through Lenis, like a user). Headed Chrome so the GPU is real.
// Reports FPS, frame-time percentiles, long tasks, layout shifts, and which
// DOM nodes repaint most (from the DevTools timeline trace).
//   node scripts/perf.mjs [--dpr 2] [--out shots/perf-before.json] [--autoplay 60] [--profile]
// --profile adds the CPU sampler (self time and callers) but slows frames down.
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const dpr = Number(arg("--dpr", 1));
const b = await chromium.launch({
  channel: "chrome",
  headless: false,
  // Keep frames coming even if the window is behind others (Windows throttles occluded windows).
  args: ["--window-size=1460,1000", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"],
});
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: dpr });
const p = await ctx.newPage();
await p.goto(process.env.URL ?? "http://localhost:3100", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.querySelector("[data-loader][data-done]"), null, { timeout: 20000 });
await p.waitForTimeout(500);
await p.evaluate(() => {
  window.__perf = { frames: [], long: [], cls: 0, loadCls: 0, start: performance.now() };
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__perf.long.push(Math.round(e.duration)); (window.__perf.longAt ??= []).push(`${Math.round(e.duration)}ms at ${document.querySelector(".hud-clock")?.textContent} (scrollY ${Math.round(scrollY)})`); })).observe({ type: "longtask", buffered: false });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.hadRecentInput) return; if (e.startTime < window.__perf.start) window.__perf.loadCls += e.value; else window.__perf.cls += e.value; })).observe({ type: "layout-shift", buffered: true });
  let last = performance.now();
  const loop = (t) => { window.__perf.frames.push(t - last); last = t; if (!window.__perf.stop) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
const cdp = await ctx.newCDPSession(p);
await cdp.send("DOM.enable");
await cdp.send("DOM.getDocument", { depth: -1 });
const events = [];
cdp.on("Tracing.dataCollected", (d) => events.push(...d.value));
const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
await cdp.send("Tracing.start", { categories: `devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,disabled-by-default-devtools.timeline.stack,disabled-by-default-devtools.timeline.invalidationTracking,blink.user_timing${process.argv.includes("--profile") ? ",disabled-by-default-v8.cpu_profiler" : ""}`, transferMode: "ReportEvents" });
const autoplaySeconds = Number(arg("--autoplay", 0));
if (autoplaySeconds) {
  // Autoplay: press "Play the day" and record for that many seconds.
  await p.click(".intro-play");
  await p.waitForTimeout(autoplaySeconds * 1000);
} else {
  await p.mouse.move(720, 450);
  const total = await p.evaluate(() => document.querySelector(".scene-track").offsetHeight - innerHeight);
  const t0 = Date.now();
  while ((await p.evaluate(() => scrollY)) < total - 50 && Date.now() - t0 < 60000) {
    await p.mouse.wheel(0, 100);
    await p.waitForTimeout(16);
  }
}
await p.waitForTimeout(800);
await cdp.send("Tracing.end");
await done;
const perf = await p.evaluate(() => { window.__perf.stop = true; return window.__perf; });
const frames = perf.frames.slice(5).filter((f) => f < 1000).sort((a, c) => a - c);
const pct = (q) => frames[Math.min(frames.length - 1, Math.floor(q * frames.length))];
const avg = frames.reduce((s, f) => s + f, 0) / frames.length;
// Trace summary.
const count = (n) => events.filter((e) => e.name === n && e.ph !== "E").length;
const dur = (n) => events.filter((e) => e.name === n && e.dur).reduce((s, e) => s + e.dur, 0) / 1000;
const paintsByNode = {};
for (const e of events) {
  if (e.name !== "Paint") continue;
  const id = e.args?.data?.nodeId;
  if (id) paintsByNode[id] = (paintsByNode[id] ?? 0) + 1;
}
const top = Object.entries(paintsByNode).sort((a, c) => c[1] - a[1]).slice(0, 8);
const described = [];
for (const [id, n] of top) {
  try {
    const { node } = await cdp.send("DOM.describeNode", { backendNodeId: Number(id) });
    const attrs = Object.fromEntries((node.attributes ?? []).reduce((acc, v, i, a) => (i % 2 ? acc : [...acc, [v, a[i + 1]]]), []));
    described.push(`${n} paints  <${node.localName}${attrs["data-parallax-speed"] ? ` data-parallax-speed=${attrs["data-parallax-speed"]}` : ""}${attrs["data-el"] ? ` data-el=${attrs["data-el"]}` : ""}${attrs.class ? ` class="${attrs.class.slice(0, 40)}"` : ""}>`);
  } catch { described.push(`${n} paints  node ${id} (gone)`); }
}
// Which nodes are layout roots, and how big are style recalcs.
const layoutRoots = {};
for (const e of events) {
  if (e.name !== "Layout" || e.ph === "E") continue;
  const id = e.args?.endData?.rootNode ?? e.args?.endData?.layoutRoots?.[0]?.nodeId;
  if (id) layoutRoots[id] = (layoutRoots[id] ?? 0) + 1;
}
const describe = async (id) => {
  try {
    const { node } = await cdp.send("DOM.describeNode", { backendNodeId: Number(id) });
    const a = Object.fromEntries((node.attributes ?? []).reduce((acc, v, i, arr) => (i % 2 ? acc : [...acc, [v, arr[i + 1]]]), []));
    return `<${node.localName || node.nodeName}${a["data-el"] ? ` data-el=${a["data-el"]}` : ""}${a["data-parallax-speed"] ? ` speed=${a["data-parallax-speed"]}` : ""}${a.class ? ` class="${a.class.slice(0, 30)}"` : ""}>`;
  } catch { return `node ${id}`; }
};
const layoutTop = [];
for (const [id, n] of Object.entries(layoutRoots).sort((a, c) => c[1] - a[1]).slice(0, 6)) layoutTop.push(`${n} layouts  ${await describe(id)}`);
const recalcs = events.filter((e) => e.name === "UpdateLayoutTree" && e.args?.elementCount);
const bigRecalcs = recalcs.filter((e) => e.args.elementCount > 200).length;
const invalidations = {};
for (const e of events) {
  if (!["ScheduleStyleRecalculation", "InvalidateLayout", "StyleRecalcInvalidationTracking", "StyleInvalidatorInvalidationTracking"].includes(e.name)) continue;
  const f = e.args?.data?.stackTrace?.[0];
  const key = `${e.name} ${f ? `${f.functionName || "(anon)"} ${String(f.url).split("/").pop()}:${f.lineNumber}` : ""}`;
  invalidations[key] = (invalidations[key] ?? 0) + 1;
}
// CPU profile: self time per function (from the sampling profiler).
const selfTime = {};
const nodes = new Map();
for (const e of events) {
  if (e.name !== "ProfileChunk") continue;
  const prof = e.args?.data?.cpuProfile;
  if (!prof) continue;
  for (const n of prof.nodes ?? []) nodes.set(n.id, n.callFrame);
  const deltas = e.args.data.timeDeltas ?? [];
  (prof.samples ?? []).forEach((id, i) => {
    const cf = nodes.get(id);
    if (!cf) return;
    const key = `${cf.functionName || "(anon)"} ${String(cf.url || "").split("/").pop()}:${cf.lineNumber}:${cf.columnNumber}`;
    selfTime[key] = (selfTime[key] ?? 0) + (deltas[i] ?? 0) / 1000;
  });
}
// Who calls the hottest native functions (caller frame, by sampled time).
const parents = new Map();
for (const e of events) {
  if (e.name !== "ProfileChunk") continue;
  for (const n of e.args?.data?.cpuProfile?.nodes ?? []) if (n.parent) parents.set(n.id, n.parent);
}
const callers = {};
for (const e of events) {
  if (e.name !== "ProfileChunk") continue;
  const prof = e.args?.data?.cpuProfile;
  const deltas = e.args?.data?.timeDeltas ?? [];
  (prof?.samples ?? []).forEach((id, i) => {
    const cf = nodes.get(id);
    if (!cf || !["getBoundingClientRect", "scrollTo", "setAttribute"].includes(cf.functionName)) return;
    // Walk up to the first frame with a script URL.
    let up = parents.get(id);
    let chain = [];
    while (up && chain.length < 3) {
      const pf = nodes.get(up);
      if (pf?.url) chain.push(`${pf.functionName || "(anon)"}:${String(pf.url).split("/").pop()}:${pf.columnNumber}`);
      up = parents.get(up);
    }
    const key = `${cf.functionName} <- ${chain.join(" <- ")}`;
    callers[key] = (callers[key] ?? 0) + (deltas[i] ?? 0) / 1000;
  });
}
const topCallers = Object.entries(callers).sort((a, c) => c[1] - a[1]).slice(0, 12).map(([k, ms]) => `${ms.toFixed(0)}ms ${k}`);
const topSelf = Object.entries(selfTime).sort((a, c) => c[1] - a[1]).slice(0, 25).map(([k, ms]) => `${ms.toFixed(0)}ms ${k}`);
const report = {
  dpr,
  frames: frames.length,
  avgFps: +(1000 / avg).toFixed(1),
  p50ms: +pct(0.5).toFixed(1),
  p95ms: +pct(0.95).toFixed(1),
  p99ms: +pct(0.99).toFixed(1),
  slowFramesPct: +((frames.filter((f) => f > 20).length / frames.length) * 100).toFixed(1),
  longTasks: perf.long.length,
  longestTaskMs: Math.max(0, ...perf.long),
  longTasksAt: perf.longAt ?? [],
  clsDuringScroll: +perf.cls.toFixed(4),
  clsBeforeScroll: +perf.loadCls.toFixed(4),
  trace: {
    layoutCount: count("Layout"),
    layoutMs: +dur("Layout").toFixed(1),
    styleRecalcCount: count("UpdateLayoutTree"),
    styleRecalcMs: +dur("UpdateLayoutTree").toFixed(1),
    paintCount: count("Paint"),
    paintMs: +dur("Paint").toFixed(1),
    rasterMs: +(dur("RasterTask")).toFixed(1),
    scriptMs: +(dur("FunctionCall") + dur("EvaluateScript")).toFixed(1),
  },
  topRepaints: described,
  layoutRoots: layoutTop,
  styleRecalcsOver200Elements: bigRecalcs,
  maxRecalcElements: Math.max(0, ...recalcs.map((e) => e.args.elementCount)),
  topSelfTime: topSelf,
  topCallers,
  topInvalidations: Object.entries(invalidations).sort((a, c) => c[1] - a[1]).slice(0, 8).map(([k, n]) => `${n}x ${k}`),
};
console.log(JSON.stringify(report, null, 1));
if (arg("--out")) await writeFile(arg("--out"), JSON.stringify(report, null, 1));
await b.close();
