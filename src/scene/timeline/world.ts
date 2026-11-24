import { gsap } from "@/lib/gsap";
import { ARC, MOON_SIZE, SUN_SIZE } from "../layers/Celestial";
import { CLOUD_BANDS, CLOUD_STRIP } from "../layers/Clouds";
import { SKY_STATES, type SkyState } from "../layers/Sky";
import { LIGHT_SCHEDULE } from "../layers/Skyline";

/**
 * Everything that is a pure function of the clock: sky colour, sun and
 * moon, stars, cloud drift, skyline night tint and window lights.
 * Applied from the master timeline's onUpdate.
 */

type Key = [minutes: number, value: number];

function curve(keys: Key[], t: number) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return keys[keys.length - 1][1];
}

/** Sky state at each key time; neighbours with different states crossfade. */
const SKY_KEYS: [number, SkyState][] = [
  [320, "night"],
  [385, "dawn"],
  [440, "dawn"],
  [520, "day"],
  [1000, "day"],
  [1055, "golden"],
  [1100, "golden"],
  [1165, "dusk"],
  [1180, "dusk"],
  [1265, "night"],
];

const STARS: Key[] = [
  [330, 0.85],
  [400, 0],
  [1170, 0],
  [1265, 1],
];
const CLOUD_OPACITY: Key[] = [
  [340, 0.4],
  [430, 0.95],
  [1080, 0.95],
  [1190, 0.16],
];
const CITY_NIGHT: Key[] = [
  [340, 0.85],
  [450, 0],
  [1110, 0],
  [1250, 1],
];
/** Room lighting, written as CSS variables that the tint/glow layers read. */
const ROOM_LIGHT: Record<string, Key[]> = {
  "--dawn": [[330, 0.15], [359, 0.3], [400, 0.4], [470, 0.12], [540, 0]],
  "--night": [[340, 0.75], [380, 0.55], [440, 0.12], [520, 0], [1100, 0], [1170, 0.45], [1260, 0.8]],
  "--golden": [[990, 0], [1045, 0.5], [1095, 0.6], [1150, 0.1], [1180, 0]],
  "--lamp": [[1090, 0], [1130, 1]],
  "--glow": [[1100, 0], [1220, 0.85]],
};
const SUNRISE = 360;
const SUNSET = 1170;
const MOONRISE = 1150;
const MOONSET = 1740;
const DAY_START = 359;

const Z = Object.fromEntries(SKY_STATES.map((s, i) => [s, i])) as Record<
  SkyState,
  number
>;

export function createWorld(stage: HTMLElement) {
  const q = gsap.utils.selector(stage);
  const cache = new Map<string, number>();

  // Only touch the DOM when a value actually changes.
  function setter(el: Element | undefined, prop: string, key: string) {
    if (!el) return () => {};
    const set = gsap.quickSetter(el, prop) as (v: number) => void;
    return (v: number) => {
      const rounded = Math.round(v * 1000) / 1000;
      if (cache.get(key) === rounded) return;
      cache.set(key, rounded);
      set(rounded);
    };
  }

  const sky = SKY_STATES.map((s) =>
    setter(q(`[data-sky="${s}"]`)[0], "opacity", `sky-${s}`),
  );
  const stars = setter(q('[data-el="stars"]')[0], "opacity", "stars");
  const sunX = setter(q('[data-el="sun"]')[0], "xPercent", "sunX");
  const sunY = setter(q('[data-el="sun"]')[0], "yPercent", "sunY");
  const sunO = setter(q('[data-el="sun"]')[0], "opacity", "sunO");
  const moonX = setter(q('[data-el="moon"]')[0], "xPercent", "moonX");
  const moonY = setter(q('[data-el="moon"]')[0], "yPercent", "moonY");
  const moonO = setter(q('[data-el="moon"]')[0], "opacity", "moonO");
  const clouds = CLOUD_BANDS.map((band) => {
    const el = q(`[data-el="clouds-${band.key}"]`)[0];
    return {
      drift: band.drift,
      x: setter(el, "xPercent", `cloudX-${band.key}`),
      o: setter(el, "opacity", `cloudO-${band.key}`),
    };
  });
  const lightHosts = [q('[data-el="tints"]')[0], q('[data-el="glows"]')[0]].filter(
    Boolean,
  ) as HTMLElement[];
  function setVar(name: string, value: number) {
    const rounded = Math.round(value * 1000) / 1000;
    if (cache.get(name) === rounded) return;
    cache.set(name, rounded);
    for (const host of lightHosts) host.style.setProperty(name, String(rounded));
  }

  const cityNight = ["far", "near"].map((k) =>
    setter(q(`[data-el="city-night-${k}"]`)[0], "opacity", `city-${k}`),
  );
  const lights = q("[data-lights]").map((el, i) => {
    const group = Number((el as HTMLElement).dataset.lights);
    return { group, set: setter(el, "opacity", `lights-${i}`) };
  });

  function arc(angle: number, size: number) {
    const dx = ARC.rx * Math.cos(angle);
    const dy = -ARC.ry * Math.sin(angle);
    return { xp: (dx / size) * 100, yp: (dy / size) * 100 };
  }

  function apply(t: number) {
    // Sky: crossfade between the two key states around t. The lower layer
    // in z-order sits at full opacity; the upper one carries the mix.
    let i = SKY_KEYS.findIndex(([k]) => k >= t);
    if (i <= 0) i = i === 0 ? 1 : SKY_KEYS.length - 1;
    const [t0, a] = SKY_KEYS[i - 1];
    const [t1, b] = SKY_KEYS[i];
    const f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1)));
    SKY_STATES.forEach((s, idx) => {
      let o = 0;
      if (s === a || s === b) {
        if (a === b) o = 1;
        else if (Z[b] > Z[a]) o = s === a ? 1 : f;
        else o = s === b ? 1 : 1 - f;
      }
      if (s === "night") o = 1; // always the base
      sky[idx](o);
    });

    stars(curve(STARS, t));

    // Sun: rises at SUNRISE on the left, sets at SUNSET on the right.
    const sunA = Math.PI * (1 - (t - SUNRISE) / (SUNSET - SUNRISE));
    const sun = arc(sunA, SUN_SIZE);
    sunX(sun.xp);
    sunY(sun.yp);
    sunO(t > SUNRISE - 30 && t < SUNSET + 30 ? 1 : 0);

    const moonA = Math.PI * (1 - (t - MOONRISE) / (MOONSET - MOONRISE));
    const moon = arc(moonA, MOON_SIZE);
    moonX(moon.xp);
    moonY(moon.yp);
    moonO(t > MOONRISE - 20 ? 1 : 0);

    const elapsed = t - DAY_START;
    const cloudO = curve(CLOUD_OPACITY, t);
    for (const c of clouds) {
      c.x((-elapsed * c.drift * 100) / CLOUD_STRIP.w);
      c.o(cloudO);
    }

    for (const [name, keys] of Object.entries(ROOM_LIGHT)) setVar(name, curve(keys, t));

    const night = curve(CITY_NIGHT, t);
    cityNight.forEach((set) => set(night));

    for (const light of lights) {
      let o = 0;
      for (const [on, off] of LIGHT_SCHEDULE[light.group]) {
        // 8-minute fade in and out so windows never pop.
        o = Math.max(o, Math.min(1, (t - on) / 8, (off - t) / 8));
      }
      light.set(Math.max(0, o));
    }
  }

  return { apply };
}
