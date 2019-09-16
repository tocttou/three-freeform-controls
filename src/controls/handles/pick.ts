import * as THREE from "three";
import Octahedron from "../../primitives/octahedron";
import HandlesGroup from "./index";

export default class Pick extends HandlesGroup {
  private readonly octahedron: Octahedron;

  constructor() {
    super();
    this.octahedron = new Octahedron("white");
    this.add(this.octahedron);
  }

  public getInteractiveObjects(): THREE.Object3D[] {
    return [this.octahedron];
  }
}
