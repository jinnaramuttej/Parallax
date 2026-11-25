import { gsap } from "@/lib/gsap";
import { MOMENTS } from "@/config/acts";
import { CAT_SPOTS } from "../../character/catPoses";
import { POSES } from "../../character/poses";
import { ANIME_OVERSCALE } from "../../layers/AnimeOverlay";
import { catFace, catJump, catPose, catWalk } from "../catRig";
import { fadeTo } from "../fx";
import type { ActContext } from "../master";
import { setState } from "../propState";
import { express, poseTo } from "../rig";
import { animeMotion, playVideo, rgb, tick, typingWiggle, videoState } from "./shared";

const ANIME = ["anime-small", "anime-big"];
const SMALL = { scaleX: 0.94 / ANIME_OVERSCALE, scaleY: 1 / ANIME_OVERSCALE, skewY: -4 };

/**
 * Act 5, the break, 12:30 to 3:00 PM (0.415-0.546). Lunch on the second
 * monitor: an episode of an (original) anime. He slumps back, headphones
 * on, snack in hand; the cat comes over and sits beside the chair to
 * watch. The camera pushes into the screen until it fills most of the
 * frame. "Standup in 2 min" pops up: he jolts upright, the headphones fly,
 * the chair rolls back, and a whip pan snaps back to the main monitor.
 * Light: the warm glow of the episode on his face; gold underglow.
 * Surprise: the notification and the headphones flying off.
 */
export function breakAct({ tl, el, q, rig, cat }: ActContext) {
  poseTo(tl, rig, "slump", 0.416, 0.008);
  express(tl, rig, { mouth: "smile" }, 0.418);
  rgb(tl, q, "gold", 0.42);

  // The episode starts on the second monitor.
  setState(tl, q, "screen-second", "anime", 0.418);
  videoState(tl, q, ANIME, "playing", 0.418);
  playVideo(tl, q, "anime", ANIME, 0.42, 0.462);
  animeMotion(tl, q, 0.42, 0.462);
  fadeTo(tl, el("boot-glow-second"), 0.42, 0.006, 0.45);

  // Headphones off the stand and on.
  setState(tl, q, "headphones-stand", "empty", 0.423, 0.002);
  tl.fromTo(
    rig.headphones,
    { opacity: 0, attr: { transform: "translate(0 -34) rotate(0)" } },
    { opacity: 1, attr: { transform: "translate(0 0) rotate(0)" }, duration: 0.004, ease: "back.out(2.5)", immediateRender: false },
    0.423,
  );

  // Snack: a couple of bites.
  tl.set(rig.handSnack, { opacity: 1 }, 0.428);
  poseTo(tl, rig, "snack", 0.428, 0.004);
  poseTo(tl, rig, "slump", 0.433, 0.003);
  poseTo(tl, rig, "snack", 0.437, 0.003);
  poseTo(tl, rig, "slump", 0.441, 0.003);

  // The cat wakes on the bean bag and comes over to watch.
  catPose(tl, cat, "stand", 0.4152, 0.002);
  catFace(tl, cat, -1, 0.4165);
  catJump(tl, cat, { x: 1214, y: 702 }, { x: 1150, y: 760 }, 0.4175, 0.005, 14);
  catWalk(tl, cat, 1150, CAT_SPOTS.besideChair.x, 760, 0.4232, 0.0172);
  catFace(tl, cat, 1, 0.4405);
  catPose(tl, cat, "sit", 0.441, 0.004);

  // Push into the episode: the big copy over the screen grows with the camera.
  const overlay = el("anime-overlay");
  gsap.set(overlay, { ...SMALL, opacity: 0 });
  tl.set(overlay, { opacity: 1 }, 0.432);
  tl.to(overlay, { scaleX: 1, scaleY: 1, skewY: 0, duration: 0.014, ease: "power2.inOut" }, 0.432);

  // "Standup in 2 min."
  const ping = MOMENTS.standupPing;
  const toast = el("standup-toast");
  tl.fromTo(toast, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.003, ease: "back.out(2)", immediateRender: false }, ping);
  tl.to(toast, { y: -12, opacity: 0, duration: 0.003, ease: "power1.in" }, 0.471);

  // Back out of the episode, pause it.
  tl.to(overlay, { ...SMALL, duration: 0.004, ease: "power2.in" }, 0.458);
  tl.set(overlay, { opacity: 0 }, 0.462);
  videoState(tl, q, ANIME, "paused", 0.461);
  fadeTo(tl, el("boot-glow-second"), 0.462, 0.003, 0);

  // Jolt: upright, headphones fly, snack drops, chair rolls back.
  const jolt = 0.462;
  poseTo(tl, rig, { ...POSES.jolt, x: 560 }, jolt, 0.003, "power3.out");
  express(tl, rig, { mouth: "o" }, jolt);
  tl.set(rig.handSnack, { opacity: 0 }, jolt + 0.001);
  tl.to(rig.headphones, { opacity: 0, attr: { transform: "translate(-80 -96) rotate(-60)" }, duration: 0.005, ease: "power2.out" }, jolt);
  tl.to(rig.chair, { x: -40, duration: 0.005, ease: "power2.out" }, jolt);
  catPose(tl, cat, "startled", jolt, 0.002, "power3.out");
  catPose(tl, cat, "sit", jolt + 0.006, 0.004);

  // Mid-whip: roll back in and get typing. The headphones land on the stand.
  setState(tl, q, "screen-second", "terminal", 0.468, 0.002);
  setState(tl, q, "headphones-stand", "onStand", 0.468, 0.002);
  tl.to(rig.chair, { x: 0, duration: 0.005, ease: "power2.inOut" }, 0.468);
  poseTo(tl, rig, "typing", 0.469, 0.005);
  express(tl, rig, { mouth: "flat" }, 0.474);
  rgb(tl, q, "cyan", 0.474);

  tick(tl, q, 1, 0.49);
  typingWiggle(tl, rig, 0.476, 0.546 - 0.476);
}
