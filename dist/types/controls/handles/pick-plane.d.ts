import Plane from "../../primitives/plane";
import Line from "../../primitives/line";
import { PickPlaneGroup } from "./index";
export default class PickPlane extends PickPlaneGroup {
    /**
     * @hidden
     */
    readonly plane: Plane;
    /**
     * @hidden
     */
    readonly boundary: Line;
    /**
     * @hidden
     */
    readonly crossX: Line;
    /**
     * @hidden
     */
    readonly crossY: Line;
    constructor(color?: string, width?: number, height?: number);
    /**
     * @hidden
     */
    getInteractiveObjects: () => Plane[];
    setColor: (color: string) => void;
}
