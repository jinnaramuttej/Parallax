import { gsap, SplitText } from "@/lib/gsap";
import { CAPTIONS, SAFE_ZONES, ZONES, type Caption, type Zone } from "@/config/captions";
import { dayStore } from "../dayStore";
import { seeded } from "../random";
import { shake } from "./fx";
import type { BuildContext } from "./master";
import { viewport } from "../viewport";

type Rect = { x: number; y: number; w: number; h: number };
/** A keep-out area and how bad covering it is (face and HUD far worse than a screen edge). */
type Zoned = Rect & { weight: number };
type Placed = { id: string; rect: Rect; zone: string };

const MARGIN = 12;
/** Room the face keeps clear around it, in px. */
const FACE_PAD = 10;

const toRect = (r: DOMRect): Rect => ({ x: r.left, y: r.top, w: r.width, h: r.height });
const pad = (r: Rect, p: number): Rect => ({ x: r.x - p, y: r.y - p, w: r.w + p * 2, h: r.h + p * 2 });
const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

function visible(el: Element | null | undefined) {
  if (!el) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== "hidden" && Number(cs.opacity) > 0.02 && cs.display !== "none";
}

/** Captions director: places captions clear of face, screens and HUD; scrubs scrolled captions; shows voice balloons. */
export type CaptionDirector = {
  update: (progress: number) => void;
  showBalloon: (id: string, opts?: { duration?: number }) => { hide: () => void };
  hideBalloon: (id?: string) => void;
  placements: () => Placed[];
};

let current: CaptionDirector | null = null;

/** Show a speech balloon by id (the voice lines' balloons). Safe to call any time. */
export function showBalloon(id: string, opts?: { duration?: number }) {
  return current?.showBalloon(id, opts) ?? { hide: () => {} };
}
export function hideBalloon(id?: string) {
  current?.hideBalloon(id);
}

declare global {
  interface Window {
    __captions?: { showBalloon: typeof showBalloon; hideBalloon: typeof hideBalloon; placements: () => Placed[] };
  }
}

