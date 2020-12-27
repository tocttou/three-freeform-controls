import * as THREE from "three";
import { emitter } from "./emmiter";
import Controls from "../controls";
import PickPlane from "../controls/handles/pick-plane";
import { PICK_PLANE_OPACITY } from "./constants";
import { IHandle, PickGroup, RotationGroup, TranslationGroup } from "../controls/handles";
import RotationEye from "../controls/handles/rotation-eye";
import { addEventListener, getPointFromEvent, removeEventListener } from "./helper";
import Line from "../primitives/line";

export enum EVENTS {
  DRAG_START = "DRAG_START",
  DRAG = "DRAG",
  DRAG_STOP = "DRAG_STOP"
}

/**
 * @hidden
 * The Raycaster listens on the mouse and touch events globally and
 * dispatches DRAG_START, DRAG, and DRAG_STOP events.
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
  private helperPlane: THREE.PlaneHelper | null = null;
  private controlsWorldQuaternion = new THREE.Quaternion();
  private clientDiagonalLength = 1;
  private previousScreenPoint = new THREE.Vector2();
  private currentScreenPoint = new THREE.Vector2();
  private isActivePlaneFlipped = false;
  private readonly highlightAxisLine: Line;

  constructor(
    public camera: THREE.Camera,
    private domElement: HTMLElement,
    private controls: { [id: string]: Controls }
  ) {
    super();
    this.highlightAxisLine = this.createAxisLine();
    /**
     * mousedown and touchstart are used instead of pointerdown because
     * pointermove seems to stop firing after some a few events in chrome mobile
     * this could be because of some capture/passive setting but couldn't find
     * anything useful. using touch(*) events works.
     */
    addEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true
    });
    addEventListener(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, {
      passive: false,
      capture: true
    });
  }

  private createAxisLine = () => {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, -100));
    geometry.vertices.push(new THREE.Vector3(0, 0, 100));
    return new Line("white", geometry);
  };

  private pointerDownListener = (event: MouseEvent | TouchEvent) => {
    const point = getPointFromEvent(event);
    // touches can be empty
    if (!point) {
      return;
    }
    const { clientX, clientY } = point;
    this.setRayDirection(clientX, clientY);

    // useful for calculating dragRatio (used in dampingFactor calculation)
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
      this.activePlane = new THREE.Plane();
      const eyePlaneNormal = this.getEyePlaneNormal(this.activeHandle);
      controls.getWorldQuaternion(this.controlsWorldQuaternion);
      this.normal.copy(
        this.activeHandle instanceof PickGroup ? eyePlaneNormal : this.activeHandle.up
      );
      if (!(this.activeHandle instanceof RotationEye || this.activeHandle instanceof PickGroup)) {
        this.normal.applyQuaternion(this.controlsWorldQuaternion);
      }
      /*
        if the angle between the eye-normal and the normal to the activePlane is
        too small, a small mouse movement makes a large projection on the activePlane,
        causing the object to jump big distances. To avoid this, the activePlane
        is flipped by 90 degrees about the parallel vector of the handle.
        This problem only requires mitigation in the TranslationGroup handle case.
       */
      if (this.activeHandle instanceof TranslationGroup) {
        const dot = eyePlaneNormal.dot(this.normal) / eyePlaneNormal.length();
        // arccos(0.25) ~= 75 degrees
        // this is the threshold to make the plane normal flip
        this.isActivePlaneFlipped = Math.abs(dot) < 0.25;
        if (this.isActivePlaneFlipped) {
          this.isActivePlaneFlipped = true;
          this.normal.applyAxisAngle(this.activeHandle.parallel, Math.PI / 2);
        }
      }
      if (this.activeHandle instanceof TranslationGroup) {
        this.activePlane.setFromNormalAndCoplanarPoint(this.normal, this.activeHandle.position);
      } else {
        this.activePlane.setFromNormalAndCoplanarPoint(this.normal, controls.position);
      }

      // find initial intersection
      const initialIntersectionPoint = new THREE.Vector3();
      if (this.activeHandle instanceof PickGroup) {
        this.activeHandle.getWorldPosition(initialIntersectionPoint);
      } else {
        this.ray.intersectPlane(this.activePlane, initialIntersectionPoint);
      }

      // activate the helper plane if asked
      // available only for TranslationGroup and RotationGroup
      // (except RotationEye - plane of rotation is obvious)
      const scene = controls.parent as THREE.Scene;
      if (
        controls.showHelperPlane &&
        (this.activeHandle instanceof TranslationGroup ||
          this.activeHandle instanceof RotationGroup) &&
        !(this.activeHandle instanceof RotationEye)
      ) {
        this.helperPlane = new THREE.PlaneHelper(this.activePlane, 1);
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

      // switch event listeners and dispatch DRAG_START
      removeEventListener(
        this.domElement,
        ["pointerdown", "touchstart"],
        this.pointerDownListener,
        {
          capture: true
        }
      );
      emitter.emit(EVENTS.DRAG_START, {
        point: initialIntersectionPoint,
        handle: this.activeHandle
      });
      addEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
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
    removeEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
      capture: true
    });
    addEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      passive: false,
      capture: true
    });
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

  private resolveHandleGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent as IHandle;
  };

  public destroy = () => {
    this.activePlane = null;
    this.activeHandle = null;
    removeEventListener(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, {
      capture: true
    });
    removeEventListener(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, {
      capture: true
    });
    removeEventListener(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, {
      capture: true
    });
  };
}
