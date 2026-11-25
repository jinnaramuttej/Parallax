import { CAT_HIP, CAT_POSES, type CatJoint, type CatPose, type CatPoseName } from "./catPoses";

const fill = {
  fur: "var(--cat)",
  dark: "var(--cat-dark)",
  light: "var(--cat-light)",
  nose: "var(--cat-nose)",
};

/** One leg: the hip is the joint; back legs carry a haunch. */
function Leg({
  joint,
  at,
  rot,
  back,
  far,
  reach,
}: {
  joint: CatJoint;
  at: [number, number];
  rot: number;
  back?: boolean;
  far?: boolean;
  /** Front legs only: extra length (sitting), as a translate of the paw half. */
  reach?: number;
}) {
  const c = far ? fill.dark : fill.fur;
  const line = <line x1="0" y1="0" x2="0" y2="14" stroke={c} strokeWidth="7.5" strokeLinecap="round" />;
  const paw = <ellipse cx="1.8" cy="15" rx="5" ry="3.2" fill={far ? c : fill.light} />;
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g data-cj={joint} transform={`rotate(${rot})`}>
        {back && <ellipse cx="-1" cy="1" rx="9.5" ry="10.5" fill={c} />}
        {line}
        {reach === undefined ? (
          paw
        ) : (
          <g data-cj={`${joint}Reach`} transform={`translate(0 ${reach})`}>
            {line}
            {paw}
          </g>
        )}
      </g>
    </g>
  );
}

function Ear({ joint, at, rot, far }: { joint: CatJoint; at: [number, number]; rot: number; far?: boolean }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g data-cj={joint} transform={`rotate(${rot})`}>
        <g data-cel={far ? "ear-far-idle" : "ear-near-idle"} transform="rotate(0)">
          <path d="M-6.5 2L-1 -12L6.5 2Z" fill={far ? fill.dark : fill.fur} />
          {!far && <path d="M-3.5 1L-1 -6.5L3 1Z" fill={fill.nose} />}
        </g>
      </g>
    </g>
  );
}

function Head({ p }: { p: CatPose }) {
  const eyes = (name: CatPose["eyes"]) => ({ "data-cel": `eyes-${name}`, opacity: p.eyes === name ? 1 : 0 });
  return (
    <g transform="translate(22 -8)">
      <g data-cj="head" transform={`rotate(${p.head})`}>
        <Ear joint="earFar" at={[1, -18]} rot={p.earFar} far />
        <Ear joint="earNear" at={[12, -20]} rot={p.earNear} />
        <ellipse cx="10" cy="-10" rx="14" ry="12.5" fill={fill.fur} />
        <path d="M-2 -16C1 -19 4 -20 7 -20" stroke={fill.dark} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <ellipse cx="19" cy="-4.5" rx="6.5" ry="4.8" fill={fill.light} />
        <path d="M21.6 -7.4H25.2L23.4 -5.2Z" fill={fill.nose} />
        <path d="M23.4 -5.2Q23 -2.6 20.6 -2.8" stroke="var(--ink)" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M22 -4.4L33 -6.4M22 -3.2L33 -1.6" stroke={fill.light} strokeWidth="0.9" strokeLinecap="round" />
        <g {...eyes("open")}>
          <ellipse cx="8.2" cy="-12" rx="2.2" ry="2.9" fill="var(--sun)" />
          <ellipse cx="16.4" cy="-12" rx="2.6" ry="3.2" fill="var(--sun)" />
          <ellipse cx="8.8" cy="-12" rx="0.9" ry="2.4" fill="var(--ink)" />
          <ellipse cx="17.1" cy="-12" rx="1" ry="2.6" fill="var(--ink)" />
        </g>
        <g {...eyes("closed")} stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M5.8 -11.4Q8.2 -9 10.6 -11.4M13.8 -11.4Q16.4 -9 19 -11.4" />
        </g>
        <g {...eyes("wide")}>
          <circle cx="7.8" cy="-12.4" r="3.6" fill="var(--paper)" />
          <circle cx="16.6" cy="-12.4" r="4.2" fill="var(--paper)" />
          <circle cx="8.4" cy="-12.4" r="1.3" fill="var(--ink)" />
          <circle cx="17.4" cy="-12.4" r="1.5" fill="var(--ink)" />
        </g>
      </g>
    </g>
  );
}

