import { ParallaxLayer } from "@/components/ParallaxLayer";
import { r1, seeded } from "../random";

function starField(seed: number, count: number) {
  const rnd = seeded(seed);
  return Array.from({ length: count }, () => ({
    x: r1(-200 + rnd() * 2000),
    y: r1(-150 + rnd() * 600),
    r: r1(0.8 + rnd() * 1.8),
  }));
}

const STEADY = starField(11, 70);
const TWINKLE = starField(29, 40);

function Field({ stars }: { stars: { x: number; y: number; r: number }[] }) {
  return (
    <svg viewBox="0 0 1600 900" aria-hidden>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--star)" />
      ))}
    </svg>
  );
}

export function Stars() {
  return (
    <ParallaxLayer speed={0.06} className="scene-canvas" aria-hidden>
      <div data-el="stars" className="absolute inset-0" style={{ opacity: 0 }}>
        <div className="absolute inset-0">
          <Field stars={STEADY} />
        </div>
        <div className="star-twinkle absolute inset-0">
          <Field stars={TWINKLE} />
        </div>
      </div>
    </ParallaxLayer>
  );
}
