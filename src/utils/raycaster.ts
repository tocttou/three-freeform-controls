import * as THREE from "three";
import { emitter } from "./emmiter";
import Controls from "../controls";
import PickPlane from "../controls/handles/pick-plane";
import { PICK_PLANE_OPACITY } from "./constants";
import { IHandle, PickGroup } from "../controls/handles";
import RotationEye from "../controls/handles/rotation-eye";
import Plane from "../primitives/plane";
import Pick from "../controls/handles/pick";
import { getPointFromEvent, addEventListener, removeEventListener } from "./helper";

export enum EVENTS {
  DRAG_START = "DRAG_START",
  DRAG = "DRAG",
  DRAG_STOP = "DRAG_STOP"
}

/**
 * @hidden
 */
export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private cameraPosition = new THREE.Vector3();
  private activeHandle: IHandle | null = null;
  private activePlane: THREE.Plane | null = null;
  private point = new THREE.Vector3();
  private normal = new THREE.Vector3();
  private visibleHandles: THREE.Object3D[] = [];
  private visibleControls: THREE.Object3D[] = [];
  private helperPlane = new Plane("yellow");
  private controlsWorldQuaternion = new THREE.Quaternion();
  private activeHandleWorldQuaternion = new THREE.Quaternion();
  private clientDiagonalLength = 1;
  private previousScreenPoint = new THREE.Vector2();
  private currentScreenPoint = new THREE.Vector2();

  constructor(
    public camera: THREE.Camera,
    private domElement: HTMLElement,
    private controls: { [id: string]: Controls }
  ) {
    super();
    addEventListener(this.domElement, ["mousedown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true
    });
    addEventListener(this.domElement, ["mouseup", "touchend"], this.pointerUpListener, {
      passive: false,
      capture: true
    });
  }

  private pointerDownListener = (event: MouseEvent | TouchEvent) => {
    const point = getPointFromEvent(event);
    if (!point) {
      return;
    }
    const { clientX, clientY } = point;
    this.setRayDirection(clientX, clientY);

    this.clientDiagonalLength = Math.sqrt(
      (event.target as HTMLElement).clientWidth ** 2 +
        (event.target as HTMLElement).clientHeight ** 2
    );
    this.previousScreenPoint.set(clientX, clientY);

    const interactiveObjects: THREE.Object3D[] = [];
    Object.values(this.controls).map(controls => {
      interactiveObjects.push(...controls.getInteractiveObjects());
    });
    this.activeHandle = this.resolveHandleGroup(this.intersectObjects(interactiveObjects, true)[0]);

    if (this.activeHandle !== null && this.activeHandle.parent !== null) {
      this.activePlane = new THREE.Plane();
      const controls = this.activeHandle.parent as Controls;

      controls.getWorldQuaternion(this.controlsWorldQuaternion);
      this.normal.copy(
        this.activeHandle instanceof PickGroup
          ? this.getEyePlaneNormal(this.activeHandle)
          : this.activeHandle.up
      );

      if (!(this.activeHandle instanceof RotationEye || this.activeHandle instanceof PickGroup)) {
        this.normal.applyQuaternion(this.controlsWorldQuaternion);
      }

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

      if (
        controls.showHelperPlane &&
        !(this.activeHandle instanceof Pick || this.activeHandle instanceof PickPlane)
      ) {
        const scene = controls.parent as THREE.Scene;
        this.helperPlane.position.copy(controls.position);
        this.activeHandle.getWorldQuaternion(this.helperPlane.quaternion);
        scene.add(this.helperPlane);
      }

      if (this.activeHandle instanceof PickPlane) {
        this.setPickPlaneOpacity(PICK_PLANE_OPACITY.ACTIVE);
      }

      this.activePlane.setFromNormalAndCoplanarPoint(this.normal, controls.position);

      const initialIntersectionPoint = new THREE.Vector3();
      if (this.activeHandle instanceof PickGroup) {
        this.activeHandle.getWorldPosition(initialIntersectionPoint);
      } else {
        this.ray.intersectPlane(this.activePlane, initialIntersectionPoint);
      }

      removeEventListener(this.domElement, ["mousedown", "touchstart"], this.pointerDownListener, {
        capture: true
      });
      emitter.emit(EVENTS.DRAG_START, {
        point: initialIntersectionPoint,
        handle: this.activeHandle
      });
      addEventListener(this.domElement, ["mousemove", "touchmove"], this.pointerMoveListener, {
        passive: false,
        capture: true
      });
    } else {
      this.activePlane = null;
    }
  };

  private getEyePlaneNormal = (object: THREE.Object3D) => {
    this.cameraPosition.copy(this.camera.position);
    return this.cameraPosition.sub(object.position);
  };

  private setRayDirection = (clientX: number, clientY: number) => {
    const rect = this.domElement.getBoundingClientRect();
    const { clientHeight, clientWidth } = this.domElement;
    this.mouse.x = ((clientX - rect.left) / clientWidth) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / clientHeight) * 2 + 1;
    this.setFromCamera(this.mouse, this.camera);
  };

  private pointerMoveListener = (event: MouseEvent | TouchEvent) => {
    if (this.activeHandle === null || this.activePlane === null) {
      return;
    }
    const point = getPointFromEvent(event);
    if (!point) {
      return;
    }
    const { clientX, clientY } = point;

    this.activeHandle.getWorldQuaternion(this.activeHandleWorldQuaternion);
    this.helperPlane.quaternion.copy(this.activeHandleWorldQuaternion);

    this.setRayDirection(clientX, clientY);
    this.ray.intersectPlane(this.activePlane, this.point);

    this.currentScreenPoint.set(clientX, clientY);
    const distance = this.currentScreenPoint.distanceTo(this.previousScreenPoint);
    const dragRatio = distance / (this.clientDiagonalLength || 1);

    emitter.emit(EVENTS.DRAG, {
      point: this.point,
      handle: this.activeHandle,
      dragRatio
    });

    this.previousScreenPoint.set(clientX, clientY);
  };

  private pointerUpListener = () => {
    removeEventListener(this.domElement, ["mousemove", "touchmove"], this.pointerMoveListener, {
      capture: true
    });
    addEventListener(this.domElement, ["mousedown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true
    });
    emitter.emit(EVENTS.DRAG_STOP, { point: this.point, handle: this.activeHandle });

    if (
      this.activeHandle !== null &&
      this.activeHandle.parent !== null &&
      (this.activeHandle.parent as Controls).hideOtherControlsInstancesOnDrag
    ) {
      this.visibleControls.forEach(controls => {
        controls.visible = true;
      });
      this.visibleControls = [];
    }

    if (
      this.activeHandle !== null &&
      this.activeHandle.parent !== null &&
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

    if (
      this.activeHandle !== null &&
      this.activeHandle.parent !== null &&
      (this.activeHandle.parent as Controls).showHelperPlane
    ) {
      const scene = this.activeHandle.parent.parent as THREE.Scene;
      scene.remove(this.helperPlane);
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

  private resolveHandleGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent as IHandle;
  };

  public destroy = () => {
    this.activePlane = null;
    this.activeHandle = null;
    removeEventListener(this.domElement, ["mousedown", "touchstart"], this.pointerDownListener, {
      capture: true
    });
    removeEventListener(this.domElement, ["mousemove", "touchmove"], this.pointerMoveListener, {
      capture: true
    });
    removeEventListener(this.domElement, ["mouseup", "touchend"], this.pointerUpListener, {
      capture: true
    });
  };
}
