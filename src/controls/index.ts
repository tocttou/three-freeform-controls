import * as THREE from "three";
import Translation from "./translation";
import { DEFAULT_CONTROLS_SEPARATION } from "../utils/constants";
import Rotation from "./rotation";

enum HANDLE_NAMES {
  X = "x_handle",
  Y = "y_handle",
  Z = "z_handle"
}

export default class Controls extends THREE.Group {
  private handleTargetQuaternion = new THREE.Quaternion();
  private handleTargetEuler = new THREE.Euler();
  private objectWorldPosition = new THREE.Vector3();
  private objectTargetPosition = new THREE.Vector3();
  private objectTargetQuaternion = new THREE.Quaternion();
  private objectParentWorldPosition = new THREE.Vector3();
  private objectParentWorldQuaternion = new THREE.Quaternion();
  private objectParentWorldScale = new THREE.Vector3();
  private deltaQuaternion = new THREE.Quaternion();
  private touch1 = new THREE.Vector3();
  private touch2 = new THREE.Vector3();
  private minBox = new THREE.Vector3();
  private maxBox = new THREE.Vector3();
  private dragStartPoint = new THREE.Vector3();
  private dragIncrementalStartPoint = new THREE.Vector3();
  public isBeingDragged = false;

  constructor(public object: THREE.Mesh) {
    super();

    this.matrixAutoUpdate = true;
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

    translationXP.name = HANDLE_NAMES.X;
    translationYP.name = HANDLE_NAMES.Y;
    translationZP.name = HANDLE_NAMES.Z;

    translationXN.name = HANDLE_NAMES.X;
    translationYN.name = HANDLE_NAMES.Y;
    translationZN.name = HANDLE_NAMES.Z;

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

    rotationX.name = HANDLE_NAMES.X;
    rotationY.name = HANDLE_NAMES.Y;
    rotationZ.name = HANDLE_NAMES.Z;

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

  processDragStart = (args: { point: THREE.Vector3 }) => {
    const { point } = args;
    this.dragStartPoint.copy(point);
    this.dragIncrementalStartPoint.copy(point);
  };

  processHandle = (args: { point: THREE.Vector3; handle: Rotation | Translation }) => {
    const { point, handle } = args;
    if (handle instanceof Translation) {
      if (handle.name === HANDLE_NAMES.X) {
        this.position.x += point.x - this.dragIncrementalStartPoint.x;
      } else if (handle.name === HANDLE_NAMES.Y) {
        this.position.y += point.y - this.dragIncrementalStartPoint.y;
      } else if (handle.name === HANDLE_NAMES.Z) {
        this.position.z += point.z - this.dragIncrementalStartPoint.z;
      }
    } else {
      this.touch1
        .copy(this.dragStartPoint)
        .sub(this.position)
        .normalize();
      this.touch2
        .copy(point)
        .sub(this.position)
        .normalize();

      this.touch1 // touch1 can be reused
        .copy(this.dragIncrementalStartPoint)
        .sub(this.position)
        .normalize();
      this.handleTargetQuaternion.setFromUnitVectors(this.touch1, this.touch2);
      this.handleTargetEuler.setFromQuaternion(this.handleTargetQuaternion);

      if (handle.name === HANDLE_NAMES.X) {
        this.deltaQuaternion.setFromAxisAngle(handle.up, this.handleTargetEuler.x);
        handle.rotation.x += this.handleTargetEuler.x;
      } else if (handle.name === HANDLE_NAMES.Y) {
        this.deltaQuaternion.setFromAxisAngle(handle.up, this.handleTargetEuler.y);
        handle.rotation.z += -this.handleTargetEuler.y;
      } else if (handle.name === HANDLE_NAMES.Z) {
        this.deltaQuaternion.setFromAxisAngle(handle.up, this.handleTargetEuler.z);
        handle.rotation.z += this.handleTargetEuler.z;
      }
    }

    this.objectTargetQuaternion.premultiply(this.deltaQuaternion);
    this.dragIncrementalStartPoint.copy(point);
  };

  updateMatrixWorld = (force?: boolean) => {
    this.object.updateMatrixWorld(force);

    this.object.getWorldPosition(this.objectWorldPosition);
    const parent = this.object.parent;
    if (parent !== null) {
      parent.matrixWorld.decompose(
        this.objectParentWorldPosition,
        this.objectParentWorldQuaternion,
        this.objectParentWorldScale
      );
    }
    this.objectTargetPosition.copy(this.position).sub(this.objectParentWorldPosition);

    if (this.isBeingDragged) {
      this.object.position.copy(this.objectTargetPosition);
      this.object.quaternion.copy(this.objectTargetQuaternion);
    } else {
      this.position.copy(this.objectWorldPosition);
    }

    this.object.getWorldQuaternion(this.objectTargetQuaternion);

    super.updateMatrixWorld(force);
  };
}
