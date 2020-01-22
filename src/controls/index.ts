import * as THREE from "three";
import {
  DEFAULT_CONTROLS_SEPARATION,
  DEFAULT_EYE_ROTATION_SCALE,
  DEFAULT_PLANE_SIZE_SCALE,
  DEFAULT_ROTATION_RADIUS_SCALE,
  DEFAULT_TRANSLATION_DISTANCE_SCALE
} from "../utils/constants";
import Translation from "./handles/translation";
import Rotation from "./handles/rotation";
import Pick from "./handles/pick";
import PickPlane from "./handles/pick-plane";
import {
  DEFAULT_HANDLE_GROUP_NAME,
  IHandle,
  PickGroup,
  PickPlaneGroup,
  RotationGroup,
  TranslationGroup
} from "./handles";
import RotationEye from "./handles/rotation-eye";

export enum ANCHOR_MODE {
  /**
   * In this mode the Controls do not inherit the orientation of the object
   * as it is rotated.
   */
  FIXED = "fixed",
  /**
   * In this mode the Controls rotate as the object is rotated.
   */
  INHERIT = "inherit"
}

export interface IControlsOptions {
  /**
   * the anchor mode for the controls
   * @default [[ANCHOR_MODE.FIXED]]
   */
  mode?: ANCHOR_MODE;
  /**
   * distance between the position of the object and the position of the
   * handles (in case of translation handles), or the radius (in case of rotation handles),
   * or the size of the plane (in case of plane handles)
   * @default 0.5
   */
  separation?: number;
  /**
   * uses THREE.Mesh.computeBounds to set the separation; if separation
   * is provided in addition to this option, it is added to the computed bounds
   * @default false
   */
  useComputedBounds?: boolean;
  /**
   * the quaternion applied to the whole Controls instance (handles get rotated relatively)
   * @default undefined
   */
  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  /**
   * hides other handles of a Controls instance when drag starts
   * @default true
   */
  hideOtherHandlesOnDrag?: boolean;
  /**
   *  hides all other Controls instances when drag starts
   *  @default true
   */
  hideOtherControlsInstancesOnDrag?: boolean;
  /**
   * displays the plane in which the drag interaction takes place
   * (useful for debugging)
   * @default false
   */
  showHelperPlane?: boolean;
  /**
   * enables damping for the controls
   * @default true
   */
  isDampingEnabled?: boolean;
  /**
   * sets the scaling factor for the radius of rotation handles
   * @default 1.0
   */
  rotationRadiusScale?: number;
  /**
   * sets the scaling factor for the radius of rotation handles in eye plane
   * @default 1.25
   */
  eyeRotationRadiusScale?: number;
  /**
   * sets the width and height scale for the pick plane handles
   * @default 0.75
   */
  pickPlaneSizeScale?: number;
  /**
   * sets the scaling for distance between translation handles' start and the
   * center of the controls
   * @default 1.0
   */
  translationDistanceScale?: number;
  /**
   * For translation handles: highlights the axis along which the object moves
   * For rotation handles: highlights the axis of rotation
   * Not available on other handles
   * @default true
   */
  highlightAxis?: boolean;
  /**
   * Enables snap to grid (nearest integer coordinate) for all translation type handles:
   * TranslationGroup, PickGroup, and PickPlaneGroup
   * @default { x: false, y: false, z: false }
   */
  snapTranslation?: {
    x: boolean;
    y: boolean;
    z: boolean;
  };
}

/**
 * Controls is the main class in this library.
 * It is a subclass of THREE.Group, so its properties like `position` and
 * `quaternion` can be modified as desired.
 * The `children` are the control handles (like `rotationX`).
 * All translations and rotations are setup with respect to the global coordinate system.
 * @noInheritDoc
 */