function Tail({ p }: { p: CatPose }) {
  return (
    <g data-cel="tail-up" opacity={p.tailWrap ? 0 : 1} transform="translate(-27 -2)">
      <g data-cj="tail" transform={`rotate(${p.tail})`}>
        <g data-cel="tail-idle" transform="rotate(0)">
          <path d="M0 0C-10 -2 -18 -9 -20 -20" stroke={fill.fur} strokeWidth="7" strokeLinecap="round" fill="none" />
          <g transform="translate(-20 -20)">
            <g data-cj="tailTip" transform={`rotate(${p.tailTip})`}>
              <path d="M0 0C-1 -7 1 -12 6 -15" stroke={fill.dark} strokeWidth="6.6" strokeLinecap="round" fill="none" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/**
 * The cat, as separate groups (head, ears, body, tail, paws), drawn facing
 * right with its feet at the origin. `which` scopes the joints so the
 * timeline can drive the room cat and the shoulder cat separately.
 */
export function CatRig({
  which,
  pose = "asleep",
  x = 0,
  y = 0,
  face = 1,
  opacity,
}: {
  which: string;
  pose?: CatPoseName;
  x?: number;
  y?: number;
  face?: 1 | -1;
  opacity?: number;
}) {
  const p: CatPose = CAT_POSES[pose];
  return (
    <g data-cat={which} opacity={opacity}>
      <g data-cj="posX" transform={`translate(${x} 0)`}>
        <g data-cj="posY" transform={`translate(0 ${y})`}>
          <g data-cj="squash" transform="scale(1 1)">
            <g data-cj="face" transform={`scale(${face} 1)`}>
              <g data-cj="hips" transform={`translate(0 ${-CAT_HIP + p.drop})`}>
                <g data-cj="body" transform={`rotate(${p.body})`}>
                  <Tail p={p} />
                  <Leg joint="frontFar" at={[17, 6]} rot={p.frontFar} reach={p.reach} far />
                  <Leg joint="backFar" at={[-17, 6]} rot={p.backFar} back far />
                  <path
                    data-cel="fur"
                    opacity={p.fur ? 1 : 0}
                    d="M-29 2L-34 -8L-26 -8L-28 -18L-19 -13L-16 -24L-9 -15L-3 -26L3 -15L9 -25L12 -13L20 -21L20 -9L28 -12L26 -3Z"
                    fill={fill.fur}
                  />
                  <path
                    d="M-29 1C-30 -9 -21 -14 -7 -13C7 -12 19 -15 26 -8C31 -3 29 8 18 10H-19C-26 10 -29 6 -29 1Z"
                    fill={fill.fur}
                  />
                  <path d="M-8 10C-3 5 10 4 19 9.6Z" fill={fill.light} />
                  <path
                    d="M-16 -12.6C-14 -8 -14 -5 -17 -2M-7 -13C-5 -8 -6 -5 -8 -2M2 -12.8C4 -8 3 -5 1 -2"
                    stroke={fill.dark}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Leg joint="backNear" at={[-17, 6]} rot={p.backNear} back />
                  <Leg joint="frontNear" at={[17, 6]} rot={p.frontNear} reach={p.reach} />
                  <g data-cel="tail-wrap" opacity={p.tailWrap ? 1 : 0}>
                    <path
                      d="M-27 3C-34 12 -22 13 -4 12.5C10 12 22 12 28 6"
                      stroke={fill.fur}
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path d="M21 10.6C24.5 9.6 26.6 8 28 6" stroke={fill.dark} strokeWidth="6.6" strokeLinecap="round" fill="none" />
                  </g>
                  <Head p={p} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}
