import { DEFAULT_OCTAHEDRON_RADIUS } from "../utils/constants";
import {DoubleSide, Mesh, MeshBasicMaterial, OctahedronBufferGeometry} from "three";

export default class Octahedron extends Mesh {
  constructor(color: string) {
    super();
    this.geometry = new OctahedronBufferGeometry(DEFAULT_OCTAHEDRON_RADIUS, 0);
    this.material = new MeshBasicMaterial({
      color,
      depthTest: false,
      transparent: true,
      side: DoubleSide
    });
  }
}