export function buildCaptions({ tl, stage, q, reduce, cleanup }: BuildContext): CaptionDirector {
  const placed = new Map<string, Placed>();
  const active = new Set<string>();
  const nodes = new Map<string, { el: HTMLElement; inner: HTMLElement; layer: HTMLElement; cap?: Caption }>();

  for (const el of q("[data-cap]") as HTMLElement[]) {
    const id = el.dataset.cap ?? "";
    nodes.set(id, {
      el,
      inner: el.querySelector<HTMLElement>("[data-cap-inner]")!,
      layer: el.closest<HTMLElement>("[data-cap-layer]")!,
      cap: CAPTIONS.find((c) => c.id === id),
    });
  }

  // ---------------------------------------------------------------- zones
  function forbidden(except?: string): Zoned[] {
    const out: Zoned[] = [];
    const add = (r: Rect, weight: number) => out.push({ ...r, weight });
    // His face (the head circle; the head group's box would include props like flying headphones).
    const face = stage.querySelector("[data-face]");
    if (face) add(pad(toRect(face.getBoundingClientRect()), FACE_PAD), 10);
    // The screens' visible areas (their content overflows under a clip path).
    for (const el of stage.querySelectorAll("[data-screen-rect]")) add(toRect(el.getBoundingClientRect()), 1);
    const overlay = stage.querySelector('[data-el="anime-overlay"]');
    if (visible(overlay)) add(toRect(overlay!.getBoundingClientRect()), 1);
    for (const sel of [".hud", ".scrubber", "[data-sound-button]", "[data-el='standup-toast']", ".autoplay-controls"]) {
      const el = document.querySelector(sel);
      if (visible(el)) add(pad(toRect(el!.getBoundingClientRect()), 6), 10);
    }
    for (const p of placed.values()) if (p.id !== except) add(pad(p.rect, 8), 3);
    return out;
  }

  type Frame = { left: number; top: number; scale: number };

  /** Layer px per screen px, and its screen origin (one rect read). */
  function layerFrame(layer: HTMLElement): Frame {
    const r = layer.getBoundingClientRect();
    // The layer is the 1600x900 canvas at --s; its own width never changes between resizes.
    return { left: r.left, top: r.top, scale: r.width / (1600 * viewport.s || 1) };
  }

  /** A caption's own size in layer px, measured once (its text never changes). */
  const sizes = new WeakMap<HTMLElement, { w: number; h: number }>();
  function dims(el: HTMLElement) {
    let d = sizes.get(el);
    if (!d) {
      d = { w: el.offsetWidth, h: el.offsetHeight };
      sizes.set(el, d);
    }
    return d;
  }
  const onResize = () => {
    for (const n of nodes.values()) sizes.delete(n.el);
  };
  window.addEventListener("resize", onResize);
  cleanup.push(() => window.removeEventListener("resize", onResize));

  /** Put a caption's centre at a screen point (outer element: x, y, scale only). */
  function setCentre(n: { el: HTMLElement; layer: HTMLElement }, cx: number, cy: number, counter: number, glide = false, frame?: Frame) {
    const f = frame ?? layerFrame(n.layer);
    const { w, h } = dims(n.el);
    const to = { x: (cx - f.left) / f.scale - w / 2, y: (cy - f.top) / f.scale - h / 2, scale: counter, transformOrigin: "50% 50%" };
    if (glide && !reduce) gsap.to(n.el, { ...to, duration: 0.45, ease: "power2.out", overwrite: "auto" });
    else gsap.set(n.el, { ...to, overwrite: "auto" });
  }

  /** Captions keep a steady size on screen when the camera zooms in. */
  function counterScale(f: Frame) {
    return 1 / Math.sqrt(Math.max(0.5, f.scale));
  }

  /** On-screen size of a caption, including the box its tilt sweeps. */
  function screenSize(n: { el: HTMLElement; layer: HTMLElement; cap?: Caption }, counter: number, frame?: Frame) {
    const f = frame ?? layerFrame(n.layer);
    const d = dims(n.el);
    const w = d.w * f.scale * counter;
    const h = d.h * f.scale * counter;
    const a = (Math.abs(n.cap?.rotation ?? 0) * Math.PI) / 180;
    return { w: w * Math.cos(a) + h * Math.sin(a), h: w * Math.sin(a) + h * Math.cos(a) };
  }

  /** Keep a rect inside the stage. */
  function clampRect(cx: number, cy: number, size: { w: number; h: number }): Rect {
    const sr = stage.getBoundingClientRect();
    const x = Math.min(Math.max(cx - size.w / 2, sr.left + MARGIN), sr.right - MARGIN - size.w);
    const y = Math.min(Math.max(cy - size.h / 2, sr.top + MARGIN), sr.bottom - MARGIN - size.h);
    return { x, y, w: size.w, h: size.h };
  }

  const score = (rect: Rect, bad: Zoned[]) => bad.reduce((s, b) => s + overlap(rect, b) * b.weight, 0);

  function pick(id: string, candidates: { zone: string; cx: number; cy: number }[], size: { w: number; h: number }) {
    const bad = forbidden(id);
    let best: { zone: string; rect: Rect; score: number } | null = null;
    for (const c of candidates) {
      const rect = clampRect(c.cx, c.cy, size);
      const sc = score(rect, bad);
      if (!best || sc < best.score) best = { zone: c.zone, rect, score: sc };
      if (sc === 0) break;
    }
    return best!;
  }

  /** The caption's anchors, then the act's safe zones, then every other zone. */
  function zoneList(cap: Caption): Zone[] {
    const first = [...(cap.anchors ?? []), ...SAFE_ZONES[cap.act]];
    const rest = (Object.keys(ZONES) as Zone[]).filter((z) => !first.includes(z));
    return [...new Set([...first, ...rest])];
  }

  function placeScrolled(n: { el: HTMLElement; inner: HTMLElement; layer: HTMLElement; cap?: Caption }, glide = false) {
    const cap = n.cap!;
    if (cap.type === "balloon") return placeBalloon(n, cap.id);
    const sr = stage.getBoundingClientRect();
    const f = layerFrame(n.layer);
    let counter = counterScale(f);
    let size = screenSize(n, counter, f);
    // Narrow screens: shrink long words until they fit across the stage.
    const room = sr.width - MARGIN * 2;
    if (size.w > room) {
      counter *= room / size.w;
      size = screenSize(n, counter, f);
    }
    const choice = pick(
      cap.id,
      zoneList(cap).map((z) => ({ zone: z, cx: sr.left + ZONES[z][0] * sr.width, cy: sr.top + ZONES[z][1] * sr.height })),
      size,
    );
    setCentre(n, choice.rect.x + size.w / 2, choice.rect.y + size.h / 2, counter, glide, f);
    placed.set(cap.id, { id: cap.id, rect: choice.rect, zone: choice.zone });
    lastMove.set(cap.id, performance.now());
    drawDebug();
  }

  /**
   * While a caption is up, the camera keeps moving under it. If it now
   * covers something it must not, glide it to the best clear zone.
   */
  const lastMove = new Map<string, number>();
  function recheck(n: { el: HTMLElement; inner: HTMLElement; layer: HTMLElement; cap?: Caption }) {
    const id = n.cap!.id;
    const t = performance.now();
    // At most ~3 checks a second (each one reads a dozen rects).
    if (t - (lastMove.get(id) ?? 0) < 350) return;
    lastMove.set(id, t);
    const body = n.el.querySelector(".cap-body");
    if (!body) return;
    const now = toRect(body.getBoundingClientRect());
    const p = placed.get(id);
    if (p) placed.set(id, { ...p, rect: now });
    if (score(now, forbidden(id)) > 600) placeScrolled(n, true);
  }

  // -------------------------------------------------------------- balloons
  const balloonSide = new Map<string, string>();

  const lastCheck = new Map<string, number>();
  const face = () => stage.querySelector("[data-face]");

  function placeBalloon(n: { el: HTMLElement; layer: HTMLElement }, id: string, keepSide = false) {
    const head = face();
    if (!head) return;
    const h = head.getBoundingClientRect();
    const f = layerFrame(n.layer);
    const counter = counterScale(f);
    const size = screenSize(n, counter, f);
    const gap = 18;
    const all = [
      { zone: "above-right", cx: h.right + size.w / 2 - h.width * 0.15, cy: h.top - size.h / 2 - gap },
      { zone: "above-left", cx: h.left - size.w / 2 + h.width * 0.15, cy: h.top - size.h / 2 - gap },
      { zone: "right", cx: h.right + size.w / 2 + gap * 2, cy: h.top + h.height * 0.2 - size.h / 2 },
      { zone: "left", cx: h.left - size.w / 2 - gap * 2, cy: h.top + h.height * 0.2 - size.h / 2 },
      { zone: "above", cx: h.left + h.width / 2, cy: h.top - size.h / 2 - gap * 2 },
    ];
    // Keep the side it is on while it stays clear; otherwise pick again.
    let choice: { zone: string; rect: Rect } | null = null;
    if (keepSide) {
      const k = all.find((c) => c.zone === balloonSide.get(id));
      if (k) {
        const rect = clampRect(k.cx, k.cy, size);
        // The full keep-out check is costly; while following, run it ~3 times a second.
        const now = performance.now();
        if (now - (lastCheck.get(id) ?? 0) < 320) choice = { zone: k.zone, rect };
        else {
          lastCheck.set(id, now);
          if (score(rect, forbidden(id)) < 600) choice = { zone: k.zone, rect };
        }
      }
    }
    choice ??= pick(id, all, size);
    balloonSide.set(id, choice.zone);
    const cx = choice.rect.x + size.w / 2;
    const cy = choice.rect.y + size.h / 2;
    setCentre(n, cx, cy, counter, false, f);
    placed.set(id, { id, rect: choice.rect, zone: choice.zone });

    // Tail: from the balloon's edge toward his mouth, drawn in the balloon's own px.
    const path = n.el.querySelector<SVGPathElement>("[data-cap-tail]");
    if (path) {
      const k = f.scale * counter;
      const { w, h: hh } = dims(n.el);
      const mouth = { x: h.left + h.width * 0.7, y: h.top + h.height * 0.62 };
      let tx = (mouth.x - cx) / k;
      let ty = (mouth.y - cy) / k;
      const dist = Math.hypot(tx, ty) || 1;
      const ux = tx / dist;
      const uy = ty / dist;
      // Edge of the balloon (an ellipse) along that direction.
      const rx = w / 2;
      const ry = hh / 2;
      const r = (rx * ry) / Math.sqrt((ry * ux) ** 2 + (rx * uy) ** 2);
      const reach = Math.min(dist - 14 / k, r + 70);
      tx = ux * reach;
      ty = uy * reach;
      const base = Math.min(w, hh) * 0.22;
      const bx = ux * (r - 8);
      const by = uy * (r - 8);
      const ox = -uy * base;
      const oy = ux * base;
      const c = (v: number) => v.toFixed(1);
      path.setAttribute(
        "d",
        `M${c(w / 2 + bx + ox)} ${c(hh / 2 + by + oy)}Q${c(w / 2 + (bx + tx) / 2 + ox * 0.2)} ${c(hh / 2 + (by + ty) / 2 + oy * 0.2)} ${c(w / 2 + tx)} ${c(hh / 2 + ty)}Q${c(w / 2 + (bx + tx) / 2 - ox * 0.6)} ${c(hh / 2 + (by + ty) / 2 - oy * 0.6)} ${c(w / 2 + bx - ox)} ${c(hh / 2 + by - oy)}Z`,
      );
    }
    if (!keepSide) drawDebug();
  }

  // ----------------------------------------------------- scrubbed captions
  const enterDur = (c: Caption) => Math.min(0.006, (c.exit - c.enter) * 0.35);
  const exitDur = (c: Caption) => Math.min(0.004, (c.exit - c.enter) * 0.25);

  for (const [id, n] of nodes) {
    const cap = n.cap;
    if (!cap) continue;
    const rand = seeded(id.length * 97 + id.charCodeAt(0));
    let chars: Element[] = [];
    const text = n.el.querySelector("[data-cap-text]");
    if (cap.type === "impact" && text) {
      const split = SplitText.create(text, { type: "chars", charsClass: "cap-char" });
      cleanup.push(() => split.revert());
      chars = split.chars;
      // Comic lettering: every letter sits a little off, seeded so it never changes.
      chars.forEach((ch) => gsap.set(ch, { rotation: (rand() * 2 - 1) * 7, yPercent: (rand() * 2 - 1) * 7 }));
    }

    const d = enterDur(cap);
    const e = exitDur(cap);
    const rot = cap.rotation;
    gsap.set(n.inner, { rotation: rot, skewX: cap.type === "box" ? -6 : 0 });
    tl.set(n.el, { autoAlpha: 1 }, cap.enter);

    if (reduce) {
      tl.fromTo(n.inner, { opacity: 0 }, { opacity: 1, duration: d, immediateRender: false }, cap.enter);
    } else if (cap.entrance === "pop") {
      tl.fromTo(
        n.inner,
        { scale: 0.3, opacity: 0, rotation: rot - 14 },
        { scale: 1, opacity: 1, rotation: rot, duration: d, ease: "back.out(3)", immediateRender: false },
        cap.enter,
      );
    } else if (cap.entrance === "shake") {
      tl.fromTo(n.inner, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: d * 0.4, ease: "back.out(2)", immediateRender: false }, cap.enter);
      const steps = 8;
      for (let i = 0; i < steps; i++) {
        const amp = 10 * (1 - i / steps);
        tl.to(n.inner, { x: i % 2 ? -amp : amp, y: i % 2 ? amp * 0.4 : -amp * 0.4, duration: (d * 1.2) / steps, ease: "sine.inOut" }, cap.enter + d * 0.3 + (i * d * 1.2) / steps);
      }
      tl.to(n.inner, { x: 0, y: 0, duration: d * 0.15 }, cap.enter + d * 1.5);
    } else if (cap.entrance === "stamp") {
      tl.fromTo(
        n.inner,
        { scale: 2.8, opacity: 0, rotation: rot + 6 },
        { scale: 1, opacity: 1, rotation: rot, duration: d * 0.5, ease: "power4.in", immediateRender: false },
        cap.enter,
      );
      tl.to(n.inner, { scaleX: 1.08, scaleY: 0.86, duration: d * 0.12, ease: "power2.out" }, cap.enter + d * 0.5);
      tl.to(n.inner, { scaleX: 1, scaleY: 1, duration: d * 0.3, ease: "back.out(3)" }, cap.enter + d * 0.62);
      shake(tl, q('[data-el="shake"]')[0], cap.enter + d * 0.5, d * 0.6, 5, id.length);
    } else if (cap.entrance === "scatter") {
      tl.fromTo(n.inner, { opacity: 0 }, { opacity: 1, duration: d * 0.2, immediateRender: false }, cap.enter);
      const targets = chars.length ? chars : [n.inner];
      targets.forEach((ch, i) => {
        const base = { rotation: Number(gsap.getProperty(ch, "rotation")) || 0, yPercent: Number(gsap.getProperty(ch, "yPercent")) || 0 };
        tl.fromTo(
          ch,
          { xPercent: (rand() * 2 - 1) * 500, yPercent: (rand() * 2 - 1) * 300, rotation: (rand() * 2 - 1) * 120, opacity: 0 },
          { xPercent: 0, yPercent: base.yPercent, rotation: base.rotation, opacity: 1, duration: d, ease: i % 3 === 0 ? "bounce.out" : "back.out(2)", immediateRender: false },
          cap.enter + (i * d * 0.6) / targets.length,
        );
      });
    }

    tl.to(n.inner, { opacity: 0, y: -16, scale: 0.94, duration: e, ease: "power1.in" }, Math.min(1, cap.exit) - e);
    tl.set(n.el, { autoAlpha: 0 }, Math.min(1, cap.exit));
  }

  function update(progress: number) {
    const isOn = (cap: Caption) => progress >= cap.enter - 0.0005 && progress <= Math.min(1, cap.exit) + 0.0005;
    // Clear captions that went off first, so a jump across the day never
    // places a new caption around one that is about to disappear.
    for (const [id, n] of nodes) {
      if (n.cap && !isOn(n.cap) && active.has(id)) {
        active.delete(id);
        placed.delete(id);
      }
    }
    for (const [id, n] of nodes) {
      const cap = n.cap;
      if (!cap || !isOn(cap)) continue;
      if (!active.has(id)) {
        active.add(id);
        placeScrolled(n);
      } else if (cap.type !== "balloon") {
        recheck(n);
      }
    }
    drawDebug();
  }

  // ------------------------------------------------------- voice balloons
  let shown: string | null = null;
  let follow: (() => void) | null = null;
  let hideTimer = 0;

  function hideBalloonNow(id?: string) {
    const target = id ?? shown;
    if (!target) return;
    const n = nodes.get(target);
    if (follow && target === shown) {
      gsap.ticker.remove(follow);
      follow = null;
    }
    if (target === shown) shown = null;
    window.clearTimeout(hideTimer);
    placed.delete(target);
    drawDebug();
    if (!n) return;
    gsap.to(n.inner, {
      opacity: 0,
      scale: reduce ? 1 : 0.9,
      duration: 0.22,
      ease: "power1.in",
      overwrite: true,
      onComplete: () => {
        gsap.set(n.el, { autoAlpha: 0 });
      },
    });
  }

  function showBalloonNow(id: string, opts?: { duration?: number }) {
    const n = nodes.get(id);
    if (!n) return { hide: () => {} };
    if (shown && shown !== id) hideBalloonNow(shown);
    shown = id;
    gsap.set(n.el, { autoAlpha: 1 });
    placeBalloon(n, id);
    gsap.fromTo(
      n.inner,
      reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotation: -6 },
      { opacity: 1, scale: 1, rotation: 0, duration: reduce ? 0.2 : 0.38, ease: reduce ? "none" : "back.out(2.6)", overwrite: true },
    );
    // Follow his head while it is up (he may be walking).
    // Only when the day moves: while it holds still (autoplay waiting on a
    // line), he does not move either, so there is nothing to measure.
    let lastP = dayStore.get();
    let lastW = window.innerWidth;
    follow = () => {
      const p = dayStore.get();
      if (p === lastP && window.innerWidth === lastW) return;
      lastP = p;
      lastW = window.innerWidth;
      placeBalloon(n, id, true);
    };
    gsap.ticker.add(follow);
    if (opts?.duration) hideTimer = window.setTimeout(() => hideBalloonNow(id), opts.duration);
    return { hide: () => hideBalloonNow(id) };
  }

  // ---------------------------------------------------------- debug (D)
  let debugOn = false;
  const debug = document.createElement("div");
  debug.className = "cap-debug";
  debug.hidden = true;
  stage.appendChild(debug);
  cleanup.push(() => debug.remove());

  function box(r: Rect, cls: string, label = "") {
    const sr = stage.getBoundingClientRect();
    return `<div class="${cls}" style="left:${r.x - sr.left}px;top:${r.y - sr.top}px;width:${r.w}px;height:${r.h}px">${label}</div>`;
  }

  function drawDebug() {
    if (!debugOn) return;
    const sr = stage.getBoundingClientRect();
    const zones = Object.entries(ZONES)
      .map(([name, [fx, fy]]) => `<div class="cap-debug-zone" style="left:${fx * sr.width}px;top:${fy * sr.height}px">${name}</div>`)
      .join("");
    const bad = forbidden("__none__").filter((r) => ![...placed.values()].some((p) => p.rect === r));
    debug.innerHTML =
      zones +
      bad.map((r) => box(r, "cap-debug-bad")).join("") +
      [...placed.values()].map((p) => box(p.rect, "cap-debug-ok", `${p.id} @ ${p.zone}`)).join("");
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() !== "d" || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    debugOn = !debugOn;
    debug.hidden = !debugOn;
    drawDebug();
  };
  window.addEventListener("keydown", onKey);
  const debugTick = window.setInterval(() => debugOn && drawDebug(), 400);
  cleanup.push(() => {
    window.removeEventListener("keydown", onKey);
    window.clearInterval(debugTick);
    hideBalloonNow();
  });

  const director: CaptionDirector = {
    update,
    showBalloon: showBalloonNow,
    hideBalloon: hideBalloonNow,
    placements: () => [...placed.values()],
  };
  current = director;
  window.__captions = { showBalloon, hideBalloon, placements: director.placements };
  cleanup.push(() => {
    if (current === director) current = null;
  });
  return director;
}
