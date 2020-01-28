import * as THREE from "three";
import Controls from "../controls";
export declare enum EVENTS {
    DRAG_START = "DRAG_START",
    DRAG = "DRAG",
    DRAG_STOP = "DRAG_STOP"
}
/**
 * @hidden
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
    private activePlane;
    private point;
    private normal;
    private visibleHandles;
    private visibleControls;
    private helperPlane;
    private controlsWorldQuaternion;
    private clientDiagonalLength;
    private previousScreenPoint;
    private currentScreenPoint;
    private isActivePlaneFlipped;
    private readonly highlightAxisLine;
    constructor(camera: THREE.Camera, domElement: HTMLElement, controls: {
        [id: string]: Controls;
    });
    private createAxisLine;
    private pointerDownListener;
    private getEyePlaneNormal;
    private setRayDirection;
    private pointerMoveListener;
    private pointerUpListener;
    private setPickPlaneOpacity;
    private resolveHandleGroup;
    destroy: () => void;
}
