import * as THREE from "three";
import Arrow from "../primitives/arrow";
import { DEFAULT_CONTROLS_SEPARATION } from "../utils/constants";

export default class Controls extends THREE.Group {
  private objectWorldPosition = new THREE.Vector3();
  private objectWorldQuaternion = new THREE.Quaternion();
  private objectWorldScale = new THREE.Vector3();

  constructor(private object: THREE.Mesh) {
    super();

    this.object.geometry.computeBoundingBox();
    const {
      boundingBox: { min, max }
    } = this.object.geometry;
    max.addScalar(DEFAULT_CONTROLS_SEPARATION);
    min.addScalar(-DEFAULT_CONTROLS_SEPARATION);

    const arrowXP = new Arrow("red");
    const arrowYP = new Arrow("green");
    const arrowZP = new Arrow("blue");

    const arrowXN = new Arrow("red");
    const arrowYN = new Arrow("green");
    const arrowZN = new Arrow("blue");

    this.add(arrowXP);
    this.add(arrowYP);
    this.add(arrowZP);

    this.add(arrowXN);
    this.add(arrowYN);
    this.add(arrowZN);

    arrowXP.translateX(max.x);
    arrowYP.translateY(max.y);
    arrowZP.translateZ(max.z);

    arrowXN.translateX(min.x);
    arrowYN.translateY(min.y);
    arrowZN.translateZ(min.z);

    arrowXP.rotateZ(-Math.PI / 2);
    arrowZP.rotateX(Math.PI / 2);

    arrowXN.rotateZ(Math.PI / 2);
    arrowYN.rotateX(Math.PI);
    arrowZN.rotateX(-Math.PI / 2);
  }

  updateMatrixWorld(force?: boolean): void {
    this.object.updateMatrixWorld(force);

    this.object.matrixWorld.decompose(
      this.objectWorldPosition,
      this.objectWorldQuaternion,
      this.objectWorldScale
    );

    this.position.copy(this.objectWorldPosition);
    super.updateMatrixWorld(force);
  }
}
