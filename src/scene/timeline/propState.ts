type TL = gsap.core.Timeline;
type Q = (selector: string) => Element[];

/**
 * Switch a data-driven prop (see src/scene/Stateful.tsx) to a state at a
 * day progress: the chosen [data-state] fades in, its siblings fade out.
 */
export function setState(tl: TL, q: Q, prop: string, state: string, at: number, duration = 0.004) {
  const states = q(`[data-prop="${prop}"] > [data-state]`);
  if (!states.length) return;
  for (const el of states) {
    const on = (el as HTMLElement | SVGElement).dataset.state === state;
    tl.to(el, { opacity: on ? 1 : 0, duration }, at);
  }
}

/** Show or hide a whole prop. */
export function setVisible(tl: TL, q: Q, prop: string, visible: boolean, at: number, duration = 0.004) {
  const el = q(`[data-prop="${prop}"]`)[0];
  if (el) tl.to(el, { opacity: visible ? 1 : 0, duration }, at);
}
