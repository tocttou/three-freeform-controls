export declare const getPointFromEvent: (event: MouseEvent | TouchEvent) => {
    clientX: number;
    clientY: number;
} | null;
export declare const addEventListener: (element: HTMLElement, eventNames: Array<"pointerdown" | "touchstart" | "pointerup" | "touchend" | "pointermove" | "touchmove">, callback: (event: MouseEvent | TouchEvent) => void, options?: {
    passive?: boolean;
    capture?: boolean;
} | boolean) => void;
export declare const removeEventListener: (element: HTMLElement, eventNames: Array<"pointerdown" | "touchstart" | "pointerup" | "touchend" | "pointermove" | "touchmove">, callback: (event: MouseEvent | TouchEvent) => void, options?: {
    capture?: boolean;
} | boolean) => void;
