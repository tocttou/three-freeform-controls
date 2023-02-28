import { Vector3 } from "three";
import Cone from "../../primitives/cone";
import { TranslationGroup } from "./index";
export default class Translation extends TranslationGroup {
    private readonly cone;
    private readonly line;
    parallel: Vector3;
    constructor(color?: string);
    /**
     * @internal
     */
    getInteractiveObjects: () => Cone[];
    setColor: (color: string) => void;
}
