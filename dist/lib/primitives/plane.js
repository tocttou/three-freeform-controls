"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var constants_1 = require("../utils/constants");
var Plane = /** @class */ (function (_super) {
    __extends(Plane, _super);
    function Plane(color, width, height) {
        if (color === void 0) { color = constants_1.DEFAULT_COLOR_RING; }
        if (width === void 0) { width = constants_1.DEFAULT_PLANE_WIDTH; }
        if (height === void 0) { height = constants_1.DEFAULT_PLANE_HEIGHT; }
        var _this = _super.call(this) || this;
        _this.geometry = new THREE.PlaneGeometry(width, height, constants_1.DEFAULT_PLANE_SEGMENTS);
        _this.material = new THREE.MeshBasicMaterial({
            color: color,
            depthTest: false,
            side: THREE.DoubleSide,
            transparent: true
        });
        _this.material.opacity = constants_1.PICK_PLANE_OPACITY.INACTIVE;
        return _this;
    }
    return Plane;
}(THREE.Mesh));
exports.default = Plane;
//# sourceMappingURL=plane.js.map