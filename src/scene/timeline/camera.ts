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

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/**
 * One transform write per element per frame (translate, rotate, scale about
 * the centre), skipped when nothing changed. Separate quickSetters per
 * property would rebuild and rewrite the transform five times a frame.
 */
function transformWriter(el: HTMLElement) {
  let last = "";
  return (x: number, y: number, rot: number, sx: number, sy: number) => {
    const t = `translate3d(${r3(x)}px, ${r3(y)}px, 0) rotate(${r3(rot)}deg) scale(${r3(sx)}, ${r3(sy)})`;
    if (t === last) return;
    last = t;
    el.style.transform = t;
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

  const wrapperEl = stage.querySelector<HTMLElement>("[data-camera]");
  const wrapper = wrapperEl ? transformWriter(wrapperEl) : null;
  const layers = Array.from(stage.querySelectorAll<HTMLElement>("[data-camera] [data-parallax-speed]"))
    .map((el) => ({ speed: Number(el.dataset.parallaxSpeed) || 0, set: transformWriter(el) }))
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
    streakOpacity(r3(blur * 0.85));

    wrapper?.(px, py, rot, zoom * (1 + 0.07 * blur), zoom);

    // Reduced motion: no depth parallax, every layer moves with the wrapper.
    if (reduce) return;
    const rad = (rot * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    for (const layer of layers) {
      const k = Math.max(0, 1 + (layer.speed - 1) * cam.depth);
      const vx = px * (k - 1);
      const vy = py * (k - 1);
      const sc = (1 + (zoom - 1) * k) / zoom;
      layer.set((vx * cos + vy * sin) / zoom, (-vx * sin + vy * cos) / zoom, rot * (k - 1), sc, sc);
    }
  }

  return { cam, apply };
}
