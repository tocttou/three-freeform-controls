import {

MeshBasicMaterial
} from "three";
import Octahedron from "../../primitives/octahedron";
import { PickGroup } from "./index";

export default class Pick extends PickGroup {
  private readonly octahedron: Octahedron;

  constructor() {
    super();
    this.octahedron = new Octahedron("white");
    this.add(this.octahedron);
  }

  /**
   * @hidden
   */
  public getInteractiveObjects = () => {
    return [this.octahedron];
  };

  public setColor = (color: string) => {
    const octahedronMaterial = this.octahedron.material as MeshBasicMaterial;
    octahedronMaterial.color.set(color);
  };
}
