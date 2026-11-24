import { gsap } from "@/lib/gsap";
import { dayStore } from "../dayStore";
import { clockAt, TOTAL } from "../timing";
import { addCharacterBlocking } from "./blocking";
import { createCamera, type CameraState } from "./camera";
import { splitCopy } from "./copy";
import { addPropsBlocking } from "./propsBlocking";
import type { Rig } from "./rig";
import { STOP_BUILDERS } from "./stops";
import { createWorld } from "./world";

export type BuildContext = {
  tl: gsap.core.Timeline;
  stage: HTMLElement;
  q: (selector: string) => Element[];
  reduce: boolean;
  /** Extra cleanup (e.g. SplitText reverts) run when the timeline is torn down. */
  cleanup: (() => void)[];
};

export type StopContext = BuildContext & {
  cam: CameraState;
  rig: Rig;
  copy: ReturnType<typeof splitCopy>;
  el: (name: string) => Element;
};

/**
 * The single master timeline. Its duration is TOTAL story units and it is
 * scrubbed across the whole scroll track, so tl.time() is the story unit
 * and tl.progress() is dayProgress.
 */
export function buildMasterTimeline({
  track,
  stage,
  reduce,
}: {
  track: HTMLElement;
  stage: HTMLElement;
  reduce: boolean;
}) {
  const camera = createCamera(stage, reduce);
  const world = createWorld(stage);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
    },
    onUpdate: render,
  });

  function render() {
    dayStore.set(tl.progress());
    world.apply(clockAt(tl.time()));
    camera.apply();
  }

  const q = gsap.utils.selector(stage);
  const ctx: BuildContext = { tl, stage, q, reduce, cleanup: [] };
  const rig = addCharacterBlocking(ctx);
  addPropsBlocking(ctx);

  const stopCtx: StopContext = {
    ...ctx,
    cam: camera.cam,
    rig,
    copy: splitCopy(ctx),
    el: (name) => q(`[data-el="${name}"]`)[0],
  };
  STOP_BUILDERS.forEach((build) => build(stopCtx));

  // Pad to exactly TOTAL units so progress maps 1:1 to story time.
  tl.set({}, {}, TOTAL);
  render();

  return () => ctx.cleanup.forEach((fn) => fn());
}
