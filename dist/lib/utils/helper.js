"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPointFromEvent = function (event) {
    var clientX = 0;
    var clientY = 0;
    if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    else if (event instanceof TouchEvent) {
        if (event.touches.length === 0) {
            return null;
        }
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }
    return { clientX: clientX, clientY: clientY };
};
exports.addEventListener = function (element, eventNames, callback, options) {
    if (options === void 0) { options = false; }
    eventNames.forEach(function (name) {
        element.addEventListener(name, callback, options);
    });
};
exports.removeEventListener = function (element, eventNames, callback, options) {
    if (options === void 0) { options = false; }
    eventNames.forEach(function (name) {
        element.removeEventListener(name, callback, options);
    });
};
//# sourceMappingURL=helper.js.map