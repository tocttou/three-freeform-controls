import * as THREE from "three";

export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();
  private activeControl: THREE.Object3D | null = null;
  private activePlane: THREE.Plane | null = null;

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
    const point = new THREE.Vector3();
    this.ray.intersectPlane(this.activePlane, point);
    console.log(point);
  };

  private mouseUpListener = () => {
    this.domElement.removeEventListener("mousemove", this.mouseMoveListener);
    this.domElement.addEventListener("mousedown", this.mouseDownListener, false);
  };

  private resolveControlGroup = (intersectedObject: THREE.Intersection | undefined) => {
    if (intersectedObject === undefined) {
      return null;
    }

    return intersectedObject.object.parent;
  };
}
