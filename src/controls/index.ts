import * as THREE from "three";
import Translation from "./translation";
import { DEFAULT_CONTROLS_SEPARATION } from "../utils/constants";
import Rotation from "./rotation";

export default class Controls extends THREE.Group {
  private objectWorldPosition = new THREE.Vector3();
  private objectWorldQuaternion = new THREE.Quaternion();
  private objectWorldScale = new THREE.Vector3();
  private minBox = new THREE.Vector3();
  private maxBox = new THREE.Vector3();

  constructor(private object: THREE.Mesh) {
    super();

    this.computeObjectBounds();
    this.addTranslation();
    this.addRotation();
  }

  private addTranslation = () => {
    const translationXP = new Translation("red");
    const translationYP = new Translation("green");
    const translationZP = new Translation("blue");

    const translationXN = new Translation("red");
    const translationYN = new Translation("green");
    const translationZN = new Translation("blue");

    translationXP.translateX(this.maxBox.x);
    translationYP.translateY(this.maxBox.y);
    translationZP.translateZ(this.maxBox.z);

    translationXN.translateX(this.minBox.x);
    translationYN.translateY(this.minBox.y);
    translationZN.translateZ(this.minBox.z);

    translationXP.rotateZ(-Math.PI / 2);
    translationZP.rotateX(Math.PI / 2);

    translationXN.rotateZ(Math.PI / 2);
    translationYN.rotateX(Math.PI);
    translationZN.rotateX(-Math.PI / 2);

    translationXP.up = new THREE.Vector3(0, 1, 0);
    translationYP.up = new THREE.Vector3(0, 0, 1);
    translationZP.up = new THREE.Vector3(0, 1, 0);

    translationXN.up = new THREE.Vector3(0, 1, 0);
    translationYN.up = new THREE.Vector3(0, 0, 1);
    translationZN.up = new THREE.Vector3(0, 1, 0);

    this.add(translationXP);
    this.add(translationYP);
    this.add(translationZP);

    this.add(translationXN);
    this.add(translationYN);
    this.add(translationZN);
  };

  private addRotation = () => {
    const rotationX = new Rotation("red");
    const rotationY = new Rotation("green");
    const rotationZ = new Rotation("blue");

    rotationX.up = new THREE.Vector3(1, 0, 0);
    rotationY.up = new THREE.Vector3(0, 1, 0);
    rotationZ.up = new THREE.Vector3(0, 0, 1);

    rotationX.rotateY(Math.PI / 2);
    rotationY.rotateX(Math.PI / 2);

    this.add(rotationX);
    this.add(rotationY);
    this.add(rotationZ);
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
