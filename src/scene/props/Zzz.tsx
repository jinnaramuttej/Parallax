import { box } from "../viewport";

/**
 * Floating Zs above the sleeping guy. HTML rather than SVG so the CSS float
 * animation stays on the compositor (no repaint of the props layer).
 * Opacity is driven by the timeline.
 */
export function Zzz() {
  return (
    <div data-el="zzz" className="zzz" style={box(150, 520, 120, 100)}>
      <span className="zzz-1">z</span>
      <span className="zzz-2">z</span>
      <span className="zzz-3">Z</span>
    </div>
  );
}
