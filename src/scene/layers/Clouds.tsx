import { ParallaxLayer } from "@/components/ParallaxLayer";
import { r1, seeded } from "../random";
import { box } from "../viewport";

/** Cloud strips are wider than the canvas so they can drift all day. */
export const CLOUD_STRIP = { x: -400, w: 3200, h: 600 };

export const CLOUD_BANDS = [
  // drift: canvas units per clock minute. Clock runs fast between stops,
  // so clouds race in transitions and idle during holds.
  { key: "far", speed: 0.15, drift: 0.3, seed: 3, count: 9, size: 0.6, y: [120, 240] },
  { key: "mid", speed: 0.25, drift: 0.6, seed: 7, count: 7, size: 0.9, y: [90, 300] },
  { key: "near", speed: 0.35, drift: 1.0, seed: 13, count: 5, size: 1.3, y: [200, 360] },
] as const;

type Puff = { cx: number; cy: number; r: number };

function makeClouds(seed: number, count: number, size: number, [y0, y1]: readonly [number, number]) {
  const rnd = seeded(seed);
  const gap = CLOUD_STRIP.w / count;
  return Array.from({ length: count }, (_, i) => {
    const x = r1(i * gap + rnd() * gap * 0.6);
    const y = r1(y0 + rnd() * (y1 - y0));
    const w = r1((90 + rnd() * 80) * size);
    const puffs: Puff[] = [
      { cx: r1(x + w * 0.28), cy: r1(y - w * 0.12), r: r1(w * 0.22) },
      { cx: r1(x + w * 0.55), cy: r1(y - w * 0.2), r: r1(w * 0.28) },
      { cx: r1(x + w * 0.78), cy: r1(y - w * 0.08), r: r1(w * 0.18) },
    ];
    return { x, y, w, h: r1(w * 0.2), puffs };
  });
}

export function Clouds() {
  return (
    <>
      {CLOUD_BANDS.map((band) => {
        const clouds = makeClouds(band.seed, band.count, band.size, band.y);
        return (
          <ParallaxLayer key={band.key} speed={band.speed} className="scene-canvas" aria-hidden>
            <div
              data-el={`clouds-${band.key}`}
              className="absolute will-change-transform"
              style={box(CLOUD_STRIP.x, 0, CLOUD_STRIP.w, CLOUD_STRIP.h)}
            >
              <svg
                viewBox={`0 0 ${CLOUD_STRIP.w} ${CLOUD_STRIP.h}`}
                className="h-full w-full overflow-visible"
              >
                <g fill={`var(--cloud-${band.key})`}>
                  {clouds.map((c, i) => (
                    <g key={i}>
                      <rect x={c.x} y={c.y - c.h / 2} width={c.w} height={c.h} rx={c.h / 2} />
                      {c.puffs.map((p, j) => (
                        <circle key={j} cx={p.cx} cy={p.cy} r={p.r} />
                      ))}
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </ParallaxLayer>
        );
      })}
    </>
  );
}
