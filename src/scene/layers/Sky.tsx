import { ParallaxLayer } from "@/components/ParallaxLayer";

/** Bottom to top. The world crossfades between adjacent states with opacity. */
export const SKY_STATES = ["night", "dusk", "golden", "day", "dawn"] as const;
export type SkyState = (typeof SKY_STATES)[number];

export function Sky() {
  return (
    <ParallaxLayer speed={0.02} className="scene-canvas" aria-hidden>
      {SKY_STATES.map((state) => (
        <div
          key={state}
          data-sky={state}
          className={`sky-fill sky-${state}`}
          style={{ opacity: state === "night" ? 1 : 0 }}
        />
      ))}
    </ParallaxLayer>
  );
}
