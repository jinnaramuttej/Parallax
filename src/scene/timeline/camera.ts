import { gsap } from "@/lib/gsap";
import { CANVAS_H, CANVAS_W, viewport } from "../viewport";

/**
 * Virtual camera, tweened by the master timeline.
 * fx/fy: point of the room (canvas units) to keep centred on screen.
 * zoom: 1 = canvas fits the stage.
 * rot: tilt in degrees. dx/dy: extra drift in canvas units.
 */
export type CameraState = {
  fx: number;
  fy: number;
  zoom: number;
  rot: number;
  dx: number;
  dy: number;
  /** Parallax spread: >1 pushes layers further apart, <1 flattens them. */
  depth: number;
};

type Layer = {
  speed: number;
  setX: (v: number) => void;
  setY: (v: number) => void;
  setScale: (v: number) => void;
  setRotation: (v: number) => void;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function createCamera(stage: HTMLElement, reduce: boolean) {
  const cam: CameraState = {
    fx: CANVAS_W / 2,
    fy: CANVAS_H / 2,
    zoom: 1,
    rot: 0,
    dx: 0,
    dy: 0,
    depth: 1,
  };

  const layers: Layer[] = Array.from(
    stage.querySelectorAll<HTMLElement>("[data-parallax-speed]"),
  ).map((el) => ({
    speed: Number(el.dataset.parallaxSpeed) || 0,
    setX: gsap.quickSetter(el, "x", "px") as (v: number) => void,
    setY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
    setScale: gsap.quickSetter(el, "scale") as (v: number) => void,
    setRotation: gsap.quickSetter(el, "rotation", "deg") as (v: number) => void,
  }));

  function apply() {
    const { s, w, h } = viewport;
    const zoom = reduce ? 1 : cam.zoom;
    // Pan so the focus point is centred, but never further than the art's
    // bleed allows (on wide screens this leaves only a gentle drift).
    const maxX = Math.max(0, (CANVAS_W * s * zoom - w) / 2) + 40 * s;
    const maxY = Math.max(0, (CANVAS_H * s * zoom - h) / 2) + 30 * s;
    const driftX = reduce ? 0 : cam.dx * s;
    const driftY = reduce ? 0 : cam.dy * s;
    const panX =
      clamp(-(cam.fx - CANVAS_W / 2) * s * zoom, -maxX, maxX) + driftX;
    const panY =
      clamp(-(cam.fy - CANVAS_H / 2) * s * zoom, -maxY, maxY) + driftY;

    for (const layer of layers) {
      // Reduced motion: every layer moves together (no depth parallax), and
      // only as much as needed to keep the focus point on screen.
      const k = reduce ? 1 : Math.max(0, 1 + (layer.speed - 1) * cam.depth);
      layer.setX(panX * k);
      layer.setY(panY * k);
      layer.setScale(1 + (zoom - 1) * k);
      layer.setRotation(reduce ? 0 : cam.rot * k);
    }
  }

  return { cam, apply };
}
