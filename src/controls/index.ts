import * as THREE from "three";
import Translation from "./handles/translation";
import { DEFAULT_TRANSLATION_CONTROLS_SEPARATION } from "../utils/constants";
import Rotation from "./handles/rotation";
import Pick from "./handles/pick";
import PickPlane from "./handles/pick-plane";
import { ISeparationT } from "../index";

export enum DEFAULT_HANDLE_GROUP_NAMES {
  XPT = "xpt_handle",
  YPT = "ypt_handle",
  ZPT = "zpt_handle",
  XNT = "xnt_handle",
  YNT = "ynt_handle",
  ZNT = "znt_handle",
  XR = "xr_handle",
  YR = "yr_handle",
  ZR = "zr_handle",
  PICK = "pick_handle",
  PICK_PLANE_XY = "pick_plane_xy_handle",
  PICK_PLANE_YZ = "pick_plane_yz_handle",
  PICK_PLANE_ZX = "pick_plane_zx_handle"
}

export type IHandle = Rotation | Translation | Pick | PickPlane;

export default class Controls extends THREE.Group {
  private readonly pick: Pick;
  private readonly pickPlaneXY: PickPlane;
  private readonly pickPlaneYZ: PickPlane;
  private readonly pickPlaneZX: PickPlane;
  private readonly translationXP: Translation;
  private readonly translationYP: Translation;
  private readonly translationZP: Translation;
  private readonly translationXN: Translation;
  private readonly translationYN: Translation;
  private readonly translationZN: Translation;
  private readonly rotationX: Rotation;
  private readonly rotationY: Rotation;
  private readonly rotationZ: Rotation;
  private handleTargetQuaternion = new THREE.Quaternion();
  private objectWorldPosition = new THREE.Vector3();
  private objectTargetPosition = new THREE.Vector3();
  private objectTargetQuaternion = new THREE.Quaternion();
  private objectParentWorldPosition = new THREE.Vector3();
  private objectParentWorldQuaternion = new THREE.Quaternion();
  private objectParentWorldScale = new THREE.Vector3();
  private deltaPosition = new THREE.Vector3();
  private touch1 = new THREE.Vector3();
  private touch2 = new THREE.Vector3();
  private minBox = new THREE.Vector3();
  private maxBox = new THREE.Vector3();
  private dragStartPoint = new THREE.Vector3();
  private dragIncrementalStartPoint = new THREE.Vector3();
  private handleNamesMap: { [name: string]: IHandle | undefined } = {};
  public isBeingDraggedTranslation = false;
  public isBeingDraggedRotation = false;

  constructor(public object: THREE.Object3D, private separationT?: ISeparationT) {
    super();

    this.computeObjectBounds();

    this.pick = new Pick();

    this.pickPlaneXY = new PickPlane("yellow");
    this.pickPlaneYZ = new PickPlane("cyan");
    this.pickPlaneZX = new PickPlane("pink");

    this.translationXP = new Translation("red");
    this.translationYP = new Translation("green");
    this.translationZP = new Translation("blue");

    this.translationXN = new Translation("red");
    this.translationYN = new Translation("green");
    this.translationZN = new Translation("blue");

    this.rotationX = new Rotation("red");
    this.rotationY = new Rotation("green");
    this.rotationZ = new Rotation("blue");

    this.setupDefaultTranslation();
    this.setupDefaultRotation();
    this.setupDefaultPickPlane();
    this.setupDefaultPick();
  }

  private setupDefaultPickPlane = () => {
    this.pickPlaneXY.name = DEFAULT_HANDLE_GROUP_NAMES.PICK_PLANE_XY;
    this.pickPlaneYZ.name = DEFAULT_HANDLE_GROUP_NAMES.PICK_PLANE_YZ;
    this.pickPlaneZX.name = DEFAULT_HANDLE_GROUP_NAMES.PICK_PLANE_ZX;

    this.pickPlaneYZ.up = new THREE.Vector3(1, 0, 0);
    this.pickPlaneZX.up = new THREE.Vector3(0, 1, 0);
    this.pickPlaneXY.up = new THREE.Vector3(0, 0, 1);

    this.pickPlaneYZ.rotateY(Math.PI / 2);
    this.pickPlaneZX.rotateX(Math.PI / 2);

    this.handleNamesMap[this.pickPlaneXY.name] = this.pickPlaneXY;
    this.handleNamesMap[this.pickPlaneYZ.name] = this.pickPlaneYZ;
    this.handleNamesMap[this.pickPlaneZX.name] = this.pickPlaneZX;

    this.add(this.pickPlaneXY);
    this.add(this.pickPlaneYZ);
    this.add(this.pickPlaneZX);
  };