export default class Controls extends THREE.Group {
  /**
   * handle which translates the object in the eye-plane
   */
  public readonly pick: Pick;
  /**
   * handle which translates the object in XY plane
   */
  public readonly pickPlaneXY: PickPlane;
  /**
   * handle which translates the object in YZ plane
   */
  public readonly pickPlaneYZ: PickPlane;
  /**
   * handle which translates the object in ZX plane
   */
  public readonly pickPlaneZX: PickPlane;
  /**
   * handle which translates the object along the x-axis; displayed in the
   * +ve x-axis direction
   */
  public readonly translationXP: Translation;
  /**
   * handle which translates the object along the y-axis; displayed in the
   * +ve y-axis direction
   */
  public readonly translationYP: Translation;
  /**
   * handle which translates the object along the z-axis; displayed in the
   * +ve z-axis direction
   */
  public readonly translationZP: Translation;
  /**
   * handle which translates the object along the x-axis; displayed in the
   * -ve x-axis direction
   */
  public readonly translationXN: Translation;
  /**
   * handle which translates the object along the y-axis; displayed in the
   * -ve y-axis direction
   */
  public readonly translationYN: Translation;
  /**
   * handle which translates the object along the z-axis; displayed in the
   * -ve z-axis direction
   */
  public readonly translationZN: Translation;
  /**
   * handle which rotates the object along the x-axis
   */
  public readonly rotationX: Rotation;
  /**
   * handle which rotates the object along the y-axis
   */
  public readonly rotationY: Rotation;
  /**
   * handle which rotates the object along the z-axis
   */
  public readonly rotationZ: Rotation;
  /**
   * handle which rotates the object in the eye-plane
   */
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
  private boundingSphereRadius = 0;
  private dragStartPoint = new THREE.Vector3();
  private dragIncrementalStartPoint = new THREE.Vector3();
  private handles: Set<IHandle> = new Set();
  private isBeingDraggedTranslation = false;
  private isBeingDraggedRotation = false;
  private dampingFactor = 0.8;
  private readonly useComputedBounds: boolean;
  private readonly separation: number;
  private initialSelfQuaternion = new THREE.Quaternion();
  private readonly options: IControlsOptions;
  private readonly mode: ANCHOR_MODE;
  private readonly translationDistanceScale: number;
  private readonly rotationRadiusScale: number;
  private readonly eyeRotationRadiusScale: number;
  private readonly pickPlaneSizeScale: number;
  /**
   * enables damping for the controls
   * @default true
   */
  public isDampingEnabled: boolean;
  /**
   * hides other handles of a Controls instance when drag starts
   * @default true
   */
  public hideOtherHandlesOnDrag: boolean;
  /**
   *  hides all other Controls instances when drag starts
   *  @default true
   */
  public hideOtherControlsInstancesOnDrag: boolean;
  /**
   * displays the plane in which the drag interaction takes place
   * (useful for debugging)
   * @default false
   */
  public showHelperPlane: boolean;
  /**
   * For translation handles: highlights the axis along which the object moves
   * For rotation handles: highlights the axis of rotation
   * Not available on other handles
   * @default true
   */
  public highlightAxis: boolean;
  /**
   * Enables snap to grid (nearest integer coordinate) for all translation type handles:
   * TranslationGroup, PickGroup, and PickPlaneGroup
   * @default { x: false, y: false, z: false }
   */
  public snapTranslation: {
    x: boolean;
    y: boolean;
    z: boolean;
  };

  /**
   *
   * @param object - the object provided by the user
   * @param camera - the THREE.Camera instance used in the scene
   * @param options
   */
  constructor(
    public object: THREE.Object3D,
    private camera: THREE.Camera,
    options?: IControlsOptions
  ) {
    super();

    this.options = options || {};
    this.mode = this.options?.mode ?? ANCHOR_MODE.FIXED;
    this.hideOtherHandlesOnDrag = this.options?.hideOtherHandlesOnDrag ?? true;
    this.hideOtherControlsInstancesOnDrag = this.options?.hideOtherControlsInstancesOnDrag ?? true;
    this.showHelperPlane = this.options?.showHelperPlane ?? false;
    this.highlightAxis = this.options?.highlightAxis ?? true;
    this.useComputedBounds = this.options?.useComputedBounds ?? false;
    this.snapTranslation = this.options?.snapTranslation ?? {
      x: false,
      y: false,
      z: false
    };
    this.separation = this.options?.separation ?? DEFAULT_CONTROLS_SEPARATION;
    this.isDampingEnabled = this.options?.isDampingEnabled ?? true;
    this.rotationRadiusScale = this.options?.rotationRadiusScale ?? DEFAULT_ROTATION_RADIUS_SCALE;
    this.eyeRotationRadiusScale =
      this.options?.eyeRotationRadiusScale ?? DEFAULT_EYE_ROTATION_SCALE;
    this.pickPlaneSizeScale = this.options?.pickPlaneSizeScale ?? DEFAULT_PLANE_SIZE_SCALE;
    this.translationDistanceScale =
      this.options?.translationDistanceScale ?? DEFAULT_TRANSLATION_DISTANCE_SCALE;

    if (this.options.orientation !== undefined) {
      const { x, y, z, w } = this.options.orientation;
      this.initialSelfQuaternion.set(x, y, z, w).normalize();
      this.quaternion.copy(this.initialSelfQuaternion);
    }

    this.computeObjectBounds();

    this.pick = new Pick();

    this.pickPlaneXY = new PickPlane(
      "yellow",
      this.boundingSphereRadius * this.pickPlaneSizeScale,
      this.boundingSphereRadius * this.pickPlaneSizeScale
    );
    this.pickPlaneYZ = new PickPlane(
      "cyan",
      this.boundingSphereRadius * this.pickPlaneSizeScale,
      this.boundingSphereRadius * this.pickPlaneSizeScale
    );
    this.pickPlaneZX = new PickPlane(
      "pink",
      this.boundingSphereRadius * this.pickPlaneSizeScale,
      this.boundingSphereRadius * this.pickPlaneSizeScale
    );

    this.translationXP = new Translation("red");
    this.translationYP = new Translation("green");
    this.translationZP = new Translation("blue");

    this.translationXN = new Translation("red");
    this.translationYN = new Translation("green");
    this.translationZN = new Translation("blue");

    this.rotationX = new Rotation("red", this.boundingSphereRadius * this.rotationRadiusScale);
    this.rotationY = new Rotation("green", this.boundingSphereRadius * this.rotationRadiusScale);
    this.rotationZ = new Rotation("blue", this.boundingSphereRadius * this.rotationRadiusScale);

    this.rotationEye = new RotationEye(
      "yellow",
      this.boundingSphereRadius * this.eyeRotationRadiusScale
    );

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

    this.setupHandle(this.pickPlaneXY);
    this.setupHandle(this.pickPlaneYZ);
    this.setupHandle(this.pickPlaneZX);
  };

