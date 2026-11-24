import { ParallaxLayer } from "@/components/ParallaxLayer";
import { Head } from "./Head";
import { Limb } from "./Limb";
import { POSES } from "./poses";

function Shoe() {
  return <path d="M-12 52H12A12 12 0 0 1 24 64V72H-12Z" fill="var(--ink)" />;
}

function Hand({ color }: { color: string }) {
  return <circle cx="0" cy="56" r="10" fill={color} />;
}

/** Can held in the near hand during the fridge run. */
function HandCan() {
  return (
    <g data-el="hand-can" opacity="0">
      <rect x="-9" y="44" width="18" height="32" rx="4" fill="var(--can)" />
      <rect x="-8" y="42" width="16" height="4" rx="2" fill="var(--can-dark)" />
      <path d="M2 52L-3 61H1L-1 68L5 58H1Z" fill="var(--paper)" />
    </g>
  );
}

function Torso() {
  return (
    <g>
      <rect
        x="-1"
        y="-124"
        width="13"
        height="18"
        rx="5"
        fill="var(--skin-dark)"
      />
      <rect
        x="-31"
        y="-4"
        width="64"
        height="22"
        rx="11"
        fill="var(--indigo)"
      />
      <path
        d="M-30 6C-33 -30 -31 -84 -16 -106C-6 -114 14 -114 22 -106C34 -86 36 -36 33 6Z"
        fill="var(--accent)"
      />
      <path
        d="M-8 -32H24A6 6 0 0 1 30 -26V-18H-14V-26A6 6 0 0 1 -8 -32Z"
        fill="var(--accent-dark)"
      />
      <path
        d="M-16 -104C-32 -104 -36 -88 -28 -78C-22 -90 -12 -98 0 -102Z"
        fill="var(--accent-dark)"
      />
      <path
        d="M14 -104V-86M21 -104V-90"
        stroke="var(--paper)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * The guy, built as separate joint groups so the timeline can pose him.
 * Initial transforms come from the "asleep" pose so the server render
 * already shows him in bed.
 */
export function Character() {
  const p = POSES.asleep;
  return (
    <ParallaxLayer speed={1} className="scene-canvas" aria-hidden>
      <svg viewBox="0 0 1600 900">
        <g data-el="character">
          <g data-j="posX" transform={`translate(${p.x} 0)`}>
            <g data-j="posY" transform={`translate(0 ${p.y})`}>
              <g data-j="face" transform="scale(1 1)">
                <g data-j="body" transform={`rotate(${p.body})`}>
                  <Limb
                    joint="legFarU"
                    at={[0, 0]}
                    length={70}
                    width={26}
                    color="var(--indigo-dark)"
                    rotate={p.legFarU}
                  >
                    <Limb
                      joint="legFarL"
                      at={[0, 70]}
                      length={56}
                      width={23}
                      color="var(--indigo-dark)"
                      rotate={p.legFarL}
                    >
                      <Shoe />
                    </Limb>
                  </Limb>
                  <Limb
                    joint="legNearU"
                    at={[0, 0]}
                    length={70}
                    width={27}
                    color="var(--indigo)"
                    rotate={p.legNearU}
                  >
                    <Limb
                      joint="legNearL"
                      at={[0, 70]}
                      length={56}
                      width={24}
                      color="var(--indigo)"
                      rotate={p.legNearL}
                    >
                      <Shoe />
                    </Limb>
                  </Limb>
                  <g data-j="torso" transform={`rotate(${p.torso})`}>
                    <Limb
                      joint="armFarU"
                      at={[6, -98]}
                      length={56}
                      width={21}
                      color="var(--accent-dark)"
                      rotate={p.armFarU}
                    >
                      <Limb
                        joint="armFarL"
                        at={[0, 56]}
                        length={48}
                        width={19}
                        color="var(--accent-dark)"
                        rotate={p.armFarL}
                      >
                        <Hand color="var(--skin-dark)" />
                      </Limb>
                    </Limb>
                    <Torso />
                    <g transform="translate(4 -114)">
                      <g data-j="head" transform={`rotate(${p.head})`}>
                        <Head />
                      </g>
                    </g>
                    <Limb
                      joint="armNearU"
                      at={[6, -98]}
                      length={56}
                      width={22}
                      color="var(--accent)"
                      rotate={p.armNearU}
                    >
                      <Limb
                        joint="armNearL"
                        at={[0, 56]}
                        length={48}
                        width={20}
                        color="var(--accent)"
                        rotate={p.armNearL}
                      >
                        <Hand color="var(--skin)" />
                        <HandCan />
                      </Limb>
                    </Limb>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </ParallaxLayer>
  );
}