  public setupHandle = (handle: IHandle) => {
    const existingHandle = this.handleNamesMap[handle.name];
    if (existingHandle !== undefined) {
      throw new Error("handle with this name already exists!");
    }

    this.handleNamesMap[handle.name] = handle;
    this.add(handle);
  };

  private setupDefaultPick = () => {
    this.pick.name = DEFAULT_HANDLE_GROUP_NAMES.PICK;

    this.handleNamesMap[this.pick.name] = this.pick;

    this.add(this.pick);
  };

  private setupDefaultTranslation = () => {
    this.translationXP.name = DEFAULT_HANDLE_GROUP_NAMES.XPT;
    this.translationYP.name = DEFAULT_HANDLE_GROUP_NAMES.YPT;
    this.translationZP.name = DEFAULT_HANDLE_GROUP_NAMES.ZPT;

    this.translationXN.name = DEFAULT_HANDLE_GROUP_NAMES.XNT;
    this.translationYN.name = DEFAULT_HANDLE_GROUP_NAMES.YNT;
    this.translationZN.name = DEFAULT_HANDLE_GROUP_NAMES.ZNT;

    this.translationXP.translateX(this.maxBox.x);
    this.translationYP.translateY(this.maxBox.y);
    this.translationZP.translateZ(this.maxBox.z);

    this.translationXN.translateX(this.minBox.x);
    this.translationYN.translateY(this.minBox.y);
    this.translationZN.translateZ(this.minBox.z);

    this.translationXP.rotateZ(-Math.PI / 2);
    this.translationZP.rotateX(Math.PI / 2);

    this.translationXN.rotateZ(Math.PI / 2);
    this.translationYN.rotateX(Math.PI);
    this.translationZN.rotateX(-Math.PI / 2);

    this.translationXP.up = new THREE.Vector3(0, 1, 0);
    this.translationYP.up = new THREE.Vector3(0, 0, 1);
    this.translationZP.up = new THREE.Vector3(0, 1, 0);

    this.translationXN.up = new THREE.Vector3(0, -1, 0);
    this.translationYN.up = new THREE.Vector3(0, 0, -1);
    this.translationZN.up = new THREE.Vector3(0, -1, 0);

    this.translationXP.parallel = new THREE.Vector3(1, 0, 0);
    this.translationYP.parallel = new THREE.Vector3(0, 1, 0);
    this.translationZP.parallel = new THREE.Vector3(0, 0, 1);

    this.translationXN.parallel = new THREE.Vector3(-1, 0, 0);
    this.translationYN.parallel = new THREE.Vector3(0, -1, 0);
    this.translationZN.parallel = new THREE.Vector3(0, 0, -1);

    this.handleNamesMap[this.translationXP.name] = this.translationXP;
    this.handleNamesMap[this.translationYP.name] = this.translationYP;
    this.handleNamesMap[this.translationZP.name] = this.translationZP;

    this.handleNamesMap[this.translationXN.name] = this.translationXN;
    this.handleNamesMap[this.translationYN.name] = this.translationYN;
    this.handleNamesMap[this.translationZN.name] = this.translationZN;

    this.add(this.translationXP);
    this.add(this.translationYP);
    this.add(this.translationZP);

    this.add(this.translationXN);
    this.add(this.translationYN);
    this.add(this.translationZN);
  };

  private setupDefaultRotation = () => {
    this.rotationX.name = DEFAULT_HANDLE_GROUP_NAMES.XR;
    this.rotationY.name = DEFAULT_HANDLE_GROUP_NAMES.YR;
    this.rotationZ.name = DEFAULT_HANDLE_GROUP_NAMES.ZR;

    this.rotationX.up = new THREE.Vector3(1, 0, 0);
    this.rotationY.up = new THREE.Vector3(0, 1, 0);
    this.rotationZ.up = new THREE.Vector3(0, 0, 1);

    this.rotationX.rotateY(Math.PI / 2);
    this.rotationX.rotateZ(Math.PI);
    this.rotationY.rotateX(Math.PI / 2);

    this.handleNamesMap[this.rotationX.name] = this.rotationX;
    this.handleNamesMap[this.rotationY.name] = this.rotationY;
    this.handleNamesMap[this.rotationZ.name] = this.rotationZ;

    this.add(this.rotationX);
    this.add(this.rotationY);
    this.add(this.rotationZ);
  };

