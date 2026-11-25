import { ParallaxLayer } from "@/components/ParallaxLayer";
import { AnimeVideo } from "../screens/AnimeVideo";
import { box } from "../viewport";

/** The overlay is drawn this many times larger than the second screen, then scaled down. */
export const ANIME_OVERSCALE = 5;

/**
 * The anime clip drawn big for the push into the second monitor. It starts
 * scaled down exactly over the small screen (same tilt), so fading it in
 * is invisible; the break act then grows it to fill most of the frame.
 * Drawn large and scaled down, so it stays crisp when it grows (transform
 * and opacity only). Sits under the guy for an over-the-shoulder shot.
 */
export function AnimeOverlay() {
  const k = ANIME_OVERSCALE;
  const w = 126 * k;
  const h = 84 * k;
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <div
        className="anime-overlay"
        data-el="anime-overlay"
        style={{
          ...box(738 - w / 2, 515 - h / 2, w, h),
          opacity: 0,
          transform: `skewY(-4deg) scale(${(0.94 / k).toFixed(4)}, ${(1 / k).toFixed(4)})`,
        }}
      >
        <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
          <AnimeVideo idPrefix="anime-big" />
        </svg>
      </div>
    </ParallaxLayer>
  );
}
