import {
  DEFAULT_COLOR_RING,
  DEFAULT_PLANE_HEIGHT,
  DEFAULT_PLANE_SEGMENTS,
  DEFAULT_PLANE_WIDTH,
  PICK_PLANE_OPACITY,
} from "../utils/constants";
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export default class Plane extends Mesh {
  constructor(
    color = DEFAULT_COLOR_RING,
    width = DEFAULT_PLANE_WIDTH,
    height = DEFAULT_PLANE_HEIGHT
  ) {
    super();
    this.geometry = new PlaneGeometry(width, height, DEFAULT_PLANE_SEGMENTS);
    this.material = new MeshBasicMaterial({
      color,
      depthTest: false,
      side: DoubleSide,
      transparent: true,
    });
    this.material.opacity = PICK_PLANE_OPACITY.INACTIVE;
  }
}
