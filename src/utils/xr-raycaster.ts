import { emitter } from "./emmiter";
import Controls from "../controls";
import PickPlane from "../controls/handles/pick-plane";
import { PICK_PLANE_OPACITY } from "./constants";
import { IHandle, PickGroup, RotationGroup, TranslationGroup } from "../controls/handles";
import RotationEye from "../controls/handles/rotation-eye";
import { addEventListener, removeEventListener } from "./helper";
import Line from "../primitives/line";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Intersection,
  Object3D,
  Plane,
  PlaneHelper,
  Quaternion,
  Scene,
  Vector3,
  Raycaster as ThreeRaycaster, WebXRController, Matrix4
} from "three";

export enum EVENTS {
  DRAG_START = "DRAG_START",
  DRAG = "DRAG",
  DRAG_STOP = "DRAG_STOP"
}

const tempMatrix = new Matrix4();

/**
 * @hidden
 * The Raycaster listens on the mouse and touch events globally and
 * dispatches DRAG_START, DRAG, and DRAG_STOP events.
 */
export default class XRRaycaster extends ThreeRaycaster {
  private activeHandle: IHandle | null = null;
  private activePlane: Plane | null = null;
  private point = new Vector3();
  private normal = new Vector3();
  private visibleHandles: Object3D[] = [];
  private visibleControls: Object3D[] = [];
  private helperPlane: PlaneHelper | null = null;
  private controlsWorldQuaternion = new Quaternion();
  private clientDiagonalLength = 1;
  private readonly highlightAxisLine: Line;

  constructor(
    private xrControllers: WebXRController[],
    private controls: { [id: string]: Controls }
  ) {
    super();
    this.highlightAxisLine = this.createAxisLine();
    this.xrControllers = xrControllers;

    this.xrControllers.forEach(controller => {
      addEventListener(controller, ["selectstart"], this.selectStartListener);
      addEventListener(controller, ["selectend"], this.selectEndListener);
    })
  }

