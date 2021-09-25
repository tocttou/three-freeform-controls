import * as THREE from "three";
import {
  DEFAULT_COLOR_RING,
  DEFAULT_RING_NUM_POINTS,
  DEFAULT_RING_RADIUS
} from "../../utils/constants";
import Line from "../../primitives/line";
import Octahedron from "../../primitives/octahedron";
import { RotationGroup } from "./index";

export default class Rotation extends RotationGroup {
  private readonly ring: Line;
  private readonly handlebar: Octahedron;

  constructor(color = DEFAULT_COLOR_RING, ringRadius = DEFAULT_RING_RADIUS) {
    super();
    const ringNumberOfPoints = DEFAULT_RING_NUM_POINTS;
    const ringGeometry = new THREE.BufferGeometry();
    const angle = (2 * Math.PI) / ringNumberOfPoints;
    const vertices  =[];
    for (let i = 1; i < ringNumberOfPoints + 1; i++) {
      vertices.push(ringRadius * Math.cos(i * angle), ringRadius * Math.sin(i * angle), 0);
    }
    ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.ring = new Line(color, ringGeometry);
    this.handlebar = new Octahedron(color);
    this.handlebar.position.y = ringRadius;
    this.add(this.ring);
    this.add(this.handlebar);
  }

  /**
   * @hidden
   */
  public getInteractiveObjects = () => {
    return [this.handlebar];
  };

  public setColor = (color: string) => {
    const ringMaterial = this.ring.material as THREE.MeshBasicMaterial;
    const handlebarMaterial = this.handlebar.material as THREE.MeshBasicMaterial;
    ringMaterial.color.set(color);
    handlebarMaterial.color.set(color);
  };
}
