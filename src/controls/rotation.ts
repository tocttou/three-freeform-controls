import * as THREE from "three";
import { DEFAULT_COLOR_RING } from "../utils/constants";
import Ring from "../primitives/ring";

export default class Rotation extends THREE.Group {
  private readonly ring: Ring;

  constructor(color = DEFAULT_COLOR_RING) {
    super();
    this.ring = new Ring(color);
    this.add(this.ring);
  }
}
