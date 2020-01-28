import * as THREE from "three";
import Translation from "./handles/translation";
import Rotation from "./handles/rotation";
import Pick from "./handles/pick";
import PickPlane from "./handles/pick-plane";
import { IHandle } from "./handles";
import RotationEye from "./handles/rotation-eye";
export declare enum ANCHOR_MODE {
    /**
     * In this mode the Controls do not inherit the orientation of the object
     * as it is rotated.
     */
    FIXED = "fixed",
    /**
     * In this mode the Controls rotate as the object is rotated.
     */
    INHERIT = "inherit"
}
/**
 * The first number is the unit limit allowed in the -ve direction.
 * The second number is the unit limit allowed in the +ve direction.
 *
 * All calculations are with respect to anchor position which is the object's
 * position when [[setTranslationLimit]] is called.
 * `{ x: [-1, 2], y: false, z: false }` - sets the translation limit to `-1` unit
 * in the -x-direction, `+2` units in the +x-direction, and no limit on the
 * y and z-direction.
 *
 * Setting the limit to `false` disables the limit in all directions.
 */
export interface TranslationLimit {
    x: [number, number] | false;
    y: [number, number] | false;
    z: [number, number] | false;
}
export interface IControlsOptions {
    /**
     * the anchor mode for the controls
     * @default [[ANCHOR_MODE.FIXED]]
     */
    mode?: ANCHOR_MODE;
    /**
     * distance between the position of the object and the position of the
     * handles (in case of translation handles), or the radius (in case of rotation handles),
     * or the size of the plane (in case of plane handles)
     * @default 0.5
     */
    separation?: number;
    /**
     * uses THREE.Mesh.computeBounds to set the separation; if separation
     * is provided in addition to this option, it is added to the computed bounds
     * @default false
     */
    useComputedBounds?: boolean;
    /**
     * the quaternion applied to the whole Controls instance (handles get rotated relatively)
     * @default undefined
     */
    orientation?: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    /**
     * hides other handles of a Controls instance when drag starts
     * @default true
     */
    hideOtherHandlesOnDrag?: boolean;
    /**
     *  hides all other Controls instances when drag starts
     *  @default true
     */
    hideOtherControlsInstancesOnDrag?: boolean;
    /**
     * displays the plane in which the drag interaction takes place
     * (useful for debugging)
     * @default false
     */
    showHelperPlane?: boolean;
    /**
     * enables damping for the controls
     * @default true
     */
    isDampingEnabled?: boolean;
    /**
     * sets the scaling factor for the radius of rotation handles
     * @default 1.0
     */
    rotationRadiusScale?: number;
    /**
     * sets the scaling factor for the radius of rotation handles in eye plane
     * @default 1.25
     */
    eyeRotationRadiusScale?: number;
    /**
     * sets the width and height scale for the pick plane handles
     * @default 0.75
     */
    pickPlaneSizeScale?: number;
    /**
     * sets the scaling for distance between translation handles' start and the
     * center of the controls
     * @default 1.0
     */
    translationDistanceScale?: number;
    /**
     * For translation handles: highlights the axis along which the object moves.
     * For rotation handles: highlights the axis of rotation.
     * Not available on other handles.
     * @default true
     */
    highlightAxis?: boolean;
    /**
     * Enables snap to grid (nearest integer coordinate) for all translation type handles:
     * [[TranslationGroup]], [[PickGroup]], and [[PickPlaneGroup]]
     * @default { x: false, y: false, z: false }
     */
    snapTranslation?: {
        x: boolean;
        y: boolean;
        z: boolean;
    };
}
/**
 * Controls is the main class in this library.
 * It is a subclass of THREE.Group, so its properties like `position` and
 * `quaternion` can be modified as desired.
 * The `children` are the control handles (like `rotationX`).
 * All translations and rotations are setup with respect to the global coordinate system.
 * @noInheritDoc
 */
