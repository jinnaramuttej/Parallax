import { ImageResponse } from "next/og";

export const alt = "24 Hours of a Dev: a developer's day (and his cat's) in ten scroll-driven acts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card: a night window, the title on a sticky note, and the 3 AM clock. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(#0d0f2e, #2c2a68)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "44px 52px",
            background: "#8be04e",
            color: "#1f1b3d",
            transform: "rotate(-2deg)",
            boxShadow: "0 14px 0 -4px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>24 Hours</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>of a Dev</div>
          <div style={{ marginTop: 22, fontSize: 30 }}>5:59 AM alarm to 3 AM deploy</div>
          <div style={{ marginTop: 8, fontSize: 26 }}>Ten acts, one cat. Scroll or press play.</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff8ec",
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              background: "#f4efe1",
              marginBottom: 30,
            }}
          />
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>3:00 AM</div>
        </div>
      </div>
    ),
    size,
  );
}