  public setupHandle = (handle: IHandle) => {
    this.handles.add(handle);
    this.add(handle);
  };

  private setupDefaultPick = () => {
    this.pick.name = DEFAULT_HANDLE_GROUP_NAME.PICK;
    this.setupHandle(this.pick);
  };

  private setupDefaultEyeRotation = () => {
    this.rotationEye.name = DEFAULT_HANDLE_GROUP_NAME.ER;
    this.rotationEye.camera = this.camera;
    this.setupHandle(this.rotationEye);
  };

  private setupDefaultTranslation = () => {
    this.translationXP.name = DEFAULT_HANDLE_GROUP_NAME.XPT;
    this.translationYP.name = DEFAULT_HANDLE_GROUP_NAME.YPT;
    this.translationZP.name = DEFAULT_HANDLE_GROUP_NAME.ZPT;

    this.translationXN.name = DEFAULT_HANDLE_GROUP_NAME.XNT;
    this.translationYN.name = DEFAULT_HANDLE_GROUP_NAME.YNT;
    this.translationZN.name = DEFAULT_HANDLE_GROUP_NAME.ZNT;

    this.translationXP.translateX(this.boundingSphereRadius * this.translationDistanceScale);
    this.translationYP.translateY(this.boundingSphereRadius * this.translationDistanceScale);
    this.translationZP.translateZ(this.boundingSphereRadius * this.translationDistanceScale);

    this.translationXN.translateX(-this.boundingSphereRadius * this.translationDistanceScale);
    this.translationYN.translateY(-this.boundingSphereRadius * this.translationDistanceScale);
    this.translationZN.translateZ(-this.boundingSphereRadius * this.translationDistanceScale);

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

    this.setupHandle(this.translationXP);
    this.setupHandle(this.translationYP);
    this.setupHandle(this.translationZP);

    this.setupHandle(this.translationXN);
    this.setupHandle(this.translationYN);
    this.setupHandle(this.translationZN);
  };

  private setupDefaultRotation = () => {
    this.rotationX.name = DEFAULT_HANDLE_GROUP_NAME.XR;
    this.rotationY.name = DEFAULT_HANDLE_GROUP_NAME.YR;
    this.rotationZ.name = DEFAULT_HANDLE_GROUP_NAME.ZR;

    this.rotationX.up = new THREE.Vector3(1, 0, 0);
    this.rotationY.up = new THREE.Vector3(0, 1, 0);
    this.rotationZ.up = new THREE.Vector3(0, 0, 1);

    this.rotationY.rotateX(Math.PI / 2);
    this.rotationX.rotateY(Math.PI / 2);
    this.rotationX.rotateZ(Math.PI);

    this.setupHandle(this.rotationX);
    this.setupHandle(this.rotationY);
    this.setupHandle(this.rotationZ);
  };

