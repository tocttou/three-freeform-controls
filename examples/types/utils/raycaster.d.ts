import Controls from "../controls";
import * as THREE from "three";
/**
 * @internal
 * The Raycaster listens on the mouse and touch events globally and
 * dispatches DRAG_START, DRAG, and DRAG_STOP events.
 */
export default class Raycaster extends THREE.Raycaster {
    camera: THREE.Camera;
    private domElement;
    private controls;
    private mouse;
    private cameraPosition;
    private activeHandle;
    private point;
    private visibleHandles;
    private visibleControls;
    private clientDiagonalLength;
    private previousScreenPoint;
    private currentScreenPoint;
    private readonly highlightAxisLine;
    constructor(camera: THREE.Camera, domElement: HTMLElement, controls: {
        [id: string]: Controls;
    });
    private createAxisLine;
    /**
     * Find the handle the user clicked on.
     */
    private findActiveHandle;
    /**
     * Find the closest points between two rays.
     */
    private findClosestPoints;
    /**
     * Hide other control instances on drag if asked.
     */
    private hideOtherControlsInstancesOnDrag;
    /**
     * Hide other handles on drag if asked.
     */
    private hideOtherHandlesOnDrag;
    /**
     * Show the operation axis if asked. Available only for TranslationGroup
     * and RotationGroup (except RotationEye where plane of rotation is obvious).
     */
    private showAxis;
    /**
     * Determine the Active Plane i.e. the plane on which intersection actions
     * take place. An Active Plane is used during rotation operations.
     * Mouse movements are translated to points on the Active Plane.
     */
    private calculateActivePlane;
    /**
     * Find the initial point representing the translation, either by intersecting
     * the view ray with the current active plane, or by calculating the closest
     * point on the translation axis to the view ray.
     */
    private calculateManipulationPoint;
    /**
     * This method is executed when the mouse is pressed.
     */
    private pointerDownListener;
    /**
     * Return the normal of the plane perpendicular to the view direction and
     * passing by the given object.
     */
    private getEyePlaneNormal;
    private setRayDirection;
    private pointerMoveListener;
    private pointerUpListener;
    private setPickPlaneOpacity;
    private resolveHandleGroup;
    destroy: () => void;
}
