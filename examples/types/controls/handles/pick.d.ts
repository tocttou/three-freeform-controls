import Octahedron from "../../primitives/octahedron";
import { PickGroup } from "./index";
export default class Pick extends PickGroup {
    private readonly octahedron;
    constructor();
    /**
     * @internal
     */
    getInteractiveObjects: () => Octahedron[];
    setColor: (color: string) => void;
}
