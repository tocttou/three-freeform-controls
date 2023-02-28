import { createNanoEvents } from "nanoevents";
import { IHandle } from "../controls/handles";
import { Vector3 } from "three";
import { EVENTS } from "./events";

export const emitter = createNanoEvents<{
  [event in EVENTS]: (args: {
    point: Vector3;
    handle: IHandle | null;
    dragRatio?: number;
  }) => void;
}>();

export const unbindAll = () => {
  for (const event of Object.keys(EVENTS)) {
    emitter.on(event as EVENTS, () => undefined);
  }
  emitter.events = {}
};
