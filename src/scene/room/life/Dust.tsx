import { r1, seeded } from "../../random";

/**
 * Dust motes drifting in a sun beam. Lives inside the beam's box (so it
 * shares the beam's opacity) and is clipped to the beam's shape. CSS
 * animation, transform and opacity only; static for reduced motion.
 */
export function Dust({ clip, seed, count = 18 }: { clip: string; seed: number; count?: number }) {
  const rand = seeded(seed);
  const motes = Array.from({ length: count }, () => ({
    left: r1(5 + rand() * 90),
    top: r1(8 + rand() * 88),
    size: r1(0.25 + rand() * 0.35),
    duration: r1(7 + rand() * 7),
    delay: r1(rand() * 12),
  }));
  return (
    <div className="dust" style={{ clipPath: clip }} aria-hidden>
      {motes.map((m, i) => (
        <i
          key={i}
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `${m.size}%`,
            animationDuration: `${m.duration}s`,
            animationDelay: `-${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
