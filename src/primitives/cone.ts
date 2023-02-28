import {
  DEFAULT_CONE_HEIGHT,
  DEFAULT_CONE_RADIUS,
  DEFAULT_CONTROLS_OPACITY,
  DEFAULT_RADIAL_SEGMENTS,
} from "../utils/constants";
import { ConeGeometry, Mesh, MeshBasicMaterial } from "three";

export default class Cone extends Mesh {
  constructor(color: string) {
    super();
    this.geometry = new ConeGeometry(
      DEFAULT_CONE_RADIUS,
      DEFAULT_CONE_HEIGHT,
      DEFAULT_RADIAL_SEGMENTS
    );
    this.material = new MeshBasicMaterial({ color, depthTest: false });
    this.material.transparent = true;
    this.material.opacity = DEFAULT_CONTROLS_OPACITY;
  }
}
