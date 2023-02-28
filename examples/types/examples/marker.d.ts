import * as THREE from "three";
import * as FreeformControls from "../";
/**
 * This is a 3D marker to move and rotate an object in the scene.
 *
 * @example
 * import { Marker, MarkerEvents } from "./marker";
 * const marker = new Marker(this.camera, this.renderer.domElement, 1.4, 0.6, 0.2, 1.2);
 * this.marker.link(sphere);
 * marker.listen(MarkerEvents.EVENTS.DRAG_START, () => {
 *   this.orbit.enabled = false;
 * });
 * marker.listen(MarkerEvents.EVENTS.DRAG_STOP, () => {
 *   this.orbit.enabled = true;
 * });
 * this.scene.add(marker);
 */
export declare class Marker extends FreeformControls.ControlsManager {
    private minRingRadius;
    private ringSize;
    private arrowRadius;
    private arrowLength;
    constructor(camera: THREE.Camera, domElement: HTMLElement, minRingRadius: number, ringSize: number, arrowRadius: number, arrowLength: number);
    link: (object: THREE.Object3D) => THREE.Group;
}
