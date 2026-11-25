import { gsap } from "@/lib/gsap";
import { CANVAS_H, CANVAS_W, viewport } from "../viewport";

/**
 * Virtual camera state, tweened by the master timeline (see
 * cameraDirector.ts; shots come from src/config/shots.ts).
 * fx/fy: point of the room (canvas units) to keep centred on screen.
 * zoom: 1 = canvas fits the stage. rot: tilt in degrees.
 * dx/dy: extra drift in canvas units.
 * blur: whip-pan motion blur, 0-1 (horizontal stretch plus speed streaks).
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
  blur: number;
};

type Setter = (v: number) => void;
type Transformable = { x: Setter; y: Setter; scale: Setter; scaleX: Setter; scaleY: Setter; rotation: Setter };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function setters(el: Element): Transformable {
  // quickSetter does not expand the "scale" shorthand, so set both axes.
  const sx = gsap.quickSetter(el, "scaleX") as Setter;
  const sy = gsap.quickSetter(el, "scaleY") as Setter;
  return {
    x: gsap.quickSetter(el, "x", "px") as Setter,
    y: gsap.quickSetter(el, "y", "px") as Setter,
    scale: (v) => {
      sx(v);
      sy(v);
    },
    scaleX: sx,
    scaleY: sy,
    rotation: gsap.quickSetter(el, "rotation", "deg") as Setter,
  };
}

/**
 * Applies the camera with transforms only.
 *
 * The <Camera> wrapper ([data-camera]) gets the room-plane framing: pan P,
 * zoom Z, tilt R, around the stage centre. Every <ParallaxLayer> inside it
 * whose depth k is not 1 gets just the residual that turns the wrapper's
 * framing into its own (pan P*k, zoom 1+(Z-1)*k, tilt R*k):
 *   translate (1/Z) * rotate(-R) * P*(k-1), rotate R*(k-1), scale (1+(Z-1)k)/Z.
 * Room-plane layers (k = 1) ride the wrapper untouched.
 */
export function createCamera(stage: HTMLElement, reduce: boolean) {
  const cam: CameraState = { fx: CANVAS_W / 2, fy: CANVAS_H / 2, zoom: 1, rot: 0, dx: 0, dy: 0, depth: 1, blur: 0 };
  const streaks = stage.querySelector('[data-el="whip"]');
  const streakOpacity = streaks ? (gsap.quickSetter(streaks, "opacity") as Setter) : () => {};

  const wrapperEl = stage.querySelector("[data-camera]");
  const wrapper = wrapperEl ? setters(wrapperEl) : null;
  const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-camera] [data-parallax-speed]"))
    .map((el) => ({ speed: Number(el.dataset.parallaxSpeed) || 0, set: setters(el) }))
    .filter((l) => l.speed !== 1);

  function apply() {
    const { s, w, h } = viewport;
    const zoom = reduce ? 1 : cam.zoom;
    const rot = reduce ? 0 : cam.rot;
    // Pan so the focus point is centred, but never further than the art's
    // bleed allows (on wide screens this leaves only a gentle drift).
    const maxX = Math.max(0, (CANVAS_W * s * zoom - w) / 2) + 40 * s;
    const maxY = Math.max(0, (CANVAS_H * s * zoom - h) / 2) + 30 * s;
    const px = clamp(-(cam.fx - CANVAS_W / 2) * s * zoom, -maxX, maxX) + (reduce ? 0 : cam.dx * s);
    const py = clamp(-(cam.fy - CANVAS_H / 2) * s * zoom, -maxY, maxY) + (reduce ? 0 : cam.dy * s);

    // Whip pan: stretch along the pan and show speed streaks (transform and
    // opacity only). Skipped for reduced motion.
    const blur = reduce ? 0 : cam.blur;
    streakOpacity(blur * 0.85);

    if (wrapper) {
      wrapper.x(px);
      wrapper.y(py);
      wrapper.scaleX(zoom * (1 + 0.07 * blur));
      wrapper.scaleY(zoom);
      wrapper.rotation(rot);
    }

    // Reduced motion: no depth parallax, every layer moves with the wrapper.
    if (reduce) return;
    const rad = (rot * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    for (const layer of layers) {
      const k = Math.max(0, 1 + (layer.speed - 1) * cam.depth);
      const vx = px * (k - 1);
      const vy = py * (k - 1);
      layer.set.x((vx * cos + vy * sin) / zoom);
      layer.set.y((-vx * sin + vy * cos) / zoom);
      layer.set.scale((1 + (zoom - 1) * k) / zoom);
      layer.set.rotation(rot * (k - 1));
    }
  }

  return { cam, apply };
}