  private createAxisLine = () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([
      0, 0, -100,
      0, 0, 100
    ], 3));
    return new Line("white", geometry);
  };

  private selectStartListener = (event: any) => {
    const controller = event.target;

    tempMatrix.identity().extractRotation( controller.matrixWorld );

    this.ray.origin.setFromMatrixPosition( controller.matrixWorld );
    this.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

    controller.userData.dragging = true;
    controller.userData.previousPosition = new Vector3().copy(controller.position);
    controller.userData.previousQuaternion = new Quaternion().copy(controller.quaternion);

    const interactiveObjects: Object3D[] = [];
    Object.values(this.controls).map(controls => {
      interactiveObjects.push(...controls.getInteractiveObjects());
    });
    this.activeHandle = this.resolveHandleGroup(this.intersectObjects(interactiveObjects, true)[0]);

    if (this.activeHandle?.parent) {
      const controls = this.activeHandle.parent as Controls;

      // hiding other controls and handles instances if asked
      if (controls.hideOtherControlsInstancesOnDrag) {
        Object.values(this.controls).forEach(x => {
          if (x.visible) {
            this.visibleControls.push(x);
          }
          x.visible = false;
        });
        controls.visible = true;
      }

      if (controls.hideOtherHandlesOnDrag) {
        controls.children.map(handle => {
          if (handle.visible) {
            this.visibleHandles.push(handle);
          }
          handle.visible = false;
        });
        this.activeHandle.visible = true;
      }

      if (this.activeHandle instanceof PickPlane) {
        this.setPickPlaneOpacity(PICK_PLANE_OPACITY.ACTIVE);
      }

      /**
       * creating the activePlane - the plane on which intersection actions
       * take place. mouse movements are translated to points on the activePlane
       */
      this.activePlane = new Plane();
      controls.getWorldQuaternion(this.controlsWorldQuaternion);
      this.normal.copy(
        this.activeHandle.up
      );
      if (!(this.activeHandle instanceof RotationEye || this.activeHandle instanceof PickGroup)) {
        this.normal.applyQuaternion(this.controlsWorldQuaternion);
      }
      if (this.activeHandle instanceof TranslationGroup) {
        this.activePlane.setFromNormalAndCoplanarPoint(this.normal, this.activeHandle.position);
      } else {
        this.activePlane.setFromNormalAndCoplanarPoint(this.normal, controls.position);
      }

      // find initial intersection
      const initialIntersectionPoint = new Vector3();
      if (this.activeHandle instanceof PickGroup) {
        this.activeHandle.getWorldPosition(initialIntersectionPoint);
      } else {
        this.ray.intersectPlane(this.activePlane, initialIntersectionPoint);
      }

      // activate the helper plane if asked
      // available only for TranslationGroup and RotationGroup
      // (except RotationEye - plane of rotation is obvious)
      const scene = controls.parent as Scene;
      if (
        controls.showHelperPlane &&
        (this.activeHandle instanceof TranslationGroup ||
          this.activeHandle instanceof RotationGroup) &&
        !(this.activeHandle instanceof RotationEye)
      ) {
        this.helperPlane = new PlaneHelper(this.activePlane, 1);
        scene.add(this.helperPlane);
      }

      /**
       * activate the highlightAxis if asked
       * available only for TranslationGroup and RotationGroup
       * (except RotationEye - plane of rotation is obvious)
       */
      if (
        controls.highlightAxis &&
        (this.activeHandle instanceof TranslationGroup ||
          this.activeHandle instanceof RotationGroup) &&
        !(this.activeHandle instanceof RotationEye)
      ) {
        this.activeHandle.getWorldPosition(this.highlightAxisLine.position);
        const direction = this.highlightAxisLine.position.clone();
        if (this.activeHandle instanceof TranslationGroup) {
          direction.add(this.activeHandle.parallel);
        } else {
          direction.add(this.activeHandle.up);
        }
        this.highlightAxisLine.lookAt(direction);
        scene.add(this.highlightAxisLine);
      }

      emitter.emit(EVENTS.DRAG_START, {
        point: initialIntersectionPoint,
        handle: this.activeHandle
      });
      controller.userData.intersectionPoint = initialIntersectionPoint;
    } else {
      this.activePlane = null;
    }
  };

  private selectMoveListener = (controller: any) => {
    if (this.activeHandle === null || this.activePlane === null) {
      return;
    }

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

    this.ray.intersectPlane(this.activePlane, this.point);
    const distance = controller.userData.intersectionPoint.distanceTo(this.point);
    const dragRatio = distance / (this.clientDiagonalLength || 1);

    emitter.emit(EVENTS.DRAG, {
      point: this.point,
      handle: this.activeHandle,
      dragRatio
    });

    controller.userData.previousPosition.copy(controller.position);
    controller.userData.previousQuaternion.copy(controller.quaternion);
    controller.userData.intersectionPoint.copy(this.point);
  };

  private selectEndListener = (event: any) => {
    const controller = event.target;
    controller.userData.dragging = false;

    emitter.emit(EVENTS.DRAG_STOP, { point: this.point, handle: this.activeHandle });

    if (
      this.activeHandle?.parent &&
      (this.activeHandle.parent as Controls).hideOtherControlsInstancesOnDrag
    ) {
      this.visibleControls.forEach(controls => {
        controls.visible = true;
      });
      this.visibleControls = [];
    }

    if (
      this.activeHandle?.parent &&
      (this.activeHandle.parent as Controls).hideOtherHandlesOnDrag
    ) {
      this.visibleHandles.forEach(handle => {
        handle.visible = true;
      });
      this.visibleHandles = [];
    }

    if (this.activeHandle instanceof PickPlane) {
      this.setPickPlaneOpacity(PICK_PLANE_OPACITY.INACTIVE);
    }

    const scene = this.activeHandle?.parent?.parent;
    if (scene) {
      if (this.helperPlane) {
        scene.remove(this.helperPlane);
      }
      scene.remove(this.highlightAxisLine);
    }
    this.activeHandle = null;
    this.activePlane = null;
  };

  private setPickPlaneOpacity(opacity: number) {
    if (!(this.activeHandle instanceof PickPlane)) {
      return;
    }
    const material = this.activeHandle.plane.material;
    if (Array.isArray(material)) {
      material.map(m => {
        m.opacity = opacity;
        m.needsUpdate = true;
      });
    } else {
      material.opacity = opacity;
      material.needsUpdate = true;
    }
  }

  private resolveHandleGroup = (intersectedObject: Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent as IHandle;
  };

  public update = () => {
    this.xrControllers.forEach((controller: any) => {
      if(controller.userData.dragging) {
        this.selectMoveListener(controller);
      }
    })
  }

  public destroy = () => {
    this.activePlane = null;
    this.activeHandle = null;
    this.xrControllers.forEach(xrController => {
      removeEventListener(xrController, ["selectstart"], this.selectStartListener);
      removeEventListener(xrController, ["selectend"], this.selectEndListener);
    })
  };
}
