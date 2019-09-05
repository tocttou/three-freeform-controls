import * as THREE from "three";
import Octahedron from "../primitives/octahedron";

export default class Pick extends THREE.Group {
  private readonly octahedron: Octahedron;

  constructor() {
    super();
    this.octahedron = new Octahedron();
    this.add(this.octahedron);
  }
}