export default class Controls extends THREE.Group {
    object: THREE.Object3D;
    private camera;
    /**
     * handle which translates the object in the eye-plane
     */
    readonly pick: Pick;
    /**
     * handle which translates the object in XY plane
     */
    readonly pickPlaneXY: PickPlane;
    /**
     * handle which translates the object in YZ plane
     */
    readonly pickPlaneYZ: PickPlane;
    /**
     * handle which translates the object in ZX plane
     */
    readonly pickPlaneZX: PickPlane;
    /**
     * handle which translates the object along the x-axis; displayed in the
     * +ve x-axis direction
     */
    readonly translationXP: Translation;
    /**
     * handle which translates the object along the y-axis; displayed in the
     * +ve y-axis direction
     */
    readonly translationYP: Translation;
    /**
     * handle which translates the object along the z-axis; displayed in the
     * +ve z-axis direction
     */
    readonly translationZP: Translation;
    /**
     * handle which translates the object along the x-axis; displayed in the
     * -ve x-axis direction
     */
    readonly translationXN: Translation;
    /**
     * handle which translates the object along the y-axis; displayed in the
     * -ve y-axis direction
     */
    readonly translationYN: Translation;
    /**
     * handle which translates the object along the z-axis; displayed in the
     * -ve z-axis direction
     */
    readonly translationZN: Translation;
    /**
     * handle which rotates the object along the x-axis
     */
    readonly rotationX: Rotation;
    /**
     * handle which rotates the object along the y-axis
     */
    readonly rotationY: Rotation;
    /**
     * handle which rotates the object along the z-axis
     */
    readonly rotationZ: Rotation;
    /**
     * handle which rotates the object in the eye-plane
     */
    readonly rotationEye: RotationEye;
    private handleTargetQuaternion;
    private objectWorldPosition;
    private objectTargetPosition;
    private objectTargetQuaternion;
    private objectParentWorldPosition;
    private objectParentWorldQuaternion;
    private objectParentWorldScale;
    private deltaPosition;
    private normalizedHandleParallelVectorCache;
    private touch1;
    private touch2;
    private boundingSphereRadius;
    private dragStartPoint;
    private dragIncrementalStartPoint;
    private handles;
    private isBeingDraggedTranslation;
    private isBeingDraggedRotation;
    private dampingFactor;
    private readonly useComputedBounds;
    private readonly separation;
    private initialSelfQuaternion;
    private readonly minTranslationCache;
    private readonly maxTranslationCache;
    private readonly options;
    private readonly mode;
    private readonly translationDistanceScale;
    private readonly rotationRadiusScale;
    private readonly eyeRotationRadiusScale;
    private readonly pickPlaneSizeScale;
    private translationLimit?;
    private translationAnchor;
    /**
     * enables damping for the controls
     * @default true
     */
    isDampingEnabled: boolean;
    /**
     * hides other handles of a Controls instance when drag starts
     * @default true
     */
    hideOtherHandlesOnDrag: boolean;
    /**
     *  hides all other Controls instances when drag starts
     *  @default true
     */
    hideOtherControlsInstancesOnDrag: boolean;
    /**
     * displays the plane in which the drag interaction takes place
     * (useful for debugging)
     * @default false
     */
    showHelperPlane: boolean;
    /**
     * For translation handles: highlights the axis along which the object moves.
     * For rotation handles: highlights the axis of rotation.
     * Not available on other handles.
     * @default true
     */
    highlightAxis: boolean;
    /**
     * Enables snap to grid (nearest integer coordinate) for all translation type handles:
     * [[TranslationGroup]], [[PickGroup]], and [[PickPlaneGroup]]
     * @default { x: false, y: false, z: false }
     */
    snapTranslation: {
        x: boolean;
        y: boolean;
        z: boolean;
    };
    /**
     *
     * @param object - the object provided by the user
     * @param camera - the THREE.Camera instance used in the scene
     * @param options
     */
    constructor(object: THREE.Object3D, camera: THREE.Camera, options?: IControlsOptions);
    private setupDefaultPickPlane;
    setupHandle: (handle: IHandle) => void;
    private setupDefaultPick;
    private setupDefaultEyeRotation;
    private setupDefaultTranslation;
    private setupDefaultRotation;
    private computeObjectBounds;
    /**
     * Puts a limit on the object's translation anchored at the current position.
     *
     * `{ x: [-1, 2], y: false, z: false }` - sets the translation limit to `-1` unit
     * in the -x-direction, `+2` units in the +x-direction, and no limit on the
     * y and z-direction.
     *
     * Setting the limit to `false` disables the limit in all directions.
     * @param limit
     */
    setTranslationLimit: (limit: false | TranslationLimit) => void;
    /**
     * @hidden
     */
    processDragStart: (args: {
        point: THREE.Vector3;
        handle: IHandle;
    }) => void;
    /**
     * @hidden
     */
    processDragEnd: (args: {
        handle: IHandle;
    }) => void;
    /**
     * Only takes effect if [[IControlsOptions.isDampingEnabled]] is true.
     * @param dampingFactor - value between 0 and 1, acts like a weight on the controls
     */
    setDampingFactor: (dampingFactor?: number) => number;
    /**
     * @hidden
     */
    processDrag: (args: {
        point: THREE.Vector3;
        handle: IHandle;
        dragRatio?: number | undefined;
    }) => void;
    private getLimitedTranslation;
    private detachObjectUpdatePositionAttach;
    private detachHandleUpdateQuaternionAttach;
    /**
     * Applies supplied visibility to the supplied handle names.
     * Individual handle's visibility can also be changed by modifying the `visibility`
     * property on the handle directly.
     * @param handleNames
     * @param visibility
     */
    showByNames: (handleNames: string[], visibility?: boolean) => void;
    /**
     * Applies supplied visibility to all handles
     * @param visibility
     */
    showAll: (visibility?: boolean) => void;
    /**
     * @hidden
     */
    getInteractiveObjects(): THREE.Object3D[];
    /**
     * @hidden
     */
    updateMatrixWorld: (force?: boolean | undefined) => void;
}
