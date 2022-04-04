import {Group, WebXRController} from "three";

export const getPointFromEvent = (event: MouseEvent | TouchEvent) => {
  let clientX = 0;
  let clientY = 0;
  if (event instanceof MouseEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else if (event instanceof TouchEvent) {
    if (event.touches.length === 0) {
      return null;
    }
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  }
  return { clientX, clientY };
};

export const addEventListener = (
  element: HTMLElement | WebXRController,
  eventNames: Array<
    "pointerdown" | "touchstart" | "pointerup" | "touchend" | "pointermove" | "touchmove" | "selectstart" | "selectend"
  >,
  callback: (event: MouseEvent | TouchEvent) => void,
  options: { passive?: boolean; capture?: boolean } | boolean = false
) => {
  eventNames.forEach(name => {
    (element as any).addEventListener(name, callback, options);
  });
};

export const removeEventListener = (
  element: HTMLElement | WebXRController,
  eventNames: Array<
    "pointerdown" | "touchstart" | "pointerup" | "touchend" | "pointermove" | "touchmove" | "selectstart" | "selectend"
  >,
  callback: (event: MouseEvent | TouchEvent) => void,
  options: { capture?: boolean } | boolean = false
) => {
  eventNames.forEach(name => {
    (element as any).removeEventListener(name, callback, options);
  });
};
