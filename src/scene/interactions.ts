import { gsap } from "@/lib/gsap";
import { bonusCansStore, dayStore } from "./dayStore";
import { SNIPPETS } from "./layers/MonitorScreen";
import { DESK_SLOTS, FLOOR_SLOTS } from "./props/Cans";
import { FRIDGE_OPEN } from "./story";
import { TOTAL } from "./timing";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const unitNow = () => dayStore.get() * TOTAL;

/**
 * Click and hover interactions on top of the scrubbed scene. These are
 * real-time tweens (not part of the scroll timeline), transform/opacity only.
 */
export function setupInteractions(stage: HTMLElement) {
  const q = gsap.utils.selector(stage);
  const el = (name: string) => q(`[data-el="${name}"]`)[0];
  const offs: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(
    target: Element | undefined,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) => {
    if (!target) return;
    target.addEventListener(type, fn as EventListener);
    offs.push(() => target.removeEventListener(type, fn as EventListener));
  };

  // Fridge: door swings open, light spills, a can drops onto the pile under the desk.
  let dropped = 0;
  on(q('[data-hotspot="fridge"]')[0], "click", () => {
    const u = unitNow();
    const openByStory = u >= FRIDGE_OPEN[0] && u <= FRIDGE_OPEN[1];
    const door = el("fridge-door");
    const spill = el("fridge-spill");
    if (!openByStory && !gsap.isTweening(door)) {
      const hinge = { svgOrigin: "1502 632" };
      gsap
        .timeline()
        .to(door, { ...hinge, scaleX: -0.55, duration: 0.3, ease: "power2.out" })
        .to(spill, { opacity: 0.6, duration: 0.25 }, 0)
        .to(door, { ...hinge, scaleX: 1, duration: 0.35, ease: "power2.in" }, 1.1)
        .to(spill, { opacity: 0, duration: 0.3 }, 1.1);
    }
    if (dropped < FLOOR_SLOTS.length) {
      const [sx, sy] = FLOOR_SLOTS[dropped];
      const can = q(`[data-can="${DESK_SLOTS.length + dropped}"]`)[0];
      const p = { x: 1400 - sx, y: 560 - sy };
      const set = () => can?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      gsap.set(can, { opacity: 1 });
      set();
      const d = reduced() ? 0 : 0.75;
      gsap.to(p, { x: 0, duration: d, ease: "power1.out", delay: 0.2, onUpdate: set });
      gsap.to(p, { y: 0, duration: d, ease: "bounce.out", delay: 0.2, onUpdate: set });
    }
    dropped++;
    bonusCansStore.set(bonusCansStore.get() + 1);
  });

  // Monitor: cycle code snippets (and briefly wake the screen if it's off).
  let snippet = 0;
  on(q('[data-hotspot="monitor"]')[0], "click", () => {
    const prev = q(`[data-snippet="${snippet}"]`)[0];
    snippet = (snippet + 1) % SNIPPETS.length;
    const next = q(`[data-snippet="${snippet}"]`)[0];
    gsap.to(prev, { opacity: 0, duration: 0.12 });
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.2, delay: 0.08 });
    const code = el("screen-code");
    if (Number(gsap.getProperty(code, "opacity")) < 0.5) {
      gsap.timeline().to(code, { opacity: 1, duration: 0.15 }).to(code, { opacity: 0, duration: 0.3 }, 1.6);
    }
  });

  // Mug: a burst of steam.
  on(q('[data-hotspot="mug"]')[0], "click", () => {
    if (reduced()) return;
    q("[data-puff]").forEach((puff, i) => {
      const a = -Math.PI / 2 + (i - 3) * 0.32;
      gsap.fromTo(
        puff,
        { opacity: 0.95, xPercent: 0, yPercent: 0, scale: 0.4 },
        {
          opacity: 0,
          xPercent: Math.cos(a) * 160,
          yPercent: Math.sin(a) * 320,
          scale: 2.2,
          duration: 1 + (i % 3) * 0.15,
          ease: "power2.out",
          overwrite: true,
        },
      );
    });
  });

  // Hover: he looks toward the cursor (head tilt + pupils), unless asleep.
  const hit = q('[data-hit="guy"]')[0];
  const look = q('[data-j="look"]')[0];
  const head = q('[data-j="head"]')[0];
  const face = q('[data-j="face"]')[0];
  const pupil = el("pupil");
  const eyesClosed = el("eyes-closed");
  const gaze = { r: 0, px: 0, py: 0 };
  const applyGaze = () => {
    look?.setAttribute("transform", `rotate(${gaze.r} 4 -30)`);
    pupil?.setAttribute("transform", `translate(${gaze.px} ${gaze.py})`);
  };
  on(hit, "pointermove", (e) => {
    if (!head || Number(gsap.getProperty(eyesClosed, "opacity")) > 0.5) return;
    const box = head.getBoundingClientRect();
    const facing = face?.getAttribute("transform")?.includes("-") ? -1 : 1;
    const dx = (e.clientX - (box.left + box.width / 2)) * facing;
    const dy = e.clientY - (box.top + box.height / 2);
    const deg = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    gsap.to(gaze, {
      r: clamp(deg * 0.35, -14, 14),
      px: clamp(dx / 30, -3, 3),
      py: clamp(dy / 30, -3, 3),
      duration: reduced() ? 0 : 0.3,
      overwrite: true,
      onUpdate: applyGaze,
    });
  });
  on(hit, "pointerleave", () => {
    gsap.to(gaze, { r: 0, px: 0, py: 0, duration: 0.5, overwrite: true, onUpdate: applyGaze });
  });

  return () => offs.forEach((off) => off());
}
