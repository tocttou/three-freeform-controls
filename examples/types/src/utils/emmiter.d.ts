import { IHandle } from "../controls/handles";
import { Vector3 } from "three";
export declare const emitter: import("nanoevents").Emitter<{
    DRAG_START: (args: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number;
    }) => void;
    DRAG: (args: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number;
    }) => void;
    DRAG_STOP: (args: {
        point: Vector3;
        handle: IHandle | null;
        dragRatio?: number;
    }) => void;
}>;
export declare const unbindAll: () => void;
