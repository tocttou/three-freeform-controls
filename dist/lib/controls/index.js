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
var constants_1 = require("../utils/constants");
var translation_1 = __importDefault(require("./handles/translation"));
var rotation_1 = __importDefault(require("./handles/rotation"));
var pick_1 = __importDefault(require("./handles/pick"));
var pick_plane_1 = __importDefault(require("./handles/pick-plane"));
var handles_1 = require("./handles");
var rotation_eye_1 = __importDefault(require("./handles/rotation-eye"));
var ANCHOR_MODE;
(function (ANCHOR_MODE) {
    /**
     * In this mode the Controls do not inherit the orientation of the object
     * as it is rotated.
     */
    ANCHOR_MODE["FIXED"] = "fixed";
    /**
     * In this mode the Controls rotate as the object is rotated.
     */
    ANCHOR_MODE["INHERIT"] = "inherit";
})(ANCHOR_MODE = exports.ANCHOR_MODE || (exports.ANCHOR_MODE = {}));
/**
 * Controls is the main class in this library.
 * It is a subclass of THREE.Group, so its properties like `position` and
 * `quaternion` can be modified as desired.
 * The `children` are the control handles (like `rotationX`).
 * All translations and rotations are setup with respect to the global coordinate system.
 * @noInheritDoc
 */
