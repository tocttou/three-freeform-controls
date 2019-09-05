import * as THREE from "three";
import { emitter } from "./emmiter";
import Translation from "../controls/translation";
import Rotation from "../controls/rotation";
import Controls from "../controls";
import Pick from "../controls/pick";

export enum RAYCASTER_EVENTS {
  DRAG_START = "DRAG_START",
  DRAG = "DRAG",
  DRAG_STOP = "DRAG_STOP"
}

export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private cameraPosition = new THREE.Vector3();
  private activeHandle: Translation | Rotation | null = null;
  private activePlane: THREE.Plane | null = null;
  private point = new THREE.Vector3();

  constructor(
    public camera: THREE.Camera,
    private domElement: HTMLElement,
    private controls: { [id: string]: THREE.Object3D }
  ) {
    super();
    this.domElement.addEventListener("mousedown", this.mouseDownListener, false);
    this.domElement.addEventListener("mouseup", this.mouseUpListener, false);
  }

  private mouseDownListener = (event: MouseEvent) => {
    this.setRayDirection(event);

    const objects = Object.values(this.controls);
    this.activeHandle = this.resolveControlGroup(this.intersectObjects(objects, true)[0]);

    if (this.activeHandle !== null) {
      this.activePlane = new THREE.Plane();

      const normal =
        this.activeHandle instanceof Pick
          ? this.getEyePlaneNormal(this.activeHandle)
          : this.activeHandle.up;

      this.activePlane.setFromNormalAndCoplanarPoint(
        normal,
        (this.activeHandle.parent as Controls).position
      );

      const initialIntersectionPoint = new THREE.Vector3();
      if (this.activeHandle instanceof Pick) {
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
    this.activeHandle = null;
    this.activePlane = null;
  };

  private resolveControlGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent as (Translation | Rotation);
  };

  public destroy = () => {
    this.activePlane = null;
    this.activeHandle = null;
    this.domElement.removeEventListener("mousedown", this.mouseDownListener);
    this.domElement.removeEventListener("mousemove", this.mouseMoveListener);
    this.domElement.removeEventListener("mouseup", this.mouseUpListener);
  };
}
