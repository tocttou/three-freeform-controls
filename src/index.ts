import * as THREE from "three";
import Controls, { ANCHOR_MODE, DEFAULT_HANDLE_GROUP_NAME, IControlsOptions } from "./controls";
import Raycaster, { RAYCASTER_EVENTS } from "./utils/raycaster";
import { emitter, unbindAll } from "./utils/emmiter";
import { PickPlaneGroup, RotationGroup, TranslationGroup } from "./controls/handles";
import Translation from "./controls/handles/translation";
import Rotation from "./controls/handles/rotation";
import Pick from "./controls/handles/pick";
import PickPlane from "./controls/handles/pick-plane";

export {
  RAYCASTER_EVENTS,
  DEFAULT_HANDLE_GROUP_NAME,
  ANCHOR_MODE,
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

  public anchor = (object: THREE.Object3D, options?: IControlsOptions) => {
    const controls = this.addControls(object, options);
    this.objects[object.id] = object;
    return controls;
  };

  public detach = (object: THREE.Object3D, controls: Controls) => {
    if (!this.objects.hasOwnProperty(object.id)) {
      throw new Error("object should be attached first");
    }
    this.remove(controls);
    this.eventListeners[RAYCASTER_EVENTS.DRAG_STOP].map(callback => {
      callback(controls.object, null);
    });
    this.dispose(controls);

    delete this.objects[object.id];
    delete this.controls[controls.id];
  };

  private addControls = (object: THREE.Object3D, options?: IControlsOptions) => {
    const controls = new Controls(object, this.camera, options);
    this.controls[controls.id] = controls;
    this.add(controls);
    return controls;
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
    this.eventListeners = {
      [RAYCASTER_EVENTS.DRAG_START]: [],
      [RAYCASTER_EVENTS.DRAG]: [],
      [RAYCASTER_EVENTS.DRAG_STOP]: []
    };
  };
}
