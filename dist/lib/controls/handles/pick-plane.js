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
var plane_1 = __importDefault(require("../../primitives/plane"));
var constants_1 = require("../../utils/constants");
var line_1 = __importDefault(require("../../primitives/line"));
var index_1 = require("./index");
var PickPlane = /** @class */ (function (_super) {
    __extends(PickPlane, _super);
    function PickPlane(color, width, height) {
        if (color === void 0) { color = constants_1.DEFAULT_COLOR_PLANE; }
        if (width === void 0) { width = constants_1.DEFAULT_PLANE_WIDTH; }
        if (height === void 0) { height = constants_1.DEFAULT_PLANE_HEIGHT; }
        var _this = _super.call(this) || this;
        /**
         * @hidden
         */
        _this.getInteractiveObjects = function () {
            return [_this.plane];
        };
        _this.setColor = function (color) {
            var planeMaterial = _this.plane.material;
            var boundaryMaterial = _this.boundary.material;
            planeMaterial.color.set(color);
            boundaryMaterial.color.set(color);
        };
        var boundaryGeometry = new THREE.Geometry();
        var crossXGeometry = new THREE.Geometry();
        var crossYGeometry = new THREE.Geometry();
        var vertexMaxX = width / 2;
        var vertexMaxY = height / 2;
        boundaryGeometry.vertices.push(new THREE.Vector3(vertexMaxX, vertexMaxY, 0));
        boundaryGeometry.vertices.push(new THREE.Vector3(vertexMaxX, -vertexMaxY, 0));
        boundaryGeometry.vertices.push(new THREE.Vector3(-vertexMaxX, -vertexMaxY, 0));
        boundaryGeometry.vertices.push(new THREE.Vector3(-vertexMaxX, vertexMaxY, 0));
        crossXGeometry.vertices.push(new THREE.Vector3(0, vertexMaxY, 0));
        crossXGeometry.vertices.push(new THREE.Vector3(0, -vertexMaxY, 0));
        crossYGeometry.vertices.push(new THREE.Vector3(-vertexMaxX, 0, 0));
        crossYGeometry.vertices.push(new THREE.Vector3(vertexMaxX, 0, 0));
        _this.boundary = new line_1.default(color, boundaryGeometry);
        _this.crossX = new line_1.default("black", crossXGeometry);
        _this.crossY = new line_1.default("black", crossYGeometry);
        _this.plane = new plane_1.default(color, width, height);
        _this.add(_this.plane);
        _this.add(_this.boundary);
        _this.add(_this.crossX);
        _this.add(_this.crossY);
        return _this;
    }
    return PickPlane;
}(index_1.PickPlaneGroup));
exports.default = PickPlane;
//# sourceMappingURL=pick-plane.js.map