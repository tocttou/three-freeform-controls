import * as THREE from "three";
import {
  DEFAULT_CONE_HEIGHT,
  DEFAULT_CONE_RADIUS,
  DEFAULT_CONTROLS_OPACITY,
  DEFAULT_RADIAL_SEGMENTS
} from "../utils/constants";

export default class Cone extends THREE.Mesh {
  constructor(color: string) {
    super();
    this.geometry = new THREE.ConeGeometry(
      DEFAULT_CONE_RADIUS,
      DEFAULT_CONE_HEIGHT,
      DEFAULT_RADIAL_SEGMENTS
    );
    this.material = new THREE.MeshBasicMaterial({ color, depthTest: false });
    this.material.transparent = true;
    this.material.opacity = DEFAULT_CONTROLS_OPACITY;
  }
}
