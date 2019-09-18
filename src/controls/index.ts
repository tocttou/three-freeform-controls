import * as THREE from "three";
import { DEFAULT_TRANSLATION_CONTROLS_SEPARATION } from "../utils/constants";
import Translation from "./handles/translation";
import Rotation from "./handles/rotation";
import Pick from "./handles/pick";
import PickPlane from "./handles/pick-plane";
import { IHandle, PickGroup, PickPlaneGroup, RotationGroup, TranslationGroup } from "./handles";
import RotationEye from "./handles/rotation-eye";

export interface ISeparationT {
  x: number;
  y: number;
  z: number;
}

export enum DEFAULT_HANDLE_GROUP_NAME {
  XPT = "xpt_handle",
  YPT = "ypt_handle",
  ZPT = "zpt_handle",
  XNT = "xnt_handle",
  YNT = "ynt_handle",
  ZNT = "znt_handle",
  XR = "xr_handle",
  YR = "yr_handle",
  ZR = "zr_handle",
  ER = "er_handle",
  PICK = "pick_handle",
  PICK_PLANE_XY = "pick_plane_xy_handle",
  PICK_PLANE_YZ = "pick_plane_yz_handle",
  PICK_PLANE_ZX = "pick_plane_zx_handle"
}

export enum ANCHOR_MODE {
  FIXED = "fixed",
  INHERIT = "inherit"
}

export interface IControlsOptions {
  mode?: ANCHOR_MODE;
  separationT?: ISeparationT;
  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
}

export default class Controls extends THREE.Group {
  public readonly pick: Pick;
  public readonly pickPlaneXY: PickPlane;
  public readonly pickPlaneYZ: PickPlane;
  public readonly pickPlaneZX: PickPlane;
  public readonly translationXP: Translation;
  public readonly translationYP: Translation;
  public readonly translationZP: Translation;
  public readonly translationXN: Translation;
  public readonly translationYN: Translation;
  public readonly translationZN: Translation;
  public readonly rotationX: Rotation;
  public readonly rotationY: Rotation;
  public readonly rotationZ: Rotation;
  public readonly rotationEye: RotationEye;
  private handleTargetQuaternion = new THREE.Quaternion();
  private objectWorldPosition = new THREE.Vector3();
  private objectTargetPosition = new THREE.Vector3();
  private objectTargetQuaternion = new THREE.Quaternion();
  private objectParentWorldPosition = new THREE.Vector3();
  private objectParentWorldQuaternion = new THREE.Quaternion();
  private objectParentWorldScale = new THREE.Vector3();
  private deltaPosition = new THREE.Vector3();
  private normalizedHandleParallelVectorCache = new THREE.Vector3();
  private touch1 = new THREE.Vector3();
  private touch2 = new THREE.Vector3();
  private minBox = new THREE.Vector3();
  private maxBox = new THREE.Vector3();
  private dragStartPoint = new THREE.Vector3();
  private dragIncrementalStartPoint = new THREE.Vector3();
  private handleNamesMap: { [name: string]: IHandle | undefined } = {};
  public isBeingDraggedTranslation = false;
  public isBeingDraggedRotation = false;
  public isDampingEnabled = true;
  private dampingFactor = 0.8;
  private initialSelfQuaternion = new THREE.Quaternion();
  private readonly options: IControlsOptions;
  private readonly attachMode: ANCHOR_MODE;

  constructor(
    public object: THREE.Object3D,
    private camera: THREE.Camera,
    options?: IControlsOptions
  ) {
    super();

    this.options = options || {};
    this.attachMode = this.options.mode || ANCHOR_MODE.FIXED;

    if (this.options.orientation !== undefined) {
      const { x, y, z, w } = this.options.orientation;
      this.initialSelfQuaternion.set(x, y, z, w).normalize();
      this.quaternion.copy(this.initialSelfQuaternion);
    }

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

    this.rotationEye = new RotationEye("yellow");

    this.setupDefaultTranslation();
    this.setupDefaultRotation();
    this.setupDefaultEyeRotation();
    this.setupDefaultPickPlane();
    this.setupDefaultPick();
  }

