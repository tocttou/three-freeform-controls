import Controls, { IControlsOptions } from "./controls";
import Raycaster, { EVENTS } from "./utils/raycaster";
import { emitter, unbindAll } from "./utils/emmiter";
import { DEFAULT_HANDLE_GROUP_NAME } from "./controls/handles";
import {Camera, Mesh, Object3D, WebXRController} from "three";
import XRRaycaster from "./utils/xr-raycaster";

/**
 * The ControlsManager provides helper functions to create Controls instances
 * and link them up with a Raycaster instance (reused across multiple Controls
 * instances).
 * @noInheritDoc
 */
export default class ControlsManager extends Object3D {
  private objects: { [id: number]: Object3D } = {};
  private controls: { [id: number]: Controls } = {};
  private eventListeners: {
    [event in EVENTS]: Array<
      (object: Object3D | null, handleName: DEFAULT_HANDLE_GROUP_NAME | string) => void
    >;
  } = {
    [EVENTS.DRAG_START]: [],
    [EVENTS.DRAG]: [],
    [EVENTS.DRAG_STOP]: []
  };
  private rayCaster: Raycaster;
  private xrRaycaster: XRRaycaster | null = null;

  /**
   * @param camera - the THREE.Camera instance used in the scene
   * @param domElement - the dom element on which THREE.js renderer is attached,
   * @param xrControllers - WebXR Controllers to attach events to,
   * generally available as `renderer.domElement`
   */
  constructor(private camera: Camera, private domElement: HTMLElement, private xrControllers: WebXRController[] = []) {
    super();
    this.rayCaster = new Raycaster(this.camera, this.domElement, this.controls);
    if(xrControllers.length) {
      this.xrRaycaster = new XRRaycaster(xrControllers, this.controls)
    }
    this.listenToEvents();
  }

  private listenToEvents = () => {
    emitter.on(EVENTS.DRAG_START, ({ point, handle }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processDragStart({ point, handle });
      this.eventListeners[EVENTS.DRAG_START].map(callback => {
        callback(controls.object, handle.name);
      });
    });

    emitter.on(EVENTS.DRAG, ({ point, handle, dragRatio }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processDrag({ point, handle, dragRatio });
      this.eventListeners[EVENTS.DRAG].map(callback => {
        callback(controls.object, handle.name);
      });
    });

    emitter.on(EVENTS.DRAG_STOP, ({ handle }) => {
      if (handle === null) {
        return;
      }
      const controls = handle.parent as Controls | null;
      if (controls === null) {
        return;
      }
      controls.processDragEnd({ handle });
      this.eventListeners[EVENTS.DRAG_STOP].map(callback => {
        callback(controls.object, handle.name);
      });
    });
  };

  /**
   * Creates a Controls instance and attaches it to the provided THREE.js object
   *
   * @param object - the object provided by the user
   * @param options
   */
  public anchor = (object: Object3D, options?: IControlsOptions) => {
    const controls = this.addControls(object, options);
    this.objects[object.id] = object;
    return controls;
  };

  /**
   * Function to handle movements on WebXR controllers. Since unlike mouse and touch events, there's no move event for webxr controllers
   *
   */
  public update = () => {
    if(this.xrRaycaster) {
      this.xrRaycaster.update();
    }
  };

  /**
   * Detaches the Controls instance from the provided THREE.js object
   *
   * @param object - the object provided by the user
   * @param controls - the controls instance anchored on the object
   */
  public detach = (object: Object3D, controls: Controls) => {
    if (!Object.prototype.hasOwnProperty.call(this.objects, object.id)) {
      throw new Error("object should be attached first");
    }
    this.remove(controls);
    this.dispose(controls);

    delete this.objects[object.id];
    delete this.controls[controls.id];
  };

  private addControls = (object: Object3D, options?: IControlsOptions) => {
    const controls = new Controls(object, this.camera, options);
    this.controls[controls.id] = controls;
    this.add(controls);
    return controls;
  };

  /**
   * Adds an event listener. Note that there is another method `addEventListener`
   * on THREE.Object3D from which this class extends but that is specific to the
   * internals of THREE.js, but not this library
   * @param event
   * @param callback - by default the second argument is the default group name
   * for the Handle involved; for a custom handle, it is the `name` property
   * set on the handle
   */
  public listen = (
    event: EVENTS,
    callback: (
      object: Object3D | null,
      handleName: DEFAULT_HANDLE_GROUP_NAME | string
    ) => void
  ): void => {
    this.eventListeners[event].push(callback);
  };

  /**
   * Removes the event listener.
   * @param event
   * @param callback
   */
  public removeListen = (
    event: EVENTS,
    callback: (
      object: Object3D | null,
      handleName: DEFAULT_HANDLE_GROUP_NAME | string
    ) => void
  ): void => {
    const index = this.eventListeners[event].findIndex(x => x === callback);
    if (index !== -1) {
      this.eventListeners[event].splice(index, 1);
    }
  };

  private dispose = (object: Object3D) => {
    if (object instanceof Mesh) {
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

  /**
   * Destroys all Controls instances and removes all event listeners
   */
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

    this.rayCaster.destroy();
    this.objects = {};
    this.controls = {};
    this.eventListeners = {
      [EVENTS.DRAG_START]: [],
      [EVENTS.DRAG]: [],
      [EVENTS.DRAG_STOP]: []
    };
  };
}
