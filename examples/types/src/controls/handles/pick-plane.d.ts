import Plane from "../../primitives/plane";
import Line from "../../primitives/line";
import { PickPlaneGroup } from "./index";
export default class PickPlane extends PickPlaneGroup {
    /**
     * @internal
     */
    readonly plane: Plane;
    /**
     * @internal
     */
    readonly boundary: Line;
    /**
     * @internal
     */
    readonly crossX: Line;
    /**
     * @internal
     */
    readonly crossY: Line;
    constructor(color?: string, width?: number, height?: number);
    /**
     * @internal
     */
    getInteractiveObjects: () => Plane[];
    setColor: (color: string) => void;
}
