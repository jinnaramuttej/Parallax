"use client";

import { useEffect, useRef } from "react";
import { dayStore } from "../dayStore";
import { DEPLOY_SUCCESS_AT } from "../story";
import { TOTAL } from "../timing";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
};

const COLORS = ["--can", "--sun", "--accent", "--window-cool", "--paper", "--error"];

/**
 * Lightweight canvas confetti. Fires once each time the scroll crosses the
 * moment the deploy goes green, runs ~3 s, then stops its loop entirely.
 * Skipped for reduced motion.
 */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let pieces: Piece[] = [];
    let raf = 0;
    let last = 0;

    const fire = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const styles = getComputedStyle(document.documentElement);
      const colors = COLORS.map((c) => styles.getPropertyValue(c).trim());
      const origin = document.querySelector('[data-hotspot="monitor"]')?.getBoundingClientRect();
      const ox = origin ? origin.left + origin.width / 2 : innerWidth / 2;
      const oy = origin ? origin.top + origin.height / 2 : innerHeight / 2;
      for (let i = 0; i < 150; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const speed = 7 + Math.random() * 11;
        pieces.push({
          x: ox,
          y: oy,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          color: colors[i % colors.length],
          life: 0,
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      pieces = pieces.filter((p) => p.y < innerHeight + 40 && p.life < 240);
      for (const p of pieces) {
        p.vy += 0.32;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.scale(1, Math.cos(p.life * 0.18));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      raf = pieces.length ? requestAnimationFrame(tick) : 0;
    };

    last = dayStore.get();
    const at = DEPLOY_SUCCESS_AT / TOTAL;
    const off = dayStore.subscribe((p) => {
      if (last < at && p >= at) fire();
      last = p;
    });
    return () => {
      off();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="confetti" aria-hidden />;
}