  private computeObjectBounds = () => {
    if (this.useComputedBounds) {
      if (this.object.type === "Mesh") {
        const geometry = (this.object as THREE.Mesh).geometry;
        geometry.computeBoundingSphere();
        const {
          boundingSphere: { radius }
        } = geometry;
        this.boundingSphereRadius = radius / 2 + this.separation;
        return;
      } else {
        console.warn(
          `Bounds can only be computed for object of type THREE.Mesh,
          received object with type: ${this.object.type}. Falling back to using
          default separation.
        `
        );
      }
    }
    this.boundingSphereRadius = this.separation;
  };

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
  processDragEnd = (args: { handle: IHandle }) => {
    const { handle } = args;
    const { x: xSnap, y: ySnap, z: zSnap } = this.snapTranslation;
    const snap = [xSnap, ySnap, zSnap];
    if (
      handle instanceof TranslationGroup ||
      handle instanceof PickPlaneGroup ||
      handle instanceof PickGroup
    ) {
      const xyz = this.object.position.toArray();
      const floor = xyz.map(Math.floor);
      const ceil = xyz.map(Math.ceil);
      const snapFloor = xyz.map((p, index) => ceil[index] - p >= p - floor[index]);
      const position = xyz.map((p, index) => {
        if (!snap[index]) {
          return p;
        }
        return snapFloor[index] ? floor[index] : ceil[index];
      });
      this.object.position.fromArray(position);
    }
    this.isBeingDraggedTranslation = false;
    this.isBeingDraggedRotation = false;
  };

  /**
   * Only takes effect if [[IControlsOptions.isDampingEnabled]] is true.
   * @param dampingFactor - value between 0 and 1, acts like a weight on the controls
   */
  public setDampingFactor = (dampingFactor = 0) =>
    (this.dampingFactor = THREE.Math.clamp(dampingFactor, 0, 1));

  /**
   * @hidden
   */
  processDrag = (args: { point: THREE.Vector3; handle: IHandle; dragRatio?: number }) => {
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
    } else {
      this.touch1
        .copy(this.dragIncrementalStartPoint)
        .sub(this.objectWorldPosition)
        .normalize();

      this.touch2
        .copy(point)
        .sub(this.objectWorldPosition)
        .normalize();

      this.handleTargetQuaternion.setFromUnitVectors(this.touch1, this.touch2);
      if (this.mode === ANCHOR_MODE.FIXED) {
        this.detachHandleUpdateQuaternionAttach(handle, this.handleTargetQuaternion);
      }
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

  private detachHandleUpdateQuaternionAttach = (handle: IHandle, quaternion: THREE.Quaternion) => {
    if (this.parent !== null && this.parent.parent) {
      const scene = this.parent.parent;
      if (scene.type !== "Scene") {
        throw new Error("freeform controls must be attached to the scene");
      }
      scene.attach(handle);
      handle.applyQuaternion(quaternion);
      this.attach(handle);
    }
  };

  /**
   * Applies supplied visibility to the supplied handle names.
   * Individual handle's visibility can also be changed by modifying the `visibility`
   * property on the handle directly.
   * @param handleNames
   * @param visibility
   */
  public showByNames = (
    handleNames: Array<DEFAULT_HANDLE_GROUP_NAME | string>,
    visibility = true
  ) => {
    const handleNamesMap: { [name: string]: IHandle | undefined } = {};
    this.handles.forEach(handle => {
      handleNamesMap[handle.name] = handle;
    });
    handleNames.map(handleName => {
      const handle = handleNamesMap[handleName];
      if (handle === undefined) {
        throw new Error(`handle: ${handleName} not found`);
      }
      handle.visible = visibility;
    });
  };

  /**
   * Applies supplied visibility to all handles
   * @param visibility
   */
  public showAll = (visibility = true) => {
    this.handles.forEach(handle => {
      handle!.visible = visibility;
    });
  };

  /**
   * @hidden
   */
  public getInteractiveObjects(): THREE.Object3D[] {
    const interactiveObjects: THREE.Object3D[] = [];
    this.handles.forEach(handle => {
      if (!handle!.visible) {
        return;
      }
      interactiveObjects.push(...handle!.getInteractiveObjects());
    });
    return interactiveObjects;
  }

  /**
   * @hidden
   */
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
    if (this.mode === ANCHOR_MODE.INHERIT && !this.isBeingDraggedTranslation) {
      this.quaternion.copy(this.initialSelfQuaternion).premultiply(this.objectTargetQuaternion);
    }

    super.updateMatrixWorld(force);
  };
}
