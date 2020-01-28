import * as THREE from "three";
import NanoEvents from "nanoevents";
export declare const emitter: NanoEvents<{
    DRAG_START: {
        point: THREE.Vector3;
        handle: import("../controls/handles").RotationGroup | import("../controls/handles").TranslationGroup | import("../controls/handles").PickGroup | import("../controls/handles").PickPlaneGroup | null;
        dragRatio?: number | undefined;
    };
    DRAG: {
        point: THREE.Vector3;
        handle: import("../controls/handles").RotationGroup | import("../controls/handles").TranslationGroup | import("../controls/handles").PickGroup | import("../controls/handles").PickPlaneGroup | null;
        dragRatio?: number | undefined;
    };
    DRAG_STOP: {
        point: THREE.Vector3;
        handle: import("../controls/handles").RotationGroup | import("../controls/handles").TranslationGroup | import("../controls/handles").PickGroup | import("../controls/handles").PickPlaneGroup | null;
        dragRatio?: number | undefined;
    };
}>;
export declare const unbindAll: () => void;
