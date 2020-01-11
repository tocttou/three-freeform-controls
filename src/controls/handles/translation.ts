import * as THREE from "three";
import Cone from "../../primitives/cone";
import {
  DEFAULT_COLOR_ARROW,
  DEFAULT_CONE_HEIGHT,
  DEFAULT_CONE_RADIUS,
  DEFAULT_LINE_HEIGHT
} from "../../utils/constants";
import Line from "../../primitives/line";
import { TranslationGroup } from "./index";

export default class Translation extends TranslationGroup {
  private readonly cone: Cone;
  private readonly line: Line;
  public parallel = new THREE.Vector3(0, 1, 0);

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

  /**
   * @hidden
   */
  public getInteractiveObjects = () => {
    return [this.cone];
  };

  public setColor = (color: string) => {
    const coneMaterial = this.cone.material as THREE.MeshBasicMaterial;
    const lineMaterial = this.line.material as THREE.MeshBasicMaterial;
    coneMaterial.color.set(color);
    lineMaterial.color.set(color);
  };
}
