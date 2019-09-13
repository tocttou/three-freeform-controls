import * as THREE from "three";
import { DEFAULT_OCTAHEDRON_RADIUS } from "../utils/constants";

export default class Octahedron extends THREE.Mesh {
  constructor(color: string) {
    super();
    this.geometry = new THREE.OctahedronBufferGeometry(DEFAULT_OCTAHEDRON_RADIUS, 0);
    this.material = new THREE.MeshBasicMaterial({
      color,
      depthTest: false,
      transparent: true,
      side: THREE.DoubleSide
    });
  }
}
