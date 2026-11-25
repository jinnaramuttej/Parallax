import type { ReactNode } from "react";

/**
 * The camera: one wrapper around every scene layer. The master timeline
 * drives its transform (pan, zoom, tilt) from the shots in
 * src/config/shots.ts, so new camera moves are config edits, not code.
 * Depth parallax for layers off the room plane is applied on top (see
 * src/scene/timeline/camera.ts).
 */
export function Camera({ children }: { children: ReactNode }) {
  return (
    <div className="scene-camera" data-camera>
      {children}
    </div>
  );
}
