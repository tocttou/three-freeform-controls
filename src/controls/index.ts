import * as THREE from "three";
import Arrow from "../primitives/arrow";
import { DEFAULT_CONTROLS_SEPARATION } from "../utils/constants";
import Ring from "../primitives/ring";

export default class Controls extends THREE.Group {
  private objectWorldPosition = new THREE.Vector3();
  private objectWorldQuaternion = new THREE.Quaternion();
  private objectWorldScale = new THREE.Vector3();
  private minBox = new THREE.Vector3();
  private maxBox = new THREE.Vector3();

  constructor(private object: THREE.Mesh) {
    super();

    this.computeObjectBounds();
    this.addArrows();
    this.addRings();
  }

  private addArrows = () => {
    const arrowXP = new Arrow("red");
    const arrowYP = new Arrow("green");
    const arrowZP = new Arrow("blue");

    const arrowXN = new Arrow("red");
    const arrowYN = new Arrow("green");
    const arrowZN = new Arrow("blue");

    arrowXP.translateX(this.maxBox.x);
    arrowYP.translateY(this.maxBox.y);
    arrowZP.translateZ(this.maxBox.z);

    arrowXN.translateX(this.minBox.x);
    arrowYN.translateY(this.minBox.y);
    arrowZN.translateZ(this.minBox.z);

    arrowXP.rotateZ(-Math.PI / 2);
    arrowZP.rotateX(Math.PI / 2);

    arrowXN.rotateZ(Math.PI / 2);
    arrowYN.rotateX(Math.PI);
    arrowZN.rotateX(-Math.PI / 2);

    this.add(arrowXP);
    this.add(arrowYP);
    this.add(arrowZP);

    this.add(arrowXN);
    this.add(arrowYN);
    this.add(arrowZN);
  };

  private addRings = () => {
    const ringX = new Ring("red");
    const ringY = new Ring("green");
    const ringZ = new Ring("blue");

    ringX.rotateY(Math.PI / 2);
    ringY.rotateX(Math.PI / 2);

    this.add(ringX);
    this.add(ringY);
    this.add(ringZ);
  };

  private computeObjectBounds = () => {
    this.object.geometry.computeBoundingBox();
    const {
      boundingBox: { min, max }
    } = this.object.geometry;
    this.minBox.copy(min);
    this.maxBox.copy(max);
    this.minBox.addScalar(-DEFAULT_CONTROLS_SEPARATION);
    this.maxBox.addScalar(DEFAULT_CONTROLS_SEPARATION);
  };

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
