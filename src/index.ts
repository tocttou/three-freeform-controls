import * as THREE from "three";
import Controls from "./controls";
import Raycaster, { RAYCASTER_EVENTS } from "./utils/raycaster";
import { emitter } from "./utils/emmiter";

export { RAYCASTER_EVENTS };

export default class FreeformControls extends THREE.Object3D {
  private objects: { [id: number]: THREE.Object3D } = {};
  private controls: { [id: number]: THREE.Object3D } = {};
  private objectsControlsMap: { [id: number]: number } = {};
  private eventListeners: { [event in RAYCASTER_EVENTS]: Array<() => void> } = {
    [RAYCASTER_EVENTS.DRAG_START]: [],
    [RAYCASTER_EVENTS.DRAG_STOP]: []
  };
  private rayCaster: Raycaster;

  constructor(private camera: THREE.Camera, private domElement: HTMLElement) {
    super();
    this.rayCaster = new Raycaster(this.camera, this.domElement, this.controls);

    this.listenToEvents();
  }

  private listenToEvents = () => {
    emitter.on(RAYCASTER_EVENTS.DRAG_START, () => {
      this.eventListeners[RAYCASTER_EVENTS.DRAG_START].map(callback => {
        callback();
      });
    });

    emitter.on(RAYCASTER_EVENTS.DRAG_STOP, () => {
      this.eventListeners[RAYCASTER_EVENTS.DRAG_STOP].map(callback => {
        callback();
      });
    });
  };

  public attach: (object: THREE.Mesh) => this = object => {
    if (this.objects.hasOwnProperty(object.id)) {
      return this;
    }

    const controlsId = this.addControls(object);
    this.objects[object.id] = object;
    this.objectsControlsMap[object.id] = controlsId;
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
    return controls.id;
  };

  listen = (event: RAYCASTER_EVENTS, callback: () => void): void => {
    this.eventListeners[event].push(callback);
  };

  removeListen = (event: RAYCASTER_EVENTS, callback: () => void): void => {
    const index = this.eventListeners[event].findIndex(callback);
    if (index !== -1) {
      this.eventListeners[event].splice(index, 1);
    }
  };
}
