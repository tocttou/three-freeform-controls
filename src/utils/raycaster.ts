import * as THREE from "three";
import { emitter } from "./emmiter";

export enum RAYCASTER_EVENTS {
  DRAG_START = "DRAG_START",
  DRAG_STOP = "DRAG_STOP"
}

export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private activeControl: THREE.Object3D | null = null;
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
    this.activeControl = this.resolveControlGroup(this.intersectObjects(objects, true)[0]);

    if (this.activeControl !== null) {
      this.activePlane = new THREE.Plane();
      this.activePlane.setFromNormalAndCoplanarPoint(
        this.activeControl.up,
        this.activeControl.position
      );

      this.domElement.removeEventListener("mousedown", this.mouseDownListener);
      this.domElement.addEventListener("mousemove", this.mouseMoveListener, false);
    } else {
      this.activePlane = null;
    }
  };

  private setRayDirection = (event: MouseEvent) => {
    const rect = this.domElement.getBoundingClientRect();
    const { clientHeight, clientWidth } = this.domElement;
    this.mouse.x = ((event.clientX - rect.left) / clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / clientHeight) * 2 + 1;
    this.setFromCamera(this.mouse, this.camera);
  };

  private mouseMoveListener = (event: MouseEvent) => {
    if (this.activeControl === null || this.activePlane === null) {
      return;
    }
    this.setRayDirection(event);
    this.ray.intersectPlane(this.activePlane, this.point);
    emitter.emit(RAYCASTER_EVENTS.DRAG_START, { point: this.point, control: this.activeControl });
  };

  private mouseUpListener = () => {
    this.domElement.removeEventListener("mousemove", this.mouseMoveListener);
    this.domElement.addEventListener("mousedown", this.mouseDownListener, false);
    this.activeControl = null;
    this.activePlane = null;
    emitter.emit(RAYCASTER_EVENTS.DRAG_STOP, { point: this.point, control: this.activeControl });
  };

  private resolveControlGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent;
  };
}
