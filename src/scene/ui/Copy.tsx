import type { CSSProperties } from "react";
import { ACTS } from "@/config/acts";
import { CAPTIONS } from "@/config/captions";

/**
 * One sticky-note caption per act (text from src/config/captions.ts,
 * picked by each act's caption id). The timeline reveals them with SplitText.
 */
export function CopyLayer() {
  return (
    <div className="copy-layer">
      {ACTS.map((act, i) => {
        const c = CAPTIONS[act.caption];
        if (!c) return null;
        return (
          <div
            key={act.id}
            data-copy={act.id}
            className={`copy copy-${c.zone}`}
            style={i === 0 ? undefined : { visibility: "hidden", opacity: 0 }}
          >
            <div className="copy-note" style={{ "--note": c.note, "--tilt": `${c.tilt}deg` } as CSSProperties}>
              <h2 className="copy-title">{c.title}</h2>
              <p className="copy-sub">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
