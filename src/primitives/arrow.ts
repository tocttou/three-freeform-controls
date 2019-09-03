import * as THREE from "three";
import Cone from "./cone";
import Cylinder from "./cylinder";
import {
  DEFAULT_COLOR_ARROW,
  DEFAULT_CONE_HEIGHT,
  DEFAULT_CONE_RADIUS,
  DEFAULT_CYLINDER_HEIGHT,
  DEFAULT_CYLINDER_RADIUS
} from "../utils/constants";

export default class Arrow extends THREE.Group {
  private readonly cone: Cone;
  private readonly cylinder: Cylinder;
  constructor(color = DEFAULT_COLOR_ARROW) {
    super();
    this.cone = new Cone(color);
    this.cylinder = new Cylinder(color);

    this.cone.geometry.scale(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT, DEFAULT_CONE_RADIUS);
    this.cylinder.geometry.scale(
      DEFAULT_CYLINDER_RADIUS,
      DEFAULT_CYLINDER_HEIGHT,
      DEFAULT_CYLINDER_RADIUS
    );

    this.cylinder.translateY(DEFAULT_CYLINDER_HEIGHT / 2);
    this.cone.translateY(DEFAULT_CYLINDER_HEIGHT);

    this.add(this.cone);
    this.add(this.cylinder);
  }
}
