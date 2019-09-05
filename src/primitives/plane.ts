import * as THREE from "three";
import {
  DEFAULT_COLOR_RING,
  DEFAULT_PLANE_HEIGHT,
  DEFAULT_PLANE_SEGMENTS,
  DEFAULT_PLANE_WIDTH,
  PICK_PLANE_OPACITY
} from "../utils/constants";

export default class Plane extends THREE.Mesh {
  constructor(color = DEFAULT_COLOR_RING) {
    super();
    this.geometry = new THREE.PlaneGeometry(
      DEFAULT_PLANE_WIDTH,
      DEFAULT_PLANE_HEIGHT,
      DEFAULT_PLANE_SEGMENTS
    );
    this.material = new THREE.MeshBasicMaterial({
      color,
      depthTest: false,
      side: THREE.DoubleSide,
      transparent: true
    });
    this.material.opacity = PICK_PLANE_OPACITY.INACTIVE;
  }
}
