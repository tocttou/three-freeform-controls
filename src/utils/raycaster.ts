import * as THREE from "three";
import { emitter } from "./emmiter";
import Controls from "../controls";
import PickPlane from "../controls/handles/pick-plane";
import { PICK_PLANE_OPACITY } from "./constants";
import { IHandle, PickGroup } from "../controls/handles";

export enum RAYCASTER_EVENTS {
  DRAG_START = "DRAG_START",
  DRAG = "DRAG",
  DRAG_STOP = "DRAG_STOP"
}

export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private cameraPosition = new THREE.Vector3();
  private activeHandle: IHandle | null = null;
  private activePlane: THREE.Plane | null = null;
  private point = new THREE.Vector3();
  private normal = new THREE.Vector3();
  private controlsWorldQuaternion = new THREE.Quaternion();

  constructor(
    public camera: THREE.Camera,
    private domElement: HTMLElement,
    private controls: { [id: string]: Controls }
  ) {
    super();
    this.domElement.addEventListener("mousedown", this.mouseDownListener, false);
    this.domElement.addEventListener("mouseup", this.mouseUpListener, false);
  }

  private mouseDownListener = (event: MouseEvent) => {
    this.setRayDirection(event);

    const interactiveObjects: THREE.Object3D[] = [];
    Object.values(this.controls).map(controls => {
      interactiveObjects.push(...controls.getInteractiveObjects());
    });
    this.activeHandle = this.resolveHandleGroup(this.intersectObjects(interactiveObjects, true)[0]);

    if (this.activeHandle !== null && this.activeHandle.parent !== null) {
      this.activePlane = new THREE.Plane();
      const controls = this.activeHandle.parent;

      controls.getWorldQuaternion(this.controlsWorldQuaternion);
      this.normal.copy(
        this.activeHandle instanceof PickGroup
          ? this.getEyePlaneNormal(this.activeHandle)
          : this.activeHandle.up
      );
      this.normal.applyQuaternion(this.controlsWorldQuaternion);

      if (this.activeHandle instanceof PickPlane) {
        this.setPickPlaneOpacity(PICK_PLANE_OPACITY.ACTIVE);
      }

      this.activePlane.setFromNormalAndCoplanarPoint(
        this.normal,
        (this.activeHandle.parent as Controls).position
      );

      const initialIntersectionPoint = new THREE.Vector3();
      if (this.activeHandle instanceof PickGroup) {
        this.activeHandle.getWorldPosition(initialIntersectionPoint);
      } else {
        this.ray.intersectPlane(this.activePlane, initialIntersectionPoint);
      }

      this.domElement.removeEventListener("mousedown", this.mouseDownListener);
      emitter.emit(RAYCASTER_EVENTS.DRAG_START, {
        point: initialIntersectionPoint,
        handle: this.activeHandle
      });
      this.domElement.addEventListener("mousemove", this.mouseMoveListener, false);
    } else {
      this.activePlane = null;
    }
  };

  private getEyePlaneNormal = (object: THREE.Object3D) => {
    this.cameraPosition.copy(this.camera.position);
    return this.cameraPosition.sub(object.position);
  };

  private setRayDirection = (event: MouseEvent) => {
    const rect = this.domElement.getBoundingClientRect();
    const { clientHeight, clientWidth } = this.domElement;
    this.mouse.x = ((event.clientX - rect.left) / clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / clientHeight) * 2 + 1;
    this.setFromCamera(this.mouse, this.camera);
  };

  private mouseMoveListener = (event: MouseEvent) => {
    if (this.activeHandle === null || this.activePlane === null) {
      return;
    }
    this.setRayDirection(event);
    this.ray.intersectPlane(this.activePlane, this.point);
    emitter.emit(RAYCASTER_EVENTS.DRAG, { point: this.point, handle: this.activeHandle });
  };

  private mouseUpListener = () => {
    this.domElement.removeEventListener("mousemove", this.mouseMoveListener);
    this.domElement.addEventListener("mousedown", this.mouseDownListener, false);
    emitter.emit(RAYCASTER_EVENTS.DRAG_STOP, { point: this.point, handle: this.activeHandle });

    if (this.activeHandle instanceof PickPlane) {
      this.setPickPlaneOpacity(PICK_PLANE_OPACITY.INACTIVE);
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
    this.domElement.removeEventListener("mousedown", this.mouseDownListener);
    this.domElement.removeEventListener("mousemove", this.mouseMoveListener);
    this.domElement.removeEventListener("mouseup", this.mouseUpListener);
  };
}
