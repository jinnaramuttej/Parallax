import type { CSSProperties } from "react";
import { ParallaxLayer } from "@/components/ParallaxLayer";
import { BALLOON_SIZE, CAPTIONS, type Caption } from "@/config/captions";
import { VOICE } from "@/config/voice";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * One comic caption: an impact word (big, outlined, slanted, drop shadow,
 * on a halftone burst), a narration box (skewed), or a speech balloon (its
 * tail is drawn at runtime to point at his head). Hidden until the caption
 * director places and shows it (src/scene/timeline/captions.ts).
 */
export function ComicCaption({
  id,
  text,
  type,
  size,
  color,
}: Pick<Caption, "id" | "text" | "type" | "size" | "color">) {
  const style: Vars = { "--size": size, "--fill": color ?? "var(--sun)", visibility: "hidden", opacity: 0 };
  return (
    <div className={`cap cap-${type}`} data-cap={id} data-cap-type={type} style={style}>
      <div className="cap-inner" data-cap-inner>
        {type === "impact" && <div className="cap-burst" aria-hidden />}
        {type === "balloon" && (
          <svg className="cap-tail" aria-hidden>
            <path data-cap-tail d="" />
          </svg>
        )}
        <div className="cap-body">
          <span className="cap-text" data-cap-text>
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * The caption layers, inside the camera. Speech balloons sit on the room
 * plane with him (speed 1); impact words and boxes ride a faster foreground
 * layer so they parallax past the room.
 */
export function ComicCaptionLayers() {
  const balloons = CAPTIONS.filter((c) => c.type === "balloon");
  const front = CAPTIONS.filter((c) => c.type !== "balloon");
  return (
    <>
      <ParallaxLayer speed={1} className="scene-canvas cap-layer" data-cap-layer="balloon">
        {balloons.map((c) => (
          <ComicCaption key={c.id} {...c} />
        ))}
        {VOICE.map((v) => (
          <ComicCaption key={v.balloon} id={v.balloon} text={v.text} type="balloon" size={BALLOON_SIZE} />
        ))}
      </ParallaxLayer>
      <ParallaxLayer speed={1.22} className="scene-canvas cap-layer" data-cap-layer="front">
        {front.map((c) => (
          <ComicCaption key={c.id} {...c} />
        ))}
      </ParallaxLayer>
    </>
  );
}
