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
import { Glows } from "./layers/Glows";
import { MonitorScreen } from "./layers/MonitorScreen";
import { Tints } from "./layers/Tints";
import { Props } from "./props/Props";
import { Room } from "./room/Room";
import { Clouds } from "./layers/Clouds";
import { Sky } from "./layers/Sky";
import { Skyline } from "./layers/Skyline";
import { Stars } from "./layers/Stars";
import { buildMasterTimeline } from "./timeline/master";
import { STOPS, TOTAL, UNIT_VH } from "./timing";
import { Hud } from "./ui/Hud";
import { CopyLayer } from "./ui/Copy";
import { setupInteractions } from "./interactions";
import { Confetti } from "./ui/Confetti";
import { Hotspots } from "./ui/Hotspots";
import { Loader } from "./ui/Loader";
import { ScrollHint } from "./ui/ScrollHint";
import { Scrubber } from "./ui/Scrubber";
import { measureViewport } from "./viewport";

export function Scene() {
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

    return () => {
      stopInteractions();
      mm.revert();
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="scene-track"
      style={{ height: `calc(${(TOTAL * UNIT_VH).toFixed(2)}svh + 100svh)` }}
      data-total={TOTAL}
      data-anchors={JSON.stringify(STOPS.map((s) => s.anchor))}
      data-labels={JSON.stringify(STOPS.map((s) => `${s.time} ${s.name}`))}
      aria-label="A developer's day, from 5:59 AM to 3 AM"
    >
      <h1 className="sr-only">24 Hours of a Dev</h1>
      <div ref={stageRef} className="scene-stage" data-scene-stage>
        <div className="scene-shake" data-el="shake">
          <Sky />
          <Stars />
          <Celestial />
          <Clouds />
          <Skyline />
          <Room />
          <MonitorScreen />
          <Character />
          <Props />
          <Tints />
          <Glows />
          <ForegroundCable />
          <ForegroundMug />
          <ForegroundLeaves />
          <Hotspots />
        </div>
        <CopyLayer />
      </div>
      <Hud />
      <Scrubber />
      <ScrollHint />
      <Confetti />
      <Loader />
    </section>
  );
}
