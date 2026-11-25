"use client";

import { useLayoutEffect, useRef } from "react";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { replay as replayDay } from "@/autoplay/autoplay";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { bonusCansStore } from "@/scene/dayStore";
import { r1, seeded } from "@/scene/random";
import { CAN_EVENTS, COMMIT_EVENTS } from "@/config/acts";

const STATS = [
  { label: "Hackathons entered", value: 15, suffix: "+" },
  { label: "Wins", value: 4 },
  { label: "Cans drunk", value: CAN_EVENTS.length, cans: true },
  { label: "Commits today", value: COMMIT_EVENTS.length },
];

const STARS = (() => {
  const rnd = seeded(77);
  return Array.from({ length: 60 }, () => ({
    x: r1(rnd() * 1600),
    y: r1(rnd() * 1000),
    r: r1(0.8 + rnd() * 1.6),
  }));
})();

/**
 * The finale after 3 AM: a terminal-style deploy summary whose numbers
 * count up when it scrolls into view. Hides the HUD and scrubber.
 */
export function Stats() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const numbers = Array.from(section.querySelectorAll<HTMLElement>("[data-count]"));
    const chrome = () => Array.from(document.querySelectorAll(".hud, .scrubber, .day-progress, .autoplay-controls"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = (n: HTMLElement) =>
      Number(n.dataset.count) + (n.dataset.cans ? bonusCansStore.get() : 0);
    const show = (n: HTMLElement, v: number) => {
      n.textContent = `${Math.round(v)}${n.dataset.suffix ?? ""}`;
    };
    numbers.forEach((n) => show(n, 0));

    const count = () =>
      numbers.forEach((n, i) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: target(n),
          duration: reduce ? 0 : 1.4,
          delay: reduce ? 0 : i * 0.12,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => show(n, o.v),
        });
      });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => {
        gsap.to(chrome(), { autoAlpha: 0, duration: 0.3 });
        count();
      },
      onLeaveBack: () => gsap.to(chrome(), { autoAlpha: 1, duration: 0.3 }),
    });
    return () => st.kill();
  }, []);

  // Back to 5:59 AM and play the day again.
  const replay = () => replayDay();

  return (
    <section ref={ref} className="stats" aria-labelledby="stats-title">
      <ParallaxLayer speed={0.45} className="stats-stars" aria-hidden>
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--star)" />
          ))}
        </svg>
      </ParallaxLayer>
      <div className="stats-inner">
        <h2 id="stats-title" className="stats-title">
          The day, in numbers
        </h2>
        <div className="terminal">
          <div className="terminal-bar" aria-hidden>
            <span />
            <span />
            <span />
            <p>~/day-1</p>
          </div>
          <div className="terminal-body">
            <p className="t-cmd">$ ship --summary</p>
            <p className="t-ok">Deployed to production at 3:00 AM</p>
            <dl className="t-stats">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd
                    data-count={s.value}
                    data-suffix={s.suffix}
                    data-cans={s.cans ? "1" : undefined}
                  >
                    {s.value}
                    {s.suffix}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="t-cmd">
              $ sleep <span className="t-caret" aria-hidden />
            </p>
          </div>
        </div>
        <button type="button" className="replay" onClick={replay}>
          Replay the day
        </button>
      </div>
    </section>
  );
}
