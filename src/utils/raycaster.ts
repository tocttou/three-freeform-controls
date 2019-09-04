import * as THREE from "three";

export default class Raycaster extends THREE.Raycaster {
  private mouse = new THREE.Vector2();

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
    const rect = this.domElement.getBoundingClientRect();
    const { clientHeight, clientWidth } = this.domElement;
    this.mouse.x = ((event.clientX - rect.left) / clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / clientHeight) * 2 + 1;
    this.setFromCamera(this.mouse, this.camera);

    const objects = Object.values(this.controls);
    const control = this.resolveControlGroup(this.intersectObjects(objects, true)[0]);

    if (control !== null) {
      this.domElement.removeEventListener("mousedown", this.mouseDownListener);
      this.domElement.addEventListener("mousemove", this.mouseMoveListener, false);
    }
  };

  private mouseMoveListener = (event: MouseEvent) => {
    console.log(event.clientX, event.clientY);
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
