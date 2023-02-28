import { Camera } from "three";
import Rotation from "./rotation";
/**
 * @internal
 */
export default class RotationEye extends Rotation {
    camera: Camera | null;
    private controlsWorldOrientation;
    private _temp1;
    private _temp2;
    private _temp3;
    private worldPosition;
    constructor(color?: string, radius?: number);
    updateMatrixWorld(force?: boolean): void;
}
