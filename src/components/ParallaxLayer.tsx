"use client";

import {
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { gsap } from "@/lib/gsap";

type ParallaxLayerProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * Depth of the layer.
   * Inside the scene stage: how strongly the camera (pan, zoom, tilt) moves
   * this layer. 0 = fixed sky, 1 = the room plane, >1 = foreground.
   * Anywhere else: on-screen speed relative to the scroll (1 = normal,
   * <1 = background, >1 = foreground).
   */
  speed: number;
};

/**
 * One parallax layer. Animates `transform` only.
 *
 * In the pinned scene, the master timeline's camera reads `data-parallax-speed`
 * and moves every layer itself, so this component stays passive there.
 * Outside the scene it runs its own scrubbed ScrollTrigger.
 */
export function ParallaxLayer({
  speed,
  style,
  children,
  ...rest
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || el.closest("[data-scene-stage]")) return;
    const trigger = el.parentElement;
    if (!trigger) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Offset the layer so it appears to move at `speed`, centred so it
      // sits at y=0 when the trigger is mid-viewport.
      const travel = () =>
        ((1 - speed) * (window.innerHeight + trigger.offsetHeight)) / 2;
      gsap.fromTo(
        el,
        { y: () => -travel() },
        {
          y: () => travel(),
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    return () => mm.revert();
  }, [speed]);

  return (
    <div
      ref={ref}
      data-parallax-speed={speed}
      style={{ willChange: "transform", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
