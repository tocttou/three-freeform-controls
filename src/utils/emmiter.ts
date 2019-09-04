import * as THREE from "three";
import NanoEvents from "nanoevents";
import unbindAllEvents from "nanoevents/unbind-all";
import { RAYCASTER_EVENTS } from "./raycaster";
import Translation from "../controls/translation";
import Rotation from "../controls/rotation";

export const emitter = new NanoEvents<
  { [event in RAYCASTER_EVENTS]: { point: THREE.Vector3; handle: Translation | Rotation | null } }
>();
export const unbindAll = () => unbindAllEvents(emitter);
