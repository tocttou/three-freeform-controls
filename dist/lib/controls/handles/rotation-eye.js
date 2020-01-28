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
var rotation_1 = __importDefault(require("./rotation"));
var constants_1 = require("../../utils/constants");
/**
 * @hidden
 */
var RotationEye = /** @class */ (function (_super) {
    __extends(RotationEye, _super);
    function RotationEye(color, radius) {
        if (color === void 0) { color = constants_1.DEFAULT_COLOR_RING; }
        if (radius === void 0) { radius = constants_1.DEFAULT_RING_RADIUS; }
        var _this = _super.call(this, color, radius) || this;
        _this.camera = null;
        _this.controlsWorldOrientation = new THREE.Quaternion();
        _this._temp1 = new THREE.Vector3();
        _this._temp2 = new THREE.Vector3();
        _this._temp3 = new THREE.Quaternion();
        _this.worldPosition = new THREE.Vector3();
        return _this;
    }
    RotationEye.prototype.updateMatrixWorld = function (force) {
        var _a;
        if (this.camera !== null) {
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.matrixWorld.decompose(this._temp1, this.controlsWorldOrientation, this._temp2);
            this.matrixWorld.decompose(this.worldPosition, this._temp3, this._temp2);
            this.camera
                .getWorldQuaternion(this.quaternion)
                .premultiply(this.controlsWorldOrientation.inverse());
            this.camera.getWorldPosition(this.up).sub(this.worldPosition);
        }
        _super.prototype.updateMatrixWorld.call(this, force);
    };
    return RotationEye;
}(rotation_1.default));
exports.default = RotationEye;
//# sourceMappingURL=rotation-eye.js.map