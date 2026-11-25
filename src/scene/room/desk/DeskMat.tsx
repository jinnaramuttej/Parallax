import type { StatefulProps } from "../../Stateful";

/** Desk mat under the keyboard and mouse. */
export function DeskMat({ visible = true }: StatefulProps<"on">) {
  return (
    <g data-prop="deskmat" opacity={visible ? 1 : 0}>
      <rect x="684" y="598" width="200" height="8" rx="3" fill="var(--indigo-dark)" />
      <rect x="688" y="598" width="192" height="2" rx="1" fill="var(--indigo)" />
    </g>
  );
}
