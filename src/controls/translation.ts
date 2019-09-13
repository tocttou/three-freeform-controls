import * as THREE from "three";
import Cone from "../primitives/cone";
import {
  DEFAULT_COLOR_ARROW,
  DEFAULT_CONE_HEIGHT,
  DEFAULT_CONE_RADIUS,
  DEFAULT_LINE_HEIGHT
} from "../utils/constants";
import ControlsGroup from "./controls-group";
import Line from "../primitives/line";

export default class Translation extends ControlsGroup {
  private readonly cone: Cone;
  private readonly line: Line;

  constructor(color = DEFAULT_COLOR_ARROW) {
    super();
    this.cone = new Cone(color);
    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, DEFAULT_LINE_HEIGHT, 0));

    this.line = new Line(color, lineGeometry);
    this.cone.geometry.scale(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT, DEFAULT_CONE_RADIUS);
    this.cone.translateY(DEFAULT_LINE_HEIGHT);

    this.add(this.cone);
    this.add(this.line);
  }

  public getInteractiveObjects(): THREE.Object3D[] {
    return [this.cone];
  }
}
