import type { CSSProperties, ReactNode } from "react";

/**
 * Data-driven prop states. A prop renders every state once; only `state` is
 * visible at first. The master timeline (or a config) switches states later
 * by fading [data-prop="id"] > [data-state="name"] groups, opacity only.
 * See src/scene/timeline/propState.ts.
 */
export type StatefulProps<S extends string> = {
  /** Which state is showing initially. */
  state?: S;
  /** Whether the whole prop is visible initially. */
  visible?: boolean;
};

export function StatefulG<S extends string>({
  id,
  state,
  visible = true,
  states,
  className,
}: {
  id: string;
  state: S;
  visible?: boolean;
  states: Record<S, ReactNode>;
  className?: string;
}) {
  return (
    <g data-prop={id} opacity={visible ? 1 : 0} className={className}>
      {(Object.keys(states) as S[]).map((name) => (
        <g key={name} data-state={name} opacity={name === state ? 1 : 0}>
          {states[name]}
        </g>
      ))}
    </g>
  );
}

/** HTML version (for props drawn with CSS, e.g. particles and glows). */
export function StatefulDiv<S extends string>({
  id,
  state,
  visible = true,
  states,
  className,
  style,
}: {
  id: string;
  state: S;
  visible?: boolean;
  states: Record<S, ReactNode>;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div data-prop={id} className={className} style={{ ...style, opacity: visible ? 1 : 0 }}>
      {(Object.keys(states) as S[]).map((name) => (
        <div key={name} data-state={name} className="prop-state" style={{ opacity: name === state ? 1 : 0 }}>
          {states[name]}
        </div>
      ))}
    </div>
  );
}
