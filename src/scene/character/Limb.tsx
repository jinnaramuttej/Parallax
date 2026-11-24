import type { ReactNode } from "react";
import type { RotationJoint } from "./poses";

type LimbProps = {
  joint: RotationJoint;
  /** Joint position in the parent's coordinates. */
  at: [number, number];
  length: number;
  width: number;
  color: string;
  rotate: number;
  children?: ReactNode;
};

/**
 * One limb segment: a static wrapper puts the joint at the origin, and the
 * inner <g data-j> is what the timeline rotates (svgOrigin "0 0").
 */
export function Limb({
  joint,
  at,
  length,
  width,
  color,
  rotate,
  children,
}: LimbProps) {
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <g data-j={joint} transform={`rotate(${rotate})`}>
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={length}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
        />
        {children}
      </g>
    </g>
  );
}
