import { getLenis } from "@/components/SmoothScroll";
import { ACTS } from "@/config/acts";
import { scrollFromProgress } from "@/config/scroll";
import { dayStore } from "./dayStore";

/** Scroll position (px) at which the scene reaches a day progress. */
export function scrollYForProgress(progress: number) {
  const track = document.querySelector<HTMLElement>(".scene-track");
  if (!track) return 0;
  const top = track.getBoundingClientRect().top + window.scrollY;
  return top + scrollFromProgress(progress) * (track.offsetHeight - window.innerHeight);
}

/** Jump the scroll to y right now (Lenis keeps ScrollTrigger in sync). */
export function setScroll(y: number) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Glide to y, eased; duration grows with distance. Instant without Lenis (reduced motion). */
export function glideTo(y: number, onComplete?: () => void) {
  const lenis = getLenis();
  if (!lenis) {
    window.scrollTo({ top: y });
    onComplete?.();
    return;
  }
  const distance = Math.abs(y - window.scrollY);
  lenis.scrollTo(y, { duration: 1 + Math.min(2.6, distance / 4500), easing: easeInOutCubic, force: true, onComplete });
}

/** Index of the act the day is in now. */
export function currentActIndex() {
  const p = dayStore.get();
  let i = 0;
  while (i < ACTS.length - 1 && p >= ACTS[i + 1].startProgress - 1e-6) i++;
  return i;
}

/** Go to an act's chip anchor (clamped to the first and last act). */
export function goToAct(index: number) {
  const i = Math.max(0, Math.min(ACTS.length - 1, index));
  glideTo(scrollYForProgress(ACTS[i].anchor));
  return i;
}
