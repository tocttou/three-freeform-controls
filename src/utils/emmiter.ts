import * as THREE from "three";
import NanoEvents from "nanoevents";
import unbindAllEvents from "nanoevents/unbind-all";
import { RAYCASTER_EVENTS } from "./raycaster";

export const emitter = new NanoEvents<
  { [event in RAYCASTER_EVENTS]: { point: THREE.Vector3; control: THREE.Object3D | null } }
>();
export const unbindAll = () => unbindAllEvents(emitter);
