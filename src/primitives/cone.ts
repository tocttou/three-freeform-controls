import * as THREE from "three";
import { DEFAULT_CONTROLS_OPACITY, DEFAULT_RADIAL_SEGMENTS } from "../utils/constants";

export default class Cone extends THREE.Mesh {
  constructor(color: string) {
    super();
    this.geometry = new THREE.ConeGeometry(1, 1, DEFAULT_RADIAL_SEGMENTS);
    this.material = new THREE.MeshBasicMaterial({ color });
    this.material.transparent = true;
    this.material.opacity = DEFAULT_CONTROLS_OPACITY;
  }
}
