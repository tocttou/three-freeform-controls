import * as THREE from "three";
import Controls, { ATTACH_MODE, DEFAULT_HANDLE_GROUP_NAME, ISeparationT } from "./controls";
import Raycaster, { RAYCASTER_EVENTS } from "./utils/raycaster";
import { emitter, unbindAll } from "./utils/emmiter";
import { IHandle, PickPlaneGroup, RotationGroup, TranslationGroup } from "./controls/handles";
import Translation from "./controls/handles/translation";
import Rotation from "./controls/handles/rotation";
import Pick from "./controls/handles/pick";
import PickPlane from "./controls/handles/pick-plane";

export {
  RAYCASTER_EVENTS,
  DEFAULT_HANDLE_GROUP_NAME,
  ATTACH_MODE,
  Translation,
  Rotation,
  Pick,
  PickPlane,
  PickPlaneGroup,
  RotationGroup,
  TranslationGroup
};

export default class FreeformControls extends THREE.Object3D {
  private objects: { [id: number]: THREE.Object3D } = {};
  private controls: { [id: number]: Controls } = {};
  private objectsControlsMap: { [id: number]: number | undefined } = {};
  private eventListeners: {
    [event in RAYCASTER_EVENTS]: Array<
      (object: THREE.Object3D | null, handleName: string | null) => void
    >;
  } = {
    [RAYCASTER_EVENTS.DRAG_START]: [],
    [RAYCASTER_EVENTS.DRAG]: [],
    [RAYCASTER_EVENTS.DRAG_STOP]: []
  };
  private rayCaster: Raycaster;

  constructor(
    private camera: THREE.Camera,
    private domElement: HTMLElement,
    private separationT?: ISeparationT
  ) {
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
        callback(controls.object, handle.name);
      });
    });

    emitter.on(RAYCASTER_EVENTS.DRAG, ({ point, handle, dragRatio }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processHandle({ point, handle, dragRatio });
      this.eventListeners[RAYCASTER_EVENTS.DRAG].map(callback => {
        callback(controls.object, handle.name);
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
        callback(controls.object, handle.name);
      });
    });
  };

  public attach: (object: THREE.Object3D, attachMode?: ATTACH_MODE) => this = (
    object,
    attachMode = ATTACH_MODE.FIXED
  ) => {
    if (this.objects.hasOwnProperty(object.id)) {
      return this;
    }

    const controlsId = this.addControls(object, attachMode);
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
      callback(controls.object, null);
    });
    this.dispose(controls);

    delete this.objects[object.id];
    delete this.controls[controls.id];
    delete this.objectsControlsMap[object.id];
  };

  private addControls = (object: THREE.Object3D, attachMode: ATTACH_MODE) => {
    const controls = new Controls(object, this.separationT, attachMode);
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
      callback(null, null);
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

  public showByNames = (object: THREE.Object3D, handleNames: string[], visibility = true) => {
    handleNames.map(handleName =>
      this.getControlsForObject(object).showByName(handleName, visibility)
    );
  };

  public showAll = (object: THREE.Object3D, visibility = true) =>
    this.getControlsForObject(object).showAll(visibility);

  public setupHandle = (object: THREE.Object3D, handle: IHandle) =>
    this.getControlsForObject(object).setupHandle(handle);

  public enableDamping = (object: THREE.Object3D, enable = true) =>
    (this.getControlsForObject(object).isDampingEnabled = enable);

  public setDampingFactor = (object: THREE.Object3D, dampingFactor = 0) =>
    (this.getControlsForObject(object).dampingFactor = THREE.Math.clamp(dampingFactor, 0, 1));

  public setUserData = (object: THREE.Object3D, userData: { [key: string]: any }) => {
    const controls = this.getControlsForObject(object);
    controls.userData = userData;
  };
  public getUserData = (object: THREE.Object3D) => this.getControlsForObject(object).userData;
}
