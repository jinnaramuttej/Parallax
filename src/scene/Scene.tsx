"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Character } from "./character/Character";
import { Celestial } from "./layers/Celestial";
import {
  ForegroundCable,
  ForegroundLeaves,
  ForegroundMug,
} from "./layers/Foreground";
import { CatLayer } from "./layers/CatLayer";
import { Glows } from "./layers/Glows";
import { MonitorScreen } from "./layers/MonitorScreen";
import { AnimeOverlay } from "./layers/AnimeOverlay";
import { Toast } from "./ui/Toast";
import { Tints } from "./layers/Tints";
import { Props } from "./props/Props";
import { Room, RoomBack } from "./room/Room";
import { Curtains } from "./layers/Curtains";
import { RoomLife } from "./layers/RoomLife";
import { Clouds } from "./layers/Clouds";
import { Sky } from "./layers/Sky";
import { Skyline } from "./layers/Skyline";
import { Stars } from "./layers/Stars";
import { Camera } from "./Camera";
import { buildMasterTimeline } from "./timeline/master";
import { Hud } from "./ui/Hud";
import { ComicCaptionLayers } from "@/components/ComicCaption";
import { audio } from "@/audio/AudioManager";
import { startAudioDirector } from "@/audio/director";
import { SoundButton } from "@/audio/SoundButton";
import { setupInteractions } from "./interactions";
import { Confetti } from "./ui/Confetti";
import { Hotspots } from "./ui/Hotspots";
import { Loader } from "./ui/Loader";
import { Intro } from "@/autoplay/Intro";
import { AutoplayControls } from "@/autoplay/Controls";
import { Scrubber } from "./ui/Scrubber";
import { measureViewport } from "./viewport";
import { ACTS } from "@/config/acts";
import {
  ACT_SCROLL_VH,
  progressFromScroll,
  scrollFromProgress,
  SCROLL_VH,
} from "@/config/scroll";
import { formatClock, timeAt } from "@/config/timeMap";

declare global {
  interface Window {
    /** Read-only director config for scripts and devtools (verification). */
    __director?: unknown;
  }
}

/** `voiceFiles`: recorded voice lines found in public/audio/voice at build time. */
export function Scene({ voiceFiles = [] }: { voiceFiles?: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    measureViewport(stage);
    const onRefreshInit = () => measureViewport(stage);
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) =>
        buildMasterTimeline({
          track,
          stage,
          reduce: Boolean(context.conditions?.reduce),
        }),
      stage,
    );

    const stopInteractions = setupInteractions(stage);
    audio().setVoiceFiles(voiceFiles);
    const stopAudio = startAudioDirector();
    window.__director = Object.freeze({
      acts: ACTS.map(
        ({ id, label, startProgress, endProgress, anchor, clock }) => ({
          id,
          label,
          startProgress,
          endProgress,
          anchor,
          clock,
        }),
      ),
      actScrollVh: ACT_SCROLL_VH,
      timeAt,
      formatClock,
      progressFromScroll,
      scrollFromProgress,
    });

    return () => {
      stopAudio();
      stopInteractions();
      mm.revert();
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    };
  }, [voiceFiles]);

  return (
    <section
      ref={trackRef}
      className="scene-track"
      style={{ height: `calc(${SCROLL_VH}svh + 100svh)` }}
      aria-label="A developer's day, from 5:59 AM to 3 AM"
    >
      <h1 className="sr-only">24 Hours of a Dev</h1>
      <div ref={stageRef} className="scene-stage" data-scene-stage>
        <div className="scene-shake" data-el="shake">
          <Camera>
            <Sky />
            <Stars />
            <Celestial />
            <Clouds />
            <Skyline />
            <RoomBack />
            <Curtains />
            <Room />
            <RoomLife />
            <MonitorScreen />
            <AnimeOverlay />
            <Character />
            <Props />
            <CatLayer />
            <Tints />
            <Glows />
            <ComicCaptionLayers />
            <ForegroundCable />
            <ForegroundMug />
            <ForegroundLeaves />
            <Hotspots />
          </Camera>
        </div>
        <div className="whip-streaks" data-el="whip" aria-hidden />
        <Toast />
      </div>
      <Hud />
      <SoundButton />
      <Scrubber />
      <Intro />
      <AutoplayControls />
      <Confetti />
      <Loader voiceFiles={voiceFiles} />
    </section>
  );
}