  private setupDefaultPickPlane = () => {
    this.pickPlaneXY.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_XY;
    this.pickPlaneYZ.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_YZ;
    this.pickPlaneZX.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_ZX;

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
    this.pick.name = DEFAULT_HANDLE_GROUP_NAME.PICK;
    this.handleNamesMap[this.pick.name] = this.pick;
    this.add(this.pick);
  };

  private setupDefaultEyeRotation = () => {
    this.rotationEye.name = DEFAULT_HANDLE_GROUP_NAME.ER;
    this.handleNamesMap[this.rotationEye.name] = this.rotationEye;
    this.rotationEye.camera = this.camera;
    this.add(this.rotationEye);
  };

  private setupDefaultTranslation = () => {
    this.translationXP.name = DEFAULT_HANDLE_GROUP_NAME.XPT;
    this.translationYP.name = DEFAULT_HANDLE_GROUP_NAME.YPT;
    this.translationZP.name = DEFAULT_HANDLE_GROUP_NAME.ZPT;

    this.translationXN.name = DEFAULT_HANDLE_GROUP_NAME.XNT;
    this.translationYN.name = DEFAULT_HANDLE_GROUP_NAME.YNT;
    this.translationZN.name = DEFAULT_HANDLE_GROUP_NAME.ZNT;

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
    this.rotationX.name = DEFAULT_HANDLE_GROUP_NAME.XR;
    this.rotationY.name = DEFAULT_HANDLE_GROUP_NAME.YR;
    this.rotationZ.name = DEFAULT_HANDLE_GROUP_NAME.ZR;

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
    if (this.options.separationT !== undefined) {
      const { x, y, z } = this.options.separationT;
      this.minBox.copy(new THREE.Vector3(-x, -y, -z));
      this.maxBox.copy(new THREE.Vector3(x, y, z));
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
      handle instanceof TranslationGroup ||
      handle instanceof PickGroup ||
      handle instanceof PickPlaneGroup;
    this.isBeingDraggedRotation = handle instanceof RotationGroup;
  };

  public setDampingFactor = (dampingFactor = 0) =>
    (this.dampingFactor = THREE.Math.clamp(dampingFactor, 0, 1));

  processHandle = (args: { point: THREE.Vector3; handle: IHandle; dragRatio?: number }) => {
    const { point, handle, dragRatio = 1 } = args;
    const k = Math.exp(-this.dampingFactor * Math.abs(dragRatio ** 3));

    if (handle instanceof TranslationGroup) {
      this.deltaPosition.copy(point).sub(this.dragIncrementalStartPoint);
      this.normalizedHandleParallelVectorCache
        .copy(handle.parallel.normalize())
        .applyQuaternion(this.quaternion);

      const delta = this.deltaPosition.dot(this.normalizedHandleParallelVectorCache);
      this.deltaPosition
        .copy(this.normalizedHandleParallelVectorCache)
        .multiplyScalar(this.isDampingEnabled ? k * delta : delta);

      this.position.add(this.deltaPosition);
    } else if (handle instanceof PickGroup || handle instanceof PickPlaneGroup) {
      this.deltaPosition
        .copy(point)
        .sub(this.dragIncrementalStartPoint)
        .multiplyScalar(this.isDampingEnabled ? k : 1);

      this.position.add(this.deltaPosition);
    } else if (handle instanceof RotationGroup) {
      this.touch1
        .copy(this.dragIncrementalStartPoint)
        .sub(this.objectWorldPosition)
        .normalize();

      this.touch2
        .copy(point)
        .sub(this.objectWorldPosition)
        .normalize();

      this.handleTargetQuaternion.setFromUnitVectors(this.touch1, this.touch2);

      // handle rotation is disabled until a way is found to do this
      // with this.options.orientation also being provided

      // if (this.attachMode === ANCHOR_MODE.FIXED) {
      //   handle.quaternion.premultiply(this.handleTargetQuaternion);
      // }
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

  public showByNames = (handleNames: string[], visibility = true) => {
    handleNames.map(handleName => {
      const handle = this.handleNamesMap[handleName];
      if (handle === undefined) {
        throw new Error(`handle: ${handleName} not found`);
      }
      handle.visible = visibility;
    });
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
    if (this.attachMode === ANCHOR_MODE.INHERIT) {
      this.quaternion.copy(this.initialSelfQuaternion).premultiply(this.objectTargetQuaternion);
    }

    super.updateMatrixWorld(force);
  };
}
