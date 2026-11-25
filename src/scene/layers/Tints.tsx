import { ParallaxLayer } from "@/components/ParallaxLayer";
import { screenPath } from "../room/layout";
import { WINDOW } from "../room/Wall";
import { Dust } from "../room/life/Dust";
import { box } from "../viewport";

// Everything except the window (the sky has its own colours) and the
// monitor screen (it stays bright at night).
const ROOM_MASK = [
  "M-700 -500H2300V1500H-700Z",
  `M${WINDOW.x} ${WINDOW.y}V${WINDOW.y + WINDOW.h}H${WINDOW.x + WINDOW.w}V${WINDOW.y}Z`,
  screenPath("main"),
  screenPath("second"),
  screenPath("laptop"),
].join(" ");

function Tint({ name }: { name: "dawn" | "golden" | "night" | "error" }) {
  return (
    <div className={`tint tint-${name}`} data-el={`tint-${name}`}>
      <svg viewBox="0 0 1600 900">
        <path d={ROOM_MASK} fillRule="evenodd" fill={`var(--tint-${name})`} />
      </svg>
    </div>
  );
}

/**
 * Time-of-day lighting for the room. Each tint is a multiply overlay whose
 * opacity reads a CSS variable (--dawn, --golden, --night) that the world
 * writes from dayProgress. Only opacity ever changes.
 */
export function Tints() {
  return (
    <ParallaxLayer
      speed={1}
      className="scene-canvas"
      data-el="tints"
      aria-hidden
    >
      <Tint name="dawn" />
      <Tint name="golden" />
      <Tint name="night" />
      <Tint name="error" />
      <div className="tint-vignette" data-el="vignette" />
      <div className="golden-beam" data-el="beam-morning" style={box(480, 70, 1000, 830)}>
        <svg viewBox="480 70 1000 830" preserveAspectRatio="none">
          <path d="M480 70H1120V470L1480 900H860L480 470Z" fill="var(--sun)" />
        </svg>
        <Dust seed={11} clip="polygon(0% 0%, 64% 0%, 64% 48.2%, 100% 100%, 38% 100%, 0% 48.2%)" />
      </div>
      <div className="golden-beam" data-el="beam-evening" style={box(140, 70, 1000, 830)}>
        <svg viewBox="140 70 1000 830" preserveAspectRatio="none">
          <path d="M480 70H1120V470L900 900H140L480 470Z" fill="var(--sun)" />
        </svg>
        <Dust seed={23} clip="polygon(34% 0%, 98% 0%, 98% 48.2%, 76% 100%, 0% 100%, 34% 48.2%)" />
      </div>
    </ParallaxLayer>
  );
}
