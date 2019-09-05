import * as THREE from "three";
import Plane from "../primitives/plane";
import { DEFAULT_COLOR_PLANE } from "../utils/constants";

export default class PickPlane extends THREE.Group {
  public readonly plane: Plane;

  constructor(color = DEFAULT_COLOR_PLANE) {
    super();
    this.plane = new Plane(color);
    this.add(this.plane);
  }
}
