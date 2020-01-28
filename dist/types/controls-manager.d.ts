import * as THREE from "three";
import Controls, { IControlsOptions } from "./controls";
import { EVENTS } from "./utils/raycaster";
/**
 * The ControlsManager provides helper functions to create Controls instances
 * and link them up with a Raycaster instance (reused across multiple Controls
 * instances).
 * @noInheritDoc
 */
export default class ControlsManager extends THREE.Object3D {
    private camera;
    private domElement;
    private objects;
    private controls;
    private eventListeners;
    private rayCaster;
    /**
     * @param camera - the THREE.Camera instance used in the scene
     * @param domElement - the dom element on which THREE.js renderer is attached,
     * generally available as `renderer.domElement`
     */
    constructor(camera: THREE.Camera, domElement: HTMLElement);
    private listenToEvents;
    /**
     * Creates a Controls instance and attaches it to the provided THREE.js object
     *
     * @param object - the object provided by the user
     * @param options
     */
    anchor: (object: THREE.Object3D, options?: IControlsOptions | undefined) => Controls;
    /**
     * Detaches the Controls instance from the provided THREE.js object
     *
     * @param object - the object provided by the user
     * @param controls - the controls instance anchored on the object
     */
    detach: (object: THREE.Object3D, controls: Controls) => void;
    private addControls;
    /**
     * Adds an event listener. Note that there is another method `addEventListener`
     * on THREE.Object3D from which this class extends but that is specific to the
     * internals of THREE.js, but not this library
     * @param event
     * @param callback - by default the second argument is the default group name
     * for the Handle involved; for a custom handle, it is the `name` property
     * set on the handle
     */
    listen: (event: EVENTS, callback: (object: THREE.Object3D | null, handleName: string) => void) => void;
    /**
     * Removes the event listener.
     * @param event
     * @param callback
     */
    removeListen: (event: EVENTS, callback: (object: THREE.Object3D | null, handleName: string) => void) => void;
    private dispose;
    /**
     * Destroys all Controls instances and removes all event listeners
     */
    destroy: () => void;
}
