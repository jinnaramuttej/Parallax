import { ParallaxLayer } from "@/components/ParallaxLayer";
import { seeded } from "../random";

export const LIGHT_GROUPS = 12;

/**
 * When each group of windows is lit, in clock minutes (1440+ = after
 * midnight). Groups switch on through the evening; some switch off late.
 * A few early risers are lit at dawn.
 */
export const LIGHT_SCHEDULE: [number, number][][] = (() => {
  const rnd = seeded(101);
  return Array.from({ length: LIGHT_GROUPS }, (_, g) => {
    const on = 1035 + g * 21 + rnd() * 14;
    const off = g % 4 === 0 ? 9999 : 1440 + 20 + rnd() * 160;
    const spans: [number, number][] = [[on, off]];
    if (g < 3) spans.push([0, 385 + rnd() * 40]);
    return spans;
  });
})();

type Building = { x: number; w: number; top: number; roof: 0 | 1 | 2 };

function makeBuildings(
  seed: number,
  [minTop, maxTop]: [number, number],
  gaps: boolean,
) {
  const rnd = seeded(seed);
  const list: Building[] = [];
  let x = -420;
  while (x < 2020) {
    const w = Math.round((44 + rnd() * 70) / 14) * 14;
    const top = Math.round(minTop + rnd() * (maxTop - minTop));
    list.push({ x, w, top, roof: Math.floor(rnd() * 3) as 0 | 1 | 2 });
    // The far row is solid so the sky never shows through as thin slits.
    x += w + (gaps && rnd() < 0.5 ? 7 : 0);
  }
  return list;
}

function buildingsPath(list: Building[]) {
  return list
    .map(({ x, w, top, roof }) => {
      let d = `M${x} 1100V${top}H${x + w}V1100Z`;
      if (roof === 1)
        d += `M${x + w * 0.25} ${top}V${top - 18}H${x + w * 0.75}V${top}Z`;
      if (roof === 2)
        d += `M${x + w * 0.5 - 2} ${top}V${top - 34}H${x + w * 0.5 + 2}V${top}Z`;
      return d;
    })
    .join("");
}

function windows(list: Building[], seed: number) {
  const rnd = seeded(seed);
  let unlit = "";
  const lit = Array.from({ length: LIGHT_GROUPS }, () => ({
    warm: "",
    cool: "",
  }));
  for (const b of list) {
    for (let wx = b.x + 8; wx + 6 <= b.x + b.w - 6; wx += 14) {
      for (let wy = b.top + 14; wy < 640; wy += 18) {
        const rect = `M${wx} ${wy}h6v9h-6Z`;
        if (rnd() < 0.42) {
          const g = Math.floor(rnd() * LIGHT_GROUPS);
          if (rnd() < 0.8) lit[g].warm += rect;
          else lit[g].cool += rect;
        } else {
          unlit += rect;
        }
      }
    }
  }
  return { unlit, lit };
}

const DEPTHS = [
  { key: "far", speed: 0.4, seed: 41, tops: [250, 400] as [number, number] },
  { key: "near", speed: 0.55, seed: 59, tops: [330, 450] as [number, number] },
];

export function Skyline() {
  return (
    <>
      {DEPTHS.map((depth) => {
        const list = makeBuildings(
          depth.seed,
          depth.tops,
          depth.key === "near",
        );
        const shape = buildingsPath(list);
        const { unlit, lit } = windows(list, depth.seed + 1);
        return (
          <ParallaxLayer
            key={depth.key}
            speed={depth.speed}
            className="scene-canvas"
            aria-hidden
          >
            <svg viewBox="0 0 1600 900">
              <path d={shape} fill={`var(--city-${depth.key})`} />
              <path
                data-el={`city-night-${depth.key}`}
                d={shape}
                fill={`var(--city-${depth.key}-night)`}
                opacity="0"
              />
              <path d={unlit} fill="var(--window-unlit)" />
              {lit.map((g, i) => (
                <g key={i} data-lights={i} opacity="0">
                  <path d={g.warm} fill="var(--window-warm)" />
                  <path d={g.cool} fill="var(--window-cool)" />
                </g>
              ))}
            </svg>
          </ParallaxLayer>
        );
      })}
    </>
  );
}
