import * as THREE from "three";
import {
  DEFAULT_COLOR_RING,
  DEFAULT_RING_NUM_POINTS,
  DEFAULT_RING_RADIUS
} from "../utils/constants";
import Line from "../primitives/line";
import ControlsGroup from "./controls-group";
import Octahedron from "../primitives/octahedron";

export default class Rotation extends ControlsGroup {
  private readonly ring: Line;
  private readonly handlebar: Octahedron;

  constructor(color = DEFAULT_COLOR_RING) {
    super();
    const ringNumberOfPoints = DEFAULT_RING_NUM_POINTS;
    const ringRadius = DEFAULT_RING_RADIUS;
    const ringGeometry = new THREE.Geometry();
    const angle = (2 * Math.PI) / ringNumberOfPoints;
    for (let i = 1; i < ringNumberOfPoints + 1; i++) {
      ringGeometry.vertices.push(
        new THREE.Vector3(ringRadius * Math.cos(i * angle), ringRadius * Math.sin(i * angle), 0)
      );
    }
    this.ring = new Line(color, ringGeometry);
    this.handlebar = new Octahedron(color);
    this.handlebar.position.y = 1;
    this.add(this.ring);
    this.add(this.handlebar);
  }

  public getInteractiveObjects(): THREE.Object3D[] {
    return [this.handlebar];
  }
}
