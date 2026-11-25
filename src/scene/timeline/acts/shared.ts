import { POSES } from "../../character/poses";
import { U } from "../fx";
import { setState } from "../propState";
import { rotate, type Rig } from "../rig";

type TL = gsap.core.Timeline;

/** Small forearm taps while he types, scrubbed with the scroll. */
export function typingWiggle(tl: TL, rig: Rig, at: number, duration: number) {
  const taps = Math.max(2, Math.round(duration / (0.06 * U)));
  const d = duration / taps;
  const near = POSES.typing.armNearL;
  const far = POSES.typing.armFarL;
  for (let i = 0; i < taps; i++) {
    const up = i % 2 === 0;
    tl.to(rig.joints.armNearL, { ...rotate(near + (up ? -5 : 0)), duration: d, ease: "sine.inOut" }, at + i * d);
    tl.to(rig.joints.armFarL, { ...rotate(far + (up ? 0 : -5)), duration: d, ease: "sine.inOut" }, at + i * d);
  }
}

/** Switch all three screens at once (main state, plus second/laptop states). */
export function screens(
  tl: TL,
  q: (s: string) => Element[],
  at: number,
  main: string,
  second?: string,
  laptop?: string,
) {
  setState(tl, q, "screen-main", main, at);
  if (second) setState(tl, q, "screen-second", second, at);
  if (laptop) setState(tl, q, "screen-laptop", laptop, at);
}

/** An empty can drops onto its slot on the desk. */
export function canAppears(tl: TL, q: (s: string) => Element[], slot: number, at: number) {
  tl.fromTo(
    q(`[data-can="${slot}"]`)[0],
    { opacity: 0, attr: { transform: "translate(0 -40)" } },
    { opacity: 1, attr: { transform: "translate(0 0)" }, duration: 0.12 * U, ease: "bounce.out" },
    at,
  );
}