var Controls = /** @class */ (function (_super) {
    __extends(Controls, _super);
    /**
     *
     * @param object - the object provided by the user
     * @param camera - the THREE.Camera instance used in the scene
     * @param options
     */
    function Controls(object, camera, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        var _this = _super.call(this) || this;
        _this.object = object;
        _this.camera = camera;
        _this.handleTargetQuaternion = new THREE.Quaternion();
        _this.objectWorldPosition = new THREE.Vector3();
        _this.objectTargetPosition = new THREE.Vector3();
        _this.objectTargetQuaternion = new THREE.Quaternion();
        _this.objectParentWorldPosition = new THREE.Vector3();
        _this.objectParentWorldQuaternion = new THREE.Quaternion();
        _this.objectParentWorldScale = new THREE.Vector3();
        _this.deltaPosition = new THREE.Vector3();
        _this.normalizedHandleParallelVectorCache = new THREE.Vector3();
        _this.touch1 = new THREE.Vector3();
        _this.touch2 = new THREE.Vector3();
        _this.boundingSphereRadius = 0;
        _this.dragStartPoint = new THREE.Vector3();
        _this.dragIncrementalStartPoint = new THREE.Vector3();
        _this.handles = new Set();
        _this.isBeingDraggedTranslation = false;
        _this.isBeingDraggedRotation = false;
        _this.dampingFactor = 0.8;
        _this.initialSelfQuaternion = new THREE.Quaternion();
        _this.minTranslationCache = new THREE.Vector3();
        _this.maxTranslationCache = new THREE.Vector3();
        _this.translationLimit = false;
        _this.translationAnchor = null;
        _this.setupDefaultPickPlane = function () {
            _this.pickPlaneXY.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_XY;
            _this.pickPlaneYZ.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_YZ;
            _this.pickPlaneZX.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_ZX;
            _this.pickPlaneYZ.up = new THREE.Vector3(1, 0, 0);
            _this.pickPlaneZX.up = new THREE.Vector3(0, 1, 0);
            _this.pickPlaneXY.up = new THREE.Vector3(0, 0, 1);
            _this.pickPlaneYZ.rotateY(Math.PI / 2);
            _this.pickPlaneZX.rotateX(Math.PI / 2);
            _this.setupHandle(_this.pickPlaneXY);
            _this.setupHandle(_this.pickPlaneYZ);
            _this.setupHandle(_this.pickPlaneZX);
        };
        _this.setupHandle = function (handle) {
            _this.handles.add(handle);
            _this.add(handle);
        };
        _this.setupDefaultPick = function () {
            _this.pick.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.PICK;
            _this.setupHandle(_this.pick);
        };
        _this.setupDefaultEyeRotation = function () {
            _this.rotationEye.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.ER;
            _this.rotationEye.camera = _this.camera;
            _this.setupHandle(_this.rotationEye);
        };
        _this.setupDefaultTranslation = function () {
            _this.translationXP.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.XPT;
            _this.translationYP.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.YPT;
            _this.translationZP.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.ZPT;
            _this.translationXN.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.XNT;
            _this.translationYN.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.YNT;
            _this.translationZN.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.ZNT;
            _this.translationXP.translateX(_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationYP.translateY(_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationZP.translateZ(_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationXN.translateX(-_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationYN.translateY(-_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationZN.translateZ(-_this.boundingSphereRadius * _this.translationDistanceScale);
            _this.translationXP.rotateZ(-Math.PI / 2);
            _this.translationZP.rotateX(Math.PI / 2);
            _this.translationXN.rotateZ(Math.PI / 2);
            _this.translationYN.rotateX(Math.PI);
            _this.translationZN.rotateX(-Math.PI / 2);
            _this.translationXP.up = new THREE.Vector3(0, 1, 0);
            _this.translationYP.up = new THREE.Vector3(0, 0, 1);
            _this.translationZP.up = new THREE.Vector3(0, 1, 0);
            _this.translationXN.up = new THREE.Vector3(0, -1, 0);
            _this.translationYN.up = new THREE.Vector3(0, 0, -1);
            _this.translationZN.up = new THREE.Vector3(0, -1, 0);
            _this.translationXP.parallel = new THREE.Vector3(1, 0, 0);
            _this.translationYP.parallel = new THREE.Vector3(0, 1, 0);
            _this.translationZP.parallel = new THREE.Vector3(0, 0, 1);
            _this.translationXN.parallel = new THREE.Vector3(-1, 0, 0);
            _this.translationYN.parallel = new THREE.Vector3(0, -1, 0);
            _this.translationZN.parallel = new THREE.Vector3(0, 0, -1);
            _this.setupHandle(_this.translationXP);
            _this.setupHandle(_this.translationYP);
            _this.setupHandle(_this.translationZP);
            _this.setupHandle(_this.translationXN);
            _this.setupHandle(_this.translationYN);
            _this.setupHandle(_this.translationZN);
        };
        _this.setupDefaultRotation = function () {
            _this.rotationX.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.XR;
            _this.rotationY.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.YR;
            _this.rotationZ.name = handles_1.DEFAULT_HANDLE_GROUP_NAME.ZR;
            _this.rotationX.up = new THREE.Vector3(1, 0, 0);
            _this.rotationY.up = new THREE.Vector3(0, 1, 0);
            _this.rotationZ.up = new THREE.Vector3(0, 0, 1);
            _this.rotationY.rotateX(Math.PI / 2);
            _this.rotationX.rotateY(Math.PI / 2);
            _this.rotationX.rotateZ(Math.PI);
            _this.setupHandle(_this.rotationX);
            _this.setupHandle(_this.rotationY);
            _this.setupHandle(_this.rotationZ);
        };
        _this.computeObjectBounds = function () {
            if (_this.useComputedBounds) {
                if (_this.object.type === "Mesh") {
                    var geometry = _this.object.geometry;
                    geometry.computeBoundingSphere();
                    var radius = geometry.boundingSphere.radius;
                    _this.boundingSphereRadius = radius / 2 + _this.separation;
                    return;
                }
                else {
                    console.warn("Bounds can only be computed for object of type THREE.Mesh,\n          received object with type: " + _this.object.type + ". Falling back to using\n          default separation.\n        ");
                }
            }
            _this.boundingSphereRadius = _this.separation;
        };
        /**
         * Puts a limit on the object's translation anchored at the current position.
         *
         * `{ x: [-1, 2], y: false, z: false }` - sets the translation limit to `-1` unit
         * in the -x-direction, `+2` units in the +x-direction, and no limit on the
         * y and z-direction.
         *
         * Setting the limit to `false` disables the limit in all directions.
         * @param limit
         */
        _this.setTranslationLimit = function (limit) {
            _this.translationLimit = limit;
            _this.translationAnchor = limit ? _this.position.clone() : null;
        };
        /**
         * @hidden
         */
        _this.processDragStart = function (args) {
            var point = args.point, handle = args.handle;
            _this.dragStartPoint.copy(point);
            _this.dragIncrementalStartPoint.copy(point);
            _this.isBeingDraggedTranslation =
                handle instanceof handles_1.TranslationGroup ||
                    handle instanceof handles_1.PickGroup ||
                    handle instanceof handles_1.PickPlaneGroup;
            _this.isBeingDraggedRotation = handle instanceof handles_1.RotationGroup;
        };
        /**
         * @hidden
         */
        _this.processDragEnd = function (args) {
            var handle = args.handle;
            var _a = _this.snapTranslation, xSnap = _a.x, ySnap = _a.y, zSnap = _a.z;
            var snap = [xSnap, ySnap, zSnap];
            if (handle instanceof handles_1.TranslationGroup ||
                handle instanceof handles_1.PickPlaneGroup ||
                handle instanceof handles_1.PickGroup) {
                var xyz = _this.object.position.toArray();
                var floor_1 = xyz.map(Math.floor);
                var ceil_1 = xyz.map(Math.ceil);
                var snapFloor_1 = xyz.map(function (p, index) { return ceil_1[index] - p >= p - floor_1[index]; });
                var position = xyz.map(function (p, index) {
                    if (!snap[index]) {
                        return p;
                    }
                    return snapFloor_1[index] ? floor_1[index] : ceil_1[index];
                });
                _this.object.position.fromArray(position);
            }
            _this.isBeingDraggedTranslation = false;
            _this.isBeingDraggedRotation = false;
        };
        /**
         * Only takes effect if [[IControlsOptions.isDampingEnabled]] is true.
         * @param dampingFactor - value between 0 and 1, acts like a weight on the controls
         */
        _this.setDampingFactor = function (dampingFactor) {
            if (dampingFactor === void 0) { dampingFactor = 0; }
            return (_this.dampingFactor = THREE.Math.clamp(dampingFactor, 0, 1));
        };
        /**
         * @hidden
         */
        _this.processDrag = function (args) {
            var point = args.point, handle = args.handle, _a = args.dragRatio, dragRatio = _a === void 0 ? 1 : _a;
            var k = Math.exp(-_this.dampingFactor * Math.abs(Math.pow(dragRatio, 3)));
            if (handle instanceof handles_1.TranslationGroup) {
                _this.deltaPosition.copy(point).sub(_this.dragIncrementalStartPoint);
                _this.normalizedHandleParallelVectorCache
                    .copy(handle.parallel.normalize())
                    .applyQuaternion(_this.quaternion);
                var delta = _this.deltaPosition.dot(_this.normalizedHandleParallelVectorCache);
                _this.deltaPosition
                    .copy(_this.normalizedHandleParallelVectorCache)
                    .multiplyScalar(_this.isDampingEnabled ? k * delta : delta);
                _this.position.copy(_this.getLimitedTranslation(_this.deltaPosition));
            }
            else if (handle instanceof handles_1.PickGroup || handle instanceof handles_1.PickPlaneGroup) {
                _this.deltaPosition
                    .copy(point)
                    .sub(_this.dragIncrementalStartPoint)
                    .multiplyScalar(_this.isDampingEnabled ? k : 1);
                _this.position.copy(_this.getLimitedTranslation(_this.deltaPosition));
            }
            else {
                _this.touch1
                    .copy(_this.dragIncrementalStartPoint)
                    .sub(_this.objectWorldPosition)
                    .normalize();
                _this.touch2
                    .copy(point)
                    .sub(_this.objectWorldPosition)
                    .normalize();
                _this.handleTargetQuaternion.setFromUnitVectors(_this.touch1, _this.touch2);
                if (_this.mode === ANCHOR_MODE.FIXED) {
                    _this.detachHandleUpdateQuaternionAttach(handle, _this.handleTargetQuaternion);
                }
            }
            _this.objectTargetQuaternion.premultiply(_this.handleTargetQuaternion);
            _this.dragIncrementalStartPoint.copy(point);
        };
        _this.getLimitedTranslation = function (translation) {
            var position = translation.add(_this.position);
            if (!_this.translationAnchor || !_this.translationLimit) {
                return position;
            }
            var _a = _this.translationLimit, xLimit = _a.x, yLimit = _a.y, zLimit = _a.z;
            var _b = _this.translationAnchor, xAnchor = _b.x, yAnchor = _b.y, zAnchor = _b.z;
            var x = position.x, y = position.y, z = position.z;
            _this.minTranslationCache.set(xLimit ? xAnchor + xLimit[0] : x, yLimit ? yAnchor + yLimit[0] : y, zLimit ? zAnchor + zLimit[0] : z);
            _this.maxTranslationCache.set(xLimit ? xAnchor + xLimit[1] : x, yLimit ? yAnchor + yLimit[1] : y, zLimit ? zAnchor + zLimit[1] : z);
            return position.clamp(_this.minTranslationCache, _this.maxTranslationCache);
        };
        _this.detachObjectUpdatePositionAttach = function (parent, object) {
            if (parent !== null && _this.parent !== null && _this.parent.parent !== null) {
                var scene = _this.parent.parent;
                if (scene.type !== "Scene") {
                    throw new Error("freeform controls must be attached to the scene");
                }
                scene.attach(object);
                object.position.copy(_this.objectTargetPosition);
                parent.attach(object);
            }
        };
        _this.detachHandleUpdateQuaternionAttach = function (handle, quaternion) {
            if (_this.parent !== null && _this.parent.parent) {
                var scene = _this.parent.parent;
                if (scene.type !== "Scene") {
                    throw new Error("freeform controls must be attached to the scene");
                }
                scene.attach(handle);
                handle.applyQuaternion(quaternion);
                _this.attach(handle);
            }
        };
        /**
         * Applies supplied visibility to the supplied handle names.
         * Individual handle's visibility can also be changed by modifying the `visibility`
         * property on the handle directly.
         * @param handleNames
         * @param visibility
         */
        _this.showByNames = function (handleNames, visibility) {
            if (visibility === void 0) { visibility = true; }
            var handleNamesMap = {};
            _this.handles.forEach(function (handle) {
                handleNamesMap[handle.name] = handle;
            });
            handleNames.map(function (handleName) {
                var handle = handleNamesMap[handleName];
                if (handle === undefined) {
                    throw new Error("handle: " + handleName + " not found");
                }
                handle.visible = visibility;
            });
        };
        /**
         * Applies supplied visibility to all handles
         * @param visibility
         */
        _this.showAll = function (visibility) {
            if (visibility === void 0) { visibility = true; }
            _this.handles.forEach(function (handle) {
                handle.visible = visibility;
            });
        };
        /**
         * @hidden
         */
        _this.updateMatrixWorld = function (force) {
            _this.object.updateMatrixWorld(force);
            _this.object.getWorldPosition(_this.objectWorldPosition);
            var parent = _this.object.parent;
            if (parent !== null) {
                parent.matrixWorld.decompose(_this.objectParentWorldPosition, _this.objectParentWorldQuaternion, _this.objectParentWorldScale);
            }
            _this.objectParentWorldQuaternion.inverse();
            _this.objectTargetPosition.copy(_this.position);
            _this.objectTargetQuaternion.premultiply(_this.objectParentWorldQuaternion);
            if (_this.isBeingDraggedTranslation) {
                _this.detachObjectUpdatePositionAttach(parent, _this.object);
            }
            else if (_this.isBeingDraggedRotation) {
                _this.object.quaternion.copy(_this.objectTargetQuaternion);
                _this.detachObjectUpdatePositionAttach(parent, _this.object);
            }
            else {
                _this.position.copy(_this.objectWorldPosition);
            }
            _this.object.getWorldQuaternion(_this.objectTargetQuaternion);
            if (_this.mode === ANCHOR_MODE.INHERIT && !_this.isBeingDraggedTranslation) {
                _this.quaternion.copy(_this.initialSelfQuaternion).premultiply(_this.objectTargetQuaternion);
            }
            _super.prototype.updateMatrixWorld.call(_this, force);
        };
        _this.options = options || {};
        _this.mode = (_b = (_a = _this.options) === null || _a === void 0 ? void 0 : _a.mode, (_b !== null && _b !== void 0 ? _b : ANCHOR_MODE.FIXED));
        _this.hideOtherHandlesOnDrag = (_d = (_c = _this.options) === null || _c === void 0 ? void 0 : _c.hideOtherHandlesOnDrag, (_d !== null && _d !== void 0 ? _d : true));
        _this.hideOtherControlsInstancesOnDrag = (_f = (_e = _this.options) === null || _e === void 0 ? void 0 : _e.hideOtherControlsInstancesOnDrag, (_f !== null && _f !== void 0 ? _f : true));
        _this.showHelperPlane = (_h = (_g = _this.options) === null || _g === void 0 ? void 0 : _g.showHelperPlane, (_h !== null && _h !== void 0 ? _h : false));
        _this.highlightAxis = (_k = (_j = _this.options) === null || _j === void 0 ? void 0 : _j.highlightAxis, (_k !== null && _k !== void 0 ? _k : true));
        _this.useComputedBounds = (_m = (_l = _this.options) === null || _l === void 0 ? void 0 : _l.useComputedBounds, (_m !== null && _m !== void 0 ? _m : false));
        _this.snapTranslation = (_p = (_o = _this.options) === null || _o === void 0 ? void 0 : _o.snapTranslation, (_p !== null && _p !== void 0 ? _p : {
            x: false,
            y: false,
            z: false
        }));
        _this.separation = (_r = (_q = _this.options) === null || _q === void 0 ? void 0 : _q.separation, (_r !== null && _r !== void 0 ? _r : constants_1.DEFAULT_CONTROLS_SEPARATION));
        _this.isDampingEnabled = (_t = (_s = _this.options) === null || _s === void 0 ? void 0 : _s.isDampingEnabled, (_t !== null && _t !== void 0 ? _t : true));
        _this.rotationRadiusScale = (_v = (_u = _this.options) === null || _u === void 0 ? void 0 : _u.rotationRadiusScale, (_v !== null && _v !== void 0 ? _v : constants_1.DEFAULT_ROTATION_RADIUS_SCALE));
        _this.eyeRotationRadiusScale = (_x = (_w = _this.options) === null || _w === void 0 ? void 0 : _w.eyeRotationRadiusScale, (_x !== null && _x !== void 0 ? _x : constants_1.DEFAULT_EYE_ROTATION_SCALE));
        _this.pickPlaneSizeScale = (_z = (_y = _this.options) === null || _y === void 0 ? void 0 : _y.pickPlaneSizeScale, (_z !== null && _z !== void 0 ? _z : constants_1.DEFAULT_PLANE_SIZE_SCALE));
        _this.translationDistanceScale = (_1 = (_0 = _this.options) === null || _0 === void 0 ? void 0 : _0.translationDistanceScale, (_1 !== null && _1 !== void 0 ? _1 : constants_1.DEFAULT_TRANSLATION_DISTANCE_SCALE));
        if (_this.options.orientation !== undefined) {
            var _2 = _this.options.orientation, x = _2.x, y = _2.y, z = _2.z, w = _2.w;
            _this.initialSelfQuaternion.set(x, y, z, w).normalize();
            _this.quaternion.copy(_this.initialSelfQuaternion);
        }
        _this.computeObjectBounds();
        _this.pick = new pick_1.default();
        _this.pickPlaneXY = new pick_plane_1.default("yellow", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.pickPlaneYZ = new pick_plane_1.default("cyan", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.pickPlaneZX = new pick_plane_1.default("pink", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.translationXP = new translation_1.default("red");
        _this.translationYP = new translation_1.default("green");
        _this.translationZP = new translation_1.default("blue");
        _this.translationXN = new translation_1.default("red");
        _this.translationYN = new translation_1.default("green");
        _this.translationZN = new translation_1.default("blue");
        _this.rotationX = new rotation_1.default("red", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationY = new rotation_1.default("green", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationZ = new rotation_1.default("blue", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationEye = new rotation_eye_1.default("yellow", _this.boundingSphereRadius * _this.eyeRotationRadiusScale);
        _this.setupDefaultTranslation();
        _this.setupDefaultRotation();
        _this.setupDefaultEyeRotation();
        _this.setupDefaultPickPlane();
        _this.setupDefaultPick();
        return _this;
    }
    /**
     * @hidden
     */
    Controls.prototype.getInteractiveObjects = function () {
        var interactiveObjects = [];
        this.handles.forEach(function (handle) {
            if (!handle.visible) {
                return;
            }
            interactiveObjects.push.apply(interactiveObjects, handle.getInteractiveObjects());
        });
        return interactiveObjects;
    };
    return Controls;
}(THREE.Group));
exports.default = Controls;
//# sourceMappingURL=index.js.map