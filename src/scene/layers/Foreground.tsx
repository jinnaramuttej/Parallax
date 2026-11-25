import { ParallaxLayer } from "@/components/ParallaxLayer";
import { box } from "../viewport";

/**
 * Big out-of-focus mug in the bottom-left corner. Purely a foreground depth
 * layer; the real coffee (steam, sip, click) is the mug on the desk.
 */
export function ForegroundMug() {
  return (
    <ParallaxLayer speed={1.45} className="scene-canvas" aria-hidden>
      <div className="fg-mug" style={box(60, 770, 250, 220)}>
        <svg
          viewBox="60 770 250 220"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <filter id="blur-mug" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          <g filter="url(#blur-mug)">
            <path
              d="M246 830C292 830 300 900 252 912"
              stroke="var(--paper)"
              strokeWidth="18"
              fill="none"
            />
            <path
              d="M80 800H256V930C256 970 230 990 190 990H146C106 990 80 970 80 930Z"
              fill="var(--paper)"
            />
            <rect x="80" y="836" width="176" height="26" fill="var(--accent)" />
            <ellipse
              cx="168"
              cy="800"
              rx="88"
              ry="14"
              fill="var(--wood-dark)"
            />
            <ellipse cx="168" cy="802" rx="76" ry="9" fill="var(--wood)" />
          </g>
        </svg>
      </div>
    </ParallaxLayer>
  );
}

/** Desk cables snaking out of the bottom-right corner. */
export function ForegroundCable() {
  return (
    <ParallaxLayer speed={1.3} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <defs>
          <filter id="blur-cable" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <g filter="url(#blur-cable)">
          <path
            d="M1760 820C1560 800 1460 900 1300 940"
            stroke="var(--ink)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1760 870C1600 860 1520 930 1420 960"
            stroke="var(--indigo-dark)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </ParallaxLayer>
  );
}

/** Out-of-focus leaves hanging into the top-right corner. */
export function ForegroundLeaves() {
  return (
    <ParallaxLayer speed={1.7} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <defs>
          <filter id="blur-leaves" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <g filter="url(#blur-leaves)">
          <path
            d="M1520 -40C1530 60 1500 150 1450 210"
            stroke="var(--plant-dark)"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M1456 200C1390 210 1340 180 1330 130C1380 120 1430 140 1456 200Z"
            fill="var(--plant)"
          />
          <path
            d="M1500 110C1440 90 1410 40 1420 0C1470 10 1500 60 1500 110Z"
            fill="var(--plant-dark)"
          />
          <path
            d="M1514 60C1580 40 1640 70 1660 120C1600 140 1540 110 1514 60Z"
            fill="var(--plant)"
          />
          <path
            d="M1476 170C1530 190 1560 240 1556 290C1500 270 1474 220 1476 170Z"
            fill="var(--plant-dark)"
          />
        </g>
      </svg>
    </ParallaxLayer>
  );
}
