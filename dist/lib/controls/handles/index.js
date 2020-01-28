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
/**
 * Names for default handles
 */
var DEFAULT_HANDLE_GROUP_NAME;
(function (DEFAULT_HANDLE_GROUP_NAME) {
    /**
     * name for default translation handle along the +ve x-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["XPT"] = "xpt_handle";
    /**
     * name for default translation handle along the +ve y-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["YPT"] = "ypt_handle";
    /**
     * name for default translation handle along the +ve z-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["ZPT"] = "zpt_handle";
    /**
     * name for default translation handle along the -ve x-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["XNT"] = "xnt_handle";
    /**
     * name for default translation handle along the -ve y-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["YNT"] = "ynt_handle";
    /**
     * name for default translation handle along the -ve z-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["ZNT"] = "znt_handle";
    /**
     * name for default rotation handle along the x-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["XR"] = "xr_handle";
    /**
     * name for default rotation handle along the y-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["YR"] = "yr_handle";
    /**
     * name for default rotation handle along the z-axis
     */
    DEFAULT_HANDLE_GROUP_NAME["ZR"] = "zr_handle";
    /**
     * name for default rotation handle in the eye-plane
     */
    DEFAULT_HANDLE_GROUP_NAME["ER"] = "er_handle";
    /**
     * name for default translation handle in the eye-plane
     */
    DEFAULT_HANDLE_GROUP_NAME["PICK"] = "pick_handle";
    /**
     * name for default translation handle in the xy plane
     */
    DEFAULT_HANDLE_GROUP_NAME["PICK_PLANE_XY"] = "pick_plane_xy_handle";
    /**
     * name for default translation handle in the yz plane
     */
    DEFAULT_HANDLE_GROUP_NAME["PICK_PLANE_YZ"] = "pick_plane_yz_handle";
    /**
     * name for default translation handle in the zx plane
     */
    DEFAULT_HANDLE_GROUP_NAME["PICK_PLANE_ZX"] = "pick_plane_zx_handle";
})(DEFAULT_HANDLE_GROUP_NAME = exports.DEFAULT_HANDLE_GROUP_NAME || (exports.DEFAULT_HANDLE_GROUP_NAME = {}));
/**
 * Base class for all handles
 * @noInheritDoc
 */
var HandleGroup = /** @class */ (function (_super) {
    __extends(HandleGroup, _super);
    function HandleGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HandleGroup;
}(THREE.Group));
exports.HandleGroup = HandleGroup;
/**
 * This class can be extended to create custom translation handles.
 * It requires setting the properties `parallel` and `up`.
 */
var TranslationGroup = /** @class */ (function (_super) {
    __extends(TranslationGroup, _super);
    function TranslationGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * This is a unit vector that runs perpendicular to the direction of the translation handles.
         * For example, in case of [[Controls.translationXP]], it is
         * `THREE.Vector3(0,1,0)` (along the y-axis).
         */
        _this.up = new THREE.Vector3();
        return _this;
    }
    return TranslationGroup;
}(HandleGroup));
exports.TranslationGroup = TranslationGroup;
/**
 * This class can be extended to create custom rotation handles.
 * It requires setting the property `up`.
 */
var RotationGroup = /** @class */ (function (_super) {
    __extends(RotationGroup, _super);
    function RotationGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * This is a unit vector that runs along the axis of the rotation handles.
         * For example, in case of [[Controls.rotationX]], it is
         * `THREE.Vector3(1,0,0)` (along the x-axis).
         */
        _this.up = new THREE.Vector3();
        return _this;
    }
    return RotationGroup;
}(HandleGroup));
exports.RotationGroup = RotationGroup;
/**
 * This class can be extended to create custom pick handle (translates in eye-plane).
 */
var PickGroup = /** @class */ (function (_super) {
    __extends(PickGroup, _super);
    function PickGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PickGroup;
}(HandleGroup));
exports.PickGroup = PickGroup;
/**
 * This class can be extended to create custom pick plane handles.
 * It requires setting the property `up`.
 */
var PickPlaneGroup = /** @class */ (function (_super) {
    __extends(PickPlaneGroup, _super);
    function PickPlaneGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * This is a unit vector that is perpendicular to the plane handles.
         * For example, in case of [[Controls.pickPlaneXY]], it is
         * `THREE.Vector3(0,0,1)` (along the z-axis).
         */
        _this.up = new THREE.Vector3();
        return _this;
    }
    return PickPlaneGroup;
}(HandleGroup));
exports.PickPlaneGroup = PickPlaneGroup;
//# sourceMappingURL=index.js.map