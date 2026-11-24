import { TOTAL } from "../timing";
import type { CameraState } from "./camera";
import type { BuildContext } from "./master";

/** Camera path. A slow drift over the whole day so depth always reads. */
export function addCameraMoves({ tl }: BuildContext, cam: CameraState) {
  tl.fromTo(
    cam,
    { dx: -50, dy: 18, zoom: 1.03 },
    { dx: 50, dy: -18, zoom: 1.03, duration: TOTAL },
    0,
  );
}
