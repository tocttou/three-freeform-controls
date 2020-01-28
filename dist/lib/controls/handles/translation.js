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
var cone_1 = __importDefault(require("../../primitives/cone"));
var constants_1 = require("../../utils/constants");
var line_1 = __importDefault(require("../../primitives/line"));
var index_1 = require("./index");
var Translation = /** @class */ (function (_super) {
    __extends(Translation, _super);
    function Translation(color) {
        if (color === void 0) { color = constants_1.DEFAULT_COLOR_ARROW; }
        var _this = _super.call(this) || this;
        _this.parallel = new THREE.Vector3(0, 1, 0);
        /**
         * @hidden
         */
        _this.getInteractiveObjects = function () {
            return [_this.cone];
        };
        _this.setColor = function (color) {
            var coneMaterial = _this.cone.material;
            var lineMaterial = _this.line.material;
            coneMaterial.color.set(color);
            lineMaterial.color.set(color);
        };
        _this.cone = new cone_1.default(color);
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(0, constants_1.DEFAULT_LINE_HEIGHT, 0));
        _this.line = new line_1.default(color, lineGeometry);
        _this.cone.geometry.scale(constants_1.DEFAULT_CONE_RADIUS, constants_1.DEFAULT_CONE_HEIGHT, constants_1.DEFAULT_CONE_RADIUS);
        _this.cone.translateY(constants_1.DEFAULT_LINE_HEIGHT);
        _this.add(_this.cone);
        _this.add(_this.line);
        return _this;
    }
    return Translation;
}(index_1.TranslationGroup));
exports.default = Translation;
//# sourceMappingURL=translation.js.map