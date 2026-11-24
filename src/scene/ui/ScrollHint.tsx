"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { READY_EVENT } from "./Loader";

/** "Scroll to wake up" hint: appears after loading, fades on the first scroll. */
export function ScrollHint() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let shown = false;
    let gone = false;
    const hide = () => {
      if (gone || window.scrollY < 24) return;
      gone = true;
      gsap.to(el, { autoAlpha: 0, y: 12, duration: 0.4, ease: "power1.in", overwrite: true });
      window.removeEventListener("scroll", hide);
    };
    const show = () => {
      if (shown || gone || window.scrollY > 24) return;
      shown = true;
      gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" });
    };
    window.addEventListener(READY_EVENT, show);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      window.removeEventListener(READY_EVENT, show);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  return (
    <div ref={ref} className="scroll-hint" aria-hidden>
      <span>Scroll to wake up</span>
      <svg viewBox="0 0 24 24" className="scroll-hint-arrow">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