  private computeObjectBounds = () => {
    if (this.separationT !== undefined) {
      const { x, y, z } = this.separationT;
      this.minBox.copy(new THREE.Vector3(-x / 2, -y / 2, -z / 2));
      this.maxBox.copy(new THREE.Vector3(x / 2, y / 2, z / 2));
    } else if (this.object.type === "Mesh") {
      const geometry = (this.object as THREE.Mesh).geometry;
      geometry.computeBoundingBox();
      const {
        boundingBox: { min, max }
      } = geometry;
      this.minBox.copy(min);
      this.maxBox.copy(max);

      this.minBox.addScalar(-DEFAULT_TRANSLATION_CONTROLS_SEPARATION);
      this.maxBox.addScalar(DEFAULT_TRANSLATION_CONTROLS_SEPARATION);
    } else {
      this.minBox.copy(new THREE.Vector3(-1, -1, -1));
      this.maxBox.copy(new THREE.Vector3(1, 1, 1));
    }
  };

  processDragStart = (args: { point: THREE.Vector3; handle: IHandle }) => {
    const { point, handle } = args;
    this.dragStartPoint.copy(point);
    this.dragIncrementalStartPoint.copy(point);
    this.isBeingDraggedTranslation =
      handle instanceof Translation || handle instanceof Pick || handle instanceof PickPlane;
    this.isBeingDraggedRotation = handle instanceof Rotation;
  };

  processHandle = (args: { point: THREE.Vector3; handle: IHandle }) => {
    const { point, handle } = args;
    if (handle instanceof Translation) {
      this.deltaPosition.copy(point).sub(this.dragIncrementalStartPoint);
      const delta = this.deltaPosition.dot(handle.parallel.normalize());
      this.deltaPosition.copy(handle.parallel.normalize()).multiplyScalar(delta);
      this.position.add(this.deltaPosition);
    } else if (handle instanceof Pick || handle instanceof PickPlane) {
      this.position.add(point).sub(this.dragIncrementalStartPoint);
    } else if (handle instanceof Rotation) {
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
      handle.quaternion.premultiply(this.handleTargetQuaternion);
    }

    this.objectTargetQuaternion.premultiply(this.handleTargetQuaternion);
    this.dragIncrementalStartPoint.copy(point);
  };

  private detachObjectUpdatePositionAttach = (
    parent: THREE.Object3D | null,
    object: THREE.Object3D
  ) => {
    if (parent !== null && this.parent !== null && this.parent.parent !== null) {
      const scene = this.parent.parent;
      if (scene.type !== "Scene") {
        throw new Error("freeform controls must be attached to the scene");
      }
      scene.attach(object);
      object.position.copy(this.objectTargetPosition);
      parent.attach(object);
    }
  };

  public showByName = (handleName: string, visibility = true) => {
    const handle = this.handleNamesMap[handleName];
    if (handle === undefined) {
      throw new Error(`handle: ${handleName} not found`);
    }
    handle.visible = visibility;
  };

  public showAll = (visibility = true) => {
    const handles = Object.values(this.handleNamesMap);
    handles.map(handle => {
      handle!.visible = visibility;
    });
  };

  public getInteractiveObjects(): THREE.Object3D[] {
    const handles = Object.values(this.handleNamesMap);
    const interactiveObjects: THREE.Object3D[] = [];
    handles.map(handle => {
      if (!handle!.visible) {
        return;
      }
      interactiveObjects.push(...handle!.getInteractiveObjects());
    });
    return interactiveObjects;
  }

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
    this.objectParentWorldQuaternion.inverse();
    this.objectTargetPosition.copy(this.position);
    this.objectTargetQuaternion.premultiply(this.objectParentWorldQuaternion);

    if (this.isBeingDraggedTranslation) {
      this.detachObjectUpdatePositionAttach(parent, this.object);
    } else if (this.isBeingDraggedRotation) {
      this.object.quaternion.copy(this.objectTargetQuaternion);
      this.detachObjectUpdatePositionAttach(parent, this.object);
    } else {
      this.position.copy(this.objectWorldPosition);
    }

    this.object.getWorldQuaternion(this.objectTargetQuaternion);

    super.updateMatrixWorld(force);
  };
}
