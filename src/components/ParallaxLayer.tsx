"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type RefObject,
} from "react";
import { gsap } from "@/lib/gsap";

type ParallaxLayerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * On-screen speed relative to the scroll.
   * 0 = stuck to the viewport, 1 = scrolls normally,
   * <1 = background (sky, skyline), >1 = foreground.
   */
  speed: number;
  /**
   * Set when the layer lives inside a sticky/pinned stage. The layer is then
   * moved by `speed` x the trigger's scroll length (it does not scroll itself).
   */
  pinned?: boolean;
  /**
   * Element whose scroll range drives the layer. Defaults to the parent.
   * For `pinned`, pass the tall scroll track, not the sticky stage.
   */
  trigger?: RefObject<HTMLElement | null>;
};

/**
 * A scroll-scrubbed parallax layer. Animates `transform` only (GSAP `y`),
 * and does nothing when the user prefers reduced motion.
 */
export function ParallaxLayer({
  speed,
  pinned = false,
  trigger,
  style,
  children,
  ...rest
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const triggerEl = trigger?.current ?? el?.parentElement;
    if (!el || !triggerEl) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (pinned) {
        // Stage doesn't move, so all visible motion comes from the transform.
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: () => -speed * (triggerEl.offsetHeight - window.innerHeight),
            ease: "none",
            scrollTrigger: {
              trigger: triggerEl,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        return;
      }

      // Layer scrolls with the page; offset it so it appears to move at `speed`.
      // Centered so the layer sits at y=0 when the trigger is mid-viewport.
      const travel = () =>
        ((1 - speed) * (window.innerHeight + triggerEl.offsetHeight)) / 2;
      gsap.fromTo(
        el,
        { y: () => -travel() },
        {
          y: () => travel(),
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, [speed, pinned, trigger]);

  return (
    <div ref={ref} style={{ willChange: "transform", ...style }} {...rest}>
      {children}
    </div>
  );
}
