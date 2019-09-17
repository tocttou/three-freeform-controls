import * as THREE from "three";
import NanoEvents from "nanoevents";
import unbindAllEvents from "nanoevents/unbind-all";
import { RAYCASTER_EVENTS } from "./raycaster";
import { IHandle } from "../controls/handles";

export const emitter = new NanoEvents<
  {
    [event in RAYCASTER_EVENTS]: {
      point: THREE.Vector3;
      handle: IHandle | null;
      dragRatio?: number;
    };
  }
>();
export const unbindAll = () => unbindAllEvents(emitter);
