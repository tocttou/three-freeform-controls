import * as THREE from "three";
import {
  DEFAULT_COLOR_RING,
  DEFAULT_RING_INNER_RADIUS,
  DEFAULT_RING_OUTER_RADIUS,
  DEFAULT_RING_THETA_SEGMENTS
} from "../utils/constants";

export default class Ring extends THREE.Mesh {
  constructor(color = DEFAULT_COLOR_RING) {
    super();
    this.geometry = new THREE.RingGeometry(
      DEFAULT_RING_INNER_RADIUS,
      DEFAULT_RING_OUTER_RADIUS,
      DEFAULT_RING_THETA_SEGMENTS
    );
    this.material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  }
}
