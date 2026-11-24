import { STOPS } from "../timing";

/** Temporary timing check: one label per stop, shown during its hold. */
export function StopLabels() {
  return (
    <div className="stop-labels" aria-hidden>
      {STOPS.map((stop) => (
        <p
          key={stop.index}
          data-stop-label={stop.index}
          className="stop-label"
          style={stop.index === 0 ? undefined : { visibility: "hidden", opacity: 0 }}
        >
          <span>Stop {stop.index}</span>
          {stop.time}: {stop.name}
        </p>
      ))}
    </div>
  );
}
