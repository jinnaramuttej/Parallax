import { box } from "../viewport";

/**
 * Steam over the desk mug (HTML so the rising loop stays on the
 * compositor), the steam heart, and the puffs for the click burst.
 */
export function DeskSteam() {
  return (
    <>
      <div className="fg-steam desk-steam" data-el="steam" style={box(646, 470, 44, 110)}>
        <span className="wisp wisp-1" />
        <span className="wisp wisp-2" />
        <span className="wisp wisp-3" />
      </div>
      <div className="fg-heart" data-el="steam-heart" style={box(664, 436, 70, 66)}>
        <svg viewBox="0 0 140 130">
          <path
            d="M70 118C30 88 10 66 10 42C10 22 26 10 42 10C55 10 65 18 70 28C75 18 85 10 98 10C114 10 130 22 130 42C130 66 110 88 70 118Z"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="fg-burst" data-el="steam-burst" style={box(620, 450, 100, 150)}>
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="puff" data-puff={i} />
        ))}
      </div>
    </>
  );
}
