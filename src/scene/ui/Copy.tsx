import type { CSSProperties } from "react";
import { COPY } from "../story";

/**
 * Headline + subtext for every stop, on a sticky note stuck to the wall
 * (legible over sky or wall at any hour). The timeline reveals the text
 * with SplitText.
 */
export function CopyLayer() {
  return (
    <div className="copy-layer">
      {COPY.map((c, i) => (
        <div
          key={i}
          data-copy={i}
          className={`copy copy-${c.zone}`}
          style={i === 0 ? undefined : { visibility: "hidden", opacity: 0 }}
        >
          <div
            className="copy-note"
            style={{ "--note": c.note, "--tilt": `${c.tilt}deg` } as CSSProperties}
          >
            <h2 className="copy-title">{c.title}</h2>
            <p className="copy-sub">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
