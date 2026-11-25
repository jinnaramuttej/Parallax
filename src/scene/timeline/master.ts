import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ACTS } from "@/config/acts";
import { progressFromScroll } from "@/config/scroll";
import { timeAt } from "@/config/timeMap";
import { dayStore } from "../dayStore";
import { ACT_BUILDERS } from "./acts";
import { createCamera } from "./camera";
import { createCatRig, startCatIdle, type CatRigHandle } from "./catRig";
import { addCameraDirection } from "./cameraDirector";
import { splitCopy } from "./copy";
import { createRig, type Rig } from "./rig";
import { createWorld } from "./world";

export type BuildContext = {
  tl: gsap.core.Timeline;
  stage: HTMLElement;
  q: (selector: string) => Element[];
  reduce: boolean;
  /** Extra cleanup (e.g. SplitText reverts) run when the timeline is torn down. */
  cleanup: (() => void)[];
};

export type ActContext = BuildContext & {
  rig: Rig;
  /** The room cat and the one that ends up on his shoulder. */
  cat: CatRigHandle;
  shoulderCat: CatRigHandle;
  copy: ReturnType<typeof splitCopy>;
  el: (name: string) => Element;
};

/**
 * The single master timeline. Its time axis IS day progress: duration 1,
 * every tween positioned at a progress value. It is paused and driven by a
 * ScrollTrigger through src/config/scroll.ts (scroll -> progress), so the
 * scroll pacing can change without touching any choreography.
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
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: render });

  function render() {
    const progress = tl.progress();
    dayStore.set(progress);
    // The clock comes from the time map, never from raw scroll.
    world.apply(timeAt(progress));
    camera.apply();
  }

  const q = gsap.utils.selector(stage);
  const ctx: BuildContext = { tl, stage, q, reduce, cleanup: [] };
  const actCtx: ActContext = {
    ...ctx,
    rig: createRig(q),
    cat: createCatRig(q, "room"),
    shoulderCat: createCatRig(q, "shoulder"),
    copy: splitCopy(ctx),
    el: (name) => q(`[data-el="${name}"]`)[0],
  };

  // Tail sway and ear twitches run on real time, independent of scroll.
  ctx.cleanup.push(startCatIdle([actCtx.cat, actCtx.shoulderCat], reduce));

  addCameraDirection(tl, camera.cam);
  for (const act of ACTS) ACT_BUILDERS[act.id](actCtx);

  // Exactly one unit long, so tl.progress() === tl.time() === day progress.
  tl.set({}, {}, 1);
  render();

  const sync = (self: ScrollTrigger) => tl.progress(progressFromScroll(self.progress));
  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    onUpdate: sync,
    onRefresh: sync,
  });

  return () => ctx.cleanup.forEach((fn) => fn());
}
