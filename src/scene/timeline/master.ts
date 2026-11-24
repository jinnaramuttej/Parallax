import { gsap } from "@/lib/gsap";
import { dayStore } from "../dayStore";
import { clockAt, TOTAL } from "../timing";
import { createCamera } from "./camera";
import { createWorld } from "./world";
import { addStopLabels } from "./stopLabels";
import { addCameraMoves } from "./cameraMoves";

export type BuildContext = {
  tl: gsap.core.Timeline;
  stage: HTMLElement;
  q: (selector: string) => Element[];
  reduce: boolean;
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

  const ctx: BuildContext = { tl, stage, q: gsap.utils.selector(stage), reduce };
  addCameraMoves(ctx, camera.cam);
  addStopLabels(ctx);

  // Pad to exactly TOTAL units so progress maps 1:1 to story time.
  tl.set({}, {}, TOTAL);
  render();
  return { tl, render };
}
