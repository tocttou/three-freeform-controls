import NanoEvents from "nanoevents";
import unbindAllEvents from "nanoevents/unbind-all";
import { EVENTS } from "./raycaster";
import { IHandle } from "../controls/handles";
import { Vector3 } from "three";

export const emitter = new NanoEvents<{
  [event in EVENTS]: {
    point: Vector3;
    handle: IHandle | null;
    dragRatio?: number;
  };
}>();
export const unbindAll = () => unbindAllEvents(emitter);
