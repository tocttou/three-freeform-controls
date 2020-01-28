export declare const getPointFromEvent: (event: MouseEvent | TouchEvent) => {
    clientX: number;
    clientY: number;
} | null;
export declare const addEventListener: (element: HTMLElement, eventNames: ("mousedown" | "touchstart" | "mouseup" | "touchend" | "mousemove" | "touchmove")[], callback: (event: MouseEvent | TouchEvent) => void, options?: boolean | {
    passive?: boolean | undefined;
    capture?: boolean | undefined;
}) => void;
export declare const removeEventListener: (element: HTMLElement, eventNames: ("mousedown" | "touchstart" | "mouseup" | "touchend" | "mousemove" | "touchmove")[], callback: (event: MouseEvent | TouchEvent) => void, options?: boolean | {
    capture?: boolean | undefined;
}) => void;
