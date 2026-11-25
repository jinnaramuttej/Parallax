import { POSES } from "../../character/poses";
import { U } from "../fx";
import { rotate, type Rig } from "../rig";

type TL = gsap.core.Timeline;
type El = (name: string) => Element;

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

/** Switch a monitor screen state on or off. */
export function screen(tl: TL, el: El, name: "code" | "error" | "deploy" | "success", at: number, on: boolean, d = 0.06 * U) {
  tl.to(el(`screen-${name}`), { opacity: on ? 1 : 0, duration: d }, at);
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
