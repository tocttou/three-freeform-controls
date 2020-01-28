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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var constants_1 = require("../../utils/constants");
var line_1 = __importDefault(require("../../primitives/line"));
var octahedron_1 = __importDefault(require("../../primitives/octahedron"));
var index_1 = require("./index");
var Rotation = /** @class */ (function (_super) {
    __extends(Rotation, _super);
    function Rotation(color, ringRadius) {
        if (color === void 0) { color = constants_1.DEFAULT_COLOR_RING; }
        if (ringRadius === void 0) { ringRadius = constants_1.DEFAULT_RING_RADIUS; }
        var _this = _super.call(this) || this;
        /**
         * @hidden
         */
        _this.getInteractiveObjects = function () {
            return [_this.handlebar];
        };
        _this.setColor = function (color) {
            var ringMaterial = _this.ring.material;
            var handlebarMaterial = _this.handlebar.material;
            ringMaterial.color.set(color);
            handlebarMaterial.color.set(color);
        };
        var ringNumberOfPoints = constants_1.DEFAULT_RING_NUM_POINTS;
        var ringGeometry = new THREE.Geometry();
        var angle = (2 * Math.PI) / ringNumberOfPoints;
        for (var i = 1; i < ringNumberOfPoints + 1; i++) {
            ringGeometry.vertices.push(new THREE.Vector3(ringRadius * Math.cos(i * angle), ringRadius * Math.sin(i * angle), 0));
        }
        _this.ring = new line_1.default(color, ringGeometry);
        _this.handlebar = new octahedron_1.default(color);
        _this.handlebar.position.y = ringRadius;
        _this.add(_this.ring);
        _this.add(_this.handlebar);
        return _this;
    }
    return Rotation;
}(index_1.RotationGroup));
exports.default = Rotation;
//# sourceMappingURL=rotation.js.map