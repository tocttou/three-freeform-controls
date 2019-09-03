import * as THREE from "three";
import Controls from "./controls";

export default class FreeformControls extends THREE.Object3D {
  private objects: { [id: string]: THREE.Object3D } = {};
  private controls: { [id: string]: THREE.Object3D } = {};

  constructor(private camera: THREE.Camera, private domElement: HTMLElement) {
    super();
  }

  public attach: (object: THREE.Mesh) => this = object => {
    if (this.objects.hasOwnProperty(object.id)) {
      return this;
    }

    this.objects[object.id] = object;
    this.addControls(object);
    return this;
  };

  public detach = (object: THREE.Object3D) => {
    if (!this.objects.hasOwnProperty(object.id)) {
      throw new Error("object should be attached first");
    }

    delete this.objects[object.id];
    // TODO: run detachment function
  };

  private addControls = (object: THREE.Mesh) => {
    const controls = new Controls(object);
    this.controls[object.id] = controls;
    this.add(controls);
  };
}
