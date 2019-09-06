import * as THREE from "three";
import Controls from "./controls";
import Raycaster, { RAYCASTER_EVENTS } from "./utils/raycaster";
import { emitter, unbindAll } from "./utils/emmiter";

export { RAYCASTER_EVENTS };

export default class FreeformControls extends THREE.Object3D {
  private objects: { [id: number]: THREE.Object3D } = {};
  private controls: { [id: number]: Controls } = {};
  private objectsControlsMap: { [id: number]: number | undefined } = {};
  private eventListeners: {
    [event in RAYCASTER_EVENTS]: Array<(object: THREE.Object3D | null) => void>;
  } = {
    [RAYCASTER_EVENTS.DRAG_START]: [],
    [RAYCASTER_EVENTS.DRAG]: [],
    [RAYCASTER_EVENTS.DRAG_STOP]: []
  };
  private rayCaster: Raycaster;

  constructor(private camera: THREE.Camera, private domElement: HTMLElement) {
    super();
    this.rayCaster = new Raycaster(this.camera, this.domElement, this.controls);

    this.listenToEvents();
  }

  private listenToEvents = () => {
    emitter.on(RAYCASTER_EVENTS.DRAG_START, ({ point, handle }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processDragStart({ point, handle });
      this.eventListeners[RAYCASTER_EVENTS.DRAG_START].map(callback => {
        callback(controls.object);
      });
    });

    emitter.on(RAYCASTER_EVENTS.DRAG, ({ point, handle }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processHandle({ point, handle });
      this.eventListeners[RAYCASTER_EVENTS.DRAG].map(callback => {
        callback(controls.object);
      });
    });

    emitter.on(RAYCASTER_EVENTS.DRAG_STOP, ({ handle }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.isBeingDraggedTranslation = false;
      controls.isBeingDraggedRotation = false;
      this.eventListeners[RAYCASTER_EVENTS.DRAG_STOP].map(callback => {
        callback(controls.object);
      });
    });
  };

  public attach: (object: THREE.Object3D) => this = object => {
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
    const controls = this.getControlsForObject(object);
    this.remove(controls);
    this.eventListeners[RAYCASTER_EVENTS.DRAG_STOP].map(callback => {
      callback(controls.object);
    });
    this.dispose(controls);

    delete this.objects[object.id];
    delete this.controls[controls.id];
    delete this.objectsControlsMap[object.id];
  };

  private addControls = (object: THREE.Object3D) => {
    const controls = new Controls(object);
    this.controls[controls.id] = controls;
    this.add(controls);
    return controls.id;
  };

  public listen = (event: RAYCASTER_EVENTS, callback: () => void): void => {
    this.eventListeners[event].push(callback);
  };

  public removeListen = (event: RAYCASTER_EVENTS, callback: () => void): void => {
    const index = this.eventListeners[event].findIndex(callback);
    if (index !== -1) {
      this.eventListeners[event].splice(index, 1);
    }
  };

  private dispose = (object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      if (Array.isArray(object.material)) {
        object.material.map(material => material.dispose());
      } else {
        object.material.dispose();
      }
    }
    while (object.children.length > 0) {
      object.children.map(child => {
        this.dispose(child);
        object.remove(child);
      });
    }
  };

  public destroy = () => {
    unbindAll();

    const scene = this.parent;
    if (scene !== null) {
      scene.remove(this);
    }
    this.dispose(this);
    Object.values(this.controls).map(control => {
      this.dispose(control);
    });
    this.eventListeners[RAYCASTER_EVENTS.DRAG_STOP].map(callback => {
      callback(null);
    });

    this.rayCaster.destroy();
    this.objects = {};
    this.controls = {};
    this.objectsControlsMap = {};
    this.eventListeners = {
      [RAYCASTER_EVENTS.DRAG_START]: [],
      [RAYCASTER_EVENTS.DRAG]: [],
      [RAYCASTER_EVENTS.DRAG_STOP]: []
    };
  };

  private getControlsForObject = (object: THREE.Object3D) => {
    const controlsId = this.objectsControlsMap[object.id];
    if (controlsId === undefined) {
      throw new Error(
        "object has not been attached - please call freeFormControls.attach(object) first"
      );
    }
    return this.controls[controlsId];
  };

  public showXT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showXT(visibility);
  public showYT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showYT(visibility);
  public showZT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showZT(visibility);
  public showXR = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showXR(visibility);
  public showYR = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showYR(visibility);
  public showZR = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showZR(visibility);
  public showPickT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showPickT(visibility);
  public showPickPlaneXYT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showPickPlaneXYT(visibility);
  public showPickPlaneYZT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showPickPlaneYZT(visibility);
  public showPickPlaneZXT = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showPickPlaneZXT(visibility);
}
