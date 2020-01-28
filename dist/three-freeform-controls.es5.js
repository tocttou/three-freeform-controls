import { ConeGeometry, MeshBasicMaterial, Mesh, LineLoop, Group, Vector3, Geometry, OctahedronBufferGeometry, DoubleSide, PlaneGeometry, Quaternion, Math as Math$1, Vector2, Plane as Plane$1, PlaneHelper, Raycaster as Raycaster$1, Object3D } from 'three';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var DEFAULT_LINE_HEIGHT = 1;
var DEFAULT_RADIAL_SEGMENTS = 32;
var DEFAULT_CONE_HEIGHT = 0.75;
var DEFAULT_CONE_RADIUS = 0.3;
var DEFAULT_OCTAHEDRON_RADIUS = 0.1;
var DEFAULT_PLANE_WIDTH = 0.75;
var DEFAULT_PLANE_HEIGHT = 0.75;
var DEFAULT_PLANE_SEGMENTS = 32;
var DEFAULT_RING_NUM_POINTS = 64;
var DEFAULT_RING_RADIUS = 1;
var PICK_PLANE_OPACITY;
(function (PICK_PLANE_OPACITY) {
    PICK_PLANE_OPACITY[PICK_PLANE_OPACITY["ACTIVE"] = 0.75] = "ACTIVE";
    PICK_PLANE_OPACITY[PICK_PLANE_OPACITY["INACTIVE"] = 0.3] = "INACTIVE";
})(PICK_PLANE_OPACITY || (PICK_PLANE_OPACITY = {}));
var DEFAULT_CONTROLS_SEPARATION = 1;
var DEFAULT_ROTATION_RADIUS_SCALE = 1;
var DEFAULT_EYE_ROTATION_SCALE = 1.25;
var DEFAULT_PLANE_SIZE_SCALE = 0.75;
var DEFAULT_TRANSLATION_DISTANCE_SCALE = 1;
var DEFAULT_COLOR_ARROW = "#f0ff00";
var DEFAULT_COLOR_RING = "#f0ff00";
var DEFAULT_COLOR_PLANE = "#f0ff00";
var DEFAULT_CONTROLS_OPACITY = 1;

var Cone = /** @class */ (function (_super) {
    __extends(Cone, _super);
    function Cone(color) {
        var _this = _super.call(this) || this;
        _this.geometry = new ConeGeometry(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT, DEFAULT_RADIAL_SEGMENTS);
        _this.material = new MeshBasicMaterial({ color: color, depthTest: false });
        _this.material.transparent = true;
        _this.material.opacity = DEFAULT_CONTROLS_OPACITY;
        return _this;
    }
    return Cone;
}(Mesh));

var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(color, geometry) {
        var _this = _super.call(this) || this;
        _this.geometry = geometry;
        _this.material = new MeshBasicMaterial({ color: color, depthTest: true });
        _this.material.transparent = true;
        _this.material.opacity = DEFAULT_CONTROLS_OPACITY;
        return _this;
    }
    return Line;
}(LineLoop));

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
})(DEFAULT_HANDLE_GROUP_NAME || (DEFAULT_HANDLE_GROUP_NAME = {}));
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
}(Group));
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
        _this.up = new Vector3();
        return _this;
    }
    return TranslationGroup;
}(HandleGroup));
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
        _this.up = new Vector3();
        return _this;
    }
    return RotationGroup;
}(HandleGroup));
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
        _this.up = new Vector3();
        return _this;
    }
    return PickPlaneGroup;
}(HandleGroup));

var Translation = /** @class */ (function (_super) {
    __extends(Translation, _super);
    function Translation(color) {
        if (color === void 0) { color = DEFAULT_COLOR_ARROW; }
        var _this = _super.call(this) || this;
        _this.parallel = new Vector3(0, 1, 0);
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
        _this.cone = new Cone(color);
        var lineGeometry = new Geometry();
        lineGeometry.vertices.push(new Vector3(0, 0, 0));
        lineGeometry.vertices.push(new Vector3(0, DEFAULT_LINE_HEIGHT, 0));
        _this.line = new Line(color, lineGeometry);
        _this.cone.geometry.scale(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT, DEFAULT_CONE_RADIUS);
        _this.cone.translateY(DEFAULT_LINE_HEIGHT);
        _this.add(_this.cone);
        _this.add(_this.line);
        return _this;
    }
    return Translation;
}(TranslationGroup));

var Octahedron = /** @class */ (function (_super) {
    __extends(Octahedron, _super);
    function Octahedron(color) {
        var _this = _super.call(this) || this;
        _this.geometry = new OctahedronBufferGeometry(DEFAULT_OCTAHEDRON_RADIUS, 0);
        _this.material = new MeshBasicMaterial({
            color: color,
            depthTest: false,
            transparent: true,
            side: DoubleSide
        });
        return _this;
    }
    return Octahedron;
}(Mesh));

var Rotation = /** @class */ (function (_super) {
    __extends(Rotation, _super);
    function Rotation(color, ringRadius) {
        if (color === void 0) { color = DEFAULT_COLOR_RING; }
        if (ringRadius === void 0) { ringRadius = DEFAULT_RING_RADIUS; }
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
        var ringNumberOfPoints = DEFAULT_RING_NUM_POINTS;
        var ringGeometry = new Geometry();
        var angle = (2 * Math.PI) / ringNumberOfPoints;
        for (var i = 1; i < ringNumberOfPoints + 1; i++) {
            ringGeometry.vertices.push(new Vector3(ringRadius * Math.cos(i * angle), ringRadius * Math.sin(i * angle), 0));
        }
        _this.ring = new Line(color, ringGeometry);
        _this.handlebar = new Octahedron(color);
        _this.handlebar.position.y = ringRadius;
        _this.add(_this.ring);
        _this.add(_this.handlebar);
        return _this;
    }
    return Rotation;
}(RotationGroup));

var Pick = /** @class */ (function (_super) {
    __extends(Pick, _super);
    function Pick() {
        var _this = _super.call(this) || this;
        /**
         * @hidden
         */
        _this.getInteractiveObjects = function () {
            return [_this.octahedron];
        };
        _this.setColor = function (color) {
            var octahedronMaterial = _this.octahedron.material;
            octahedronMaterial.color.set(color);
        };
        _this.octahedron = new Octahedron("white");
        _this.add(_this.octahedron);
        return _this;
    }
    return Pick;
}(PickGroup));

var Plane = /** @class */ (function (_super) {
    __extends(Plane, _super);
    function Plane(color, width, height) {
        if (color === void 0) { color = DEFAULT_COLOR_RING; }
        if (width === void 0) { width = DEFAULT_PLANE_WIDTH; }
        if (height === void 0) { height = DEFAULT_PLANE_HEIGHT; }
        var _this = _super.call(this) || this;
        _this.geometry = new PlaneGeometry(width, height, DEFAULT_PLANE_SEGMENTS);
        _this.material = new MeshBasicMaterial({
            color: color,
            depthTest: false,
            side: DoubleSide,
            transparent: true
        });
        _this.material.opacity = PICK_PLANE_OPACITY.INACTIVE;
        return _this;
    }
    return Plane;
}(Mesh));

var PickPlane = /** @class */ (function (_super) {
    __extends(PickPlane, _super);
    function PickPlane(color, width, height) {
        if (color === void 0) { color = DEFAULT_COLOR_PLANE; }
        if (width === void 0) { width = DEFAULT_PLANE_WIDTH; }
        if (height === void 0) { height = DEFAULT_PLANE_HEIGHT; }
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
        var boundaryGeometry = new Geometry();
        var crossXGeometry = new Geometry();
        var crossYGeometry = new Geometry();
        var vertexMaxX = width / 2;
        var vertexMaxY = height / 2;
        boundaryGeometry.vertices.push(new Vector3(vertexMaxX, vertexMaxY, 0));
        boundaryGeometry.vertices.push(new Vector3(vertexMaxX, -vertexMaxY, 0));
        boundaryGeometry.vertices.push(new Vector3(-vertexMaxX, -vertexMaxY, 0));
        boundaryGeometry.vertices.push(new Vector3(-vertexMaxX, vertexMaxY, 0));
        crossXGeometry.vertices.push(new Vector3(0, vertexMaxY, 0));
        crossXGeometry.vertices.push(new Vector3(0, -vertexMaxY, 0));
        crossYGeometry.vertices.push(new Vector3(-vertexMaxX, 0, 0));
        crossYGeometry.vertices.push(new Vector3(vertexMaxX, 0, 0));
        _this.boundary = new Line(color, boundaryGeometry);
        _this.crossX = new Line("black", crossXGeometry);
        _this.crossY = new Line("black", crossYGeometry);
        _this.plane = new Plane(color, width, height);
        _this.add(_this.plane);
        _this.add(_this.boundary);
        _this.add(_this.crossX);
        _this.add(_this.crossY);
        return _this;
    }
    return PickPlane;
}(PickPlaneGroup));

/**
 * @hidden
 */
var RotationEye = /** @class */ (function (_super) {
    __extends(RotationEye, _super);
    function RotationEye(color, radius) {
        if (color === void 0) { color = DEFAULT_COLOR_RING; }
        if (radius === void 0) { radius = DEFAULT_RING_RADIUS; }
        var _this = _super.call(this, color, radius) || this;
        _this.camera = null;
        _this.controlsWorldOrientation = new Quaternion();
        _this._temp1 = new Vector3();
        _this._temp2 = new Vector3();
        _this._temp3 = new Quaternion();
        _this.worldPosition = new Vector3();
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
}(Rotation));

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
})(ANCHOR_MODE || (ANCHOR_MODE = {}));
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
        _this.handleTargetQuaternion = new Quaternion();
        _this.objectWorldPosition = new Vector3();
        _this.objectTargetPosition = new Vector3();
        _this.objectTargetQuaternion = new Quaternion();
        _this.objectParentWorldPosition = new Vector3();
        _this.objectParentWorldQuaternion = new Quaternion();
        _this.objectParentWorldScale = new Vector3();
        _this.deltaPosition = new Vector3();
        _this.normalizedHandleParallelVectorCache = new Vector3();
        _this.touch1 = new Vector3();
        _this.touch2 = new Vector3();
        _this.boundingSphereRadius = 0;
        _this.dragStartPoint = new Vector3();
        _this.dragIncrementalStartPoint = new Vector3();
        _this.handles = new Set();
        _this.isBeingDraggedTranslation = false;
        _this.isBeingDraggedRotation = false;
        _this.dampingFactor = 0.8;
        _this.initialSelfQuaternion = new Quaternion();
        _this.minTranslationCache = new Vector3();
        _this.maxTranslationCache = new Vector3();
        _this.translationLimit = false;
        _this.translationAnchor = null;
        _this.setupDefaultPickPlane = function () {
            _this.pickPlaneXY.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_XY;
            _this.pickPlaneYZ.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_YZ;
            _this.pickPlaneZX.name = DEFAULT_HANDLE_GROUP_NAME.PICK_PLANE_ZX;
            _this.pickPlaneYZ.up = new Vector3(1, 0, 0);
            _this.pickPlaneZX.up = new Vector3(0, 1, 0);
            _this.pickPlaneXY.up = new Vector3(0, 0, 1);
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
            _this.pick.name = DEFAULT_HANDLE_GROUP_NAME.PICK;
            _this.setupHandle(_this.pick);
        };
        _this.setupDefaultEyeRotation = function () {
            _this.rotationEye.name = DEFAULT_HANDLE_GROUP_NAME.ER;
            _this.rotationEye.camera = _this.camera;
            _this.setupHandle(_this.rotationEye);
        };
        _this.setupDefaultTranslation = function () {
            _this.translationXP.name = DEFAULT_HANDLE_GROUP_NAME.XPT;
            _this.translationYP.name = DEFAULT_HANDLE_GROUP_NAME.YPT;
            _this.translationZP.name = DEFAULT_HANDLE_GROUP_NAME.ZPT;
            _this.translationXN.name = DEFAULT_HANDLE_GROUP_NAME.XNT;
            _this.translationYN.name = DEFAULT_HANDLE_GROUP_NAME.YNT;
            _this.translationZN.name = DEFAULT_HANDLE_GROUP_NAME.ZNT;
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
            _this.translationXP.up = new Vector3(0, 1, 0);
            _this.translationYP.up = new Vector3(0, 0, 1);
            _this.translationZP.up = new Vector3(0, 1, 0);
            _this.translationXN.up = new Vector3(0, -1, 0);
            _this.translationYN.up = new Vector3(0, 0, -1);
            _this.translationZN.up = new Vector3(0, -1, 0);
            _this.translationXP.parallel = new Vector3(1, 0, 0);
            _this.translationYP.parallel = new Vector3(0, 1, 0);
            _this.translationZP.parallel = new Vector3(0, 0, 1);
            _this.translationXN.parallel = new Vector3(-1, 0, 0);
            _this.translationYN.parallel = new Vector3(0, -1, 0);
            _this.translationZN.parallel = new Vector3(0, 0, -1);
            _this.setupHandle(_this.translationXP);
            _this.setupHandle(_this.translationYP);
            _this.setupHandle(_this.translationZP);
            _this.setupHandle(_this.translationXN);
            _this.setupHandle(_this.translationYN);
            _this.setupHandle(_this.translationZN);
        };
        _this.setupDefaultRotation = function () {
            _this.rotationX.name = DEFAULT_HANDLE_GROUP_NAME.XR;
            _this.rotationY.name = DEFAULT_HANDLE_GROUP_NAME.YR;
            _this.rotationZ.name = DEFAULT_HANDLE_GROUP_NAME.ZR;
            _this.rotationX.up = new Vector3(1, 0, 0);
            _this.rotationY.up = new Vector3(0, 1, 0);
            _this.rotationZ.up = new Vector3(0, 0, 1);
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
                handle instanceof TranslationGroup ||
                    handle instanceof PickGroup ||
                    handle instanceof PickPlaneGroup;
            _this.isBeingDraggedRotation = handle instanceof RotationGroup;
        };
        /**
         * @hidden
         */
        _this.processDragEnd = function (args) {
            var handle = args.handle;
            var _a = _this.snapTranslation, xSnap = _a.x, ySnap = _a.y, zSnap = _a.z;
            var snap = [xSnap, ySnap, zSnap];
            if (handle instanceof TranslationGroup ||
                handle instanceof PickPlaneGroup ||
                handle instanceof PickGroup) {
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
            return (_this.dampingFactor = Math$1.clamp(dampingFactor, 0, 1));
        };
        /**
         * @hidden
         */
        _this.processDrag = function (args) {
            var point = args.point, handle = args.handle, _a = args.dragRatio, dragRatio = _a === void 0 ? 1 : _a;
            var k = Math.exp(-_this.dampingFactor * Math.abs(Math.pow(dragRatio, 3)));
            if (handle instanceof TranslationGroup) {
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
            else if (handle instanceof PickGroup || handle instanceof PickPlaneGroup) {
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
        _this.separation = (_r = (_q = _this.options) === null || _q === void 0 ? void 0 : _q.separation, (_r !== null && _r !== void 0 ? _r : DEFAULT_CONTROLS_SEPARATION));
        _this.isDampingEnabled = (_t = (_s = _this.options) === null || _s === void 0 ? void 0 : _s.isDampingEnabled, (_t !== null && _t !== void 0 ? _t : true));
        _this.rotationRadiusScale = (_v = (_u = _this.options) === null || _u === void 0 ? void 0 : _u.rotationRadiusScale, (_v !== null && _v !== void 0 ? _v : DEFAULT_ROTATION_RADIUS_SCALE));
        _this.eyeRotationRadiusScale = (_x = (_w = _this.options) === null || _w === void 0 ? void 0 : _w.eyeRotationRadiusScale, (_x !== null && _x !== void 0 ? _x : DEFAULT_EYE_ROTATION_SCALE));
        _this.pickPlaneSizeScale = (_z = (_y = _this.options) === null || _y === void 0 ? void 0 : _y.pickPlaneSizeScale, (_z !== null && _z !== void 0 ? _z : DEFAULT_PLANE_SIZE_SCALE));
        _this.translationDistanceScale = (_1 = (_0 = _this.options) === null || _0 === void 0 ? void 0 : _0.translationDistanceScale, (_1 !== null && _1 !== void 0 ? _1 : DEFAULT_TRANSLATION_DISTANCE_SCALE));
        if (_this.options.orientation !== undefined) {
            var _2 = _this.options.orientation, x = _2.x, y = _2.y, z = _2.z, w = _2.w;
            _this.initialSelfQuaternion.set(x, y, z, w).normalize();
            _this.quaternion.copy(_this.initialSelfQuaternion);
        }
        _this.computeObjectBounds();
        _this.pick = new Pick();
        _this.pickPlaneXY = new PickPlane("yellow", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.pickPlaneYZ = new PickPlane("cyan", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.pickPlaneZX = new PickPlane("pink", _this.boundingSphereRadius * _this.pickPlaneSizeScale, _this.boundingSphereRadius * _this.pickPlaneSizeScale);
        _this.translationXP = new Translation("red");
        _this.translationYP = new Translation("green");
        _this.translationZP = new Translation("blue");
        _this.translationXN = new Translation("red");
        _this.translationYN = new Translation("green");
        _this.translationZN = new Translation("blue");
        _this.rotationX = new Rotation("red", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationY = new Rotation("green", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationZ = new Rotation("blue", _this.boundingSphereRadius * _this.rotationRadiusScale);
        _this.rotationEye = new RotationEye("yellow", _this.boundingSphereRadius * _this.eyeRotationRadiusScale);
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
}(Group));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var nanoevents = createCommonjsModule(function (module) {
(
  /**
   * Interface for event subscription.
   *
   * @example
   * var NanoEvents = require('nanoevents')
   *
   * class Ticker {
   *   constructor() {
   *     this.emitter = new NanoEvents()
   *   }
   *   on() {
   *     return this.emitter.on.apply(this.events, arguments)
   *   }
   *   tick() {
   *     this.emitter.emit('tick')
   *   }
   * }
   *
   * @alias NanoEvents
   * @class
   */
  module.exports = function NanoEvents () {
    /**
     * Event names in keys and arrays with listeners in values.
     * @type {object}
     *
     * @example
     * Object.keys(ee.events)
     *
     * @alias NanoEvents#events
     */
    this.events = { };
  }
).prototype = {

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @return {undefined}
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   *
   * @alias NanoEvents#emit
   * @method
   */
  emit: function emit (event) {
    var args = [].slice.call(arguments, 1)
    // Array.prototype.call() returns empty array if context is not array-like
    ;[].slice.call(this.events[event] || []).filter(function (i) {
      i.apply(null, args);
    });
  },

  /**
   * Add a listener for a given event.
   *
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event.
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   *
   * @alias NanoEvents#on
   * @method
   */
  on: function on (event, cb) {

    (this.events[event] = this.events[event] || []).push(cb);

    return function () {
      this.events[event] = this.events[event].filter(function (i) {
        return i !== cb
      });
    }.bind(this)
  }
};
});

/**
 * Removes all listeners.
 *
 * @param {NanoEvents} emitter NanoEvents instance.
 *
 * @returns {undefined}
 *
 * @example
 * unbindAll(emitter)
 */
function unbindAll (emitter) {
  emitter.events = { };
}

var unbindAll_1 = unbindAll;

var emitter = new nanoevents();
var unbindAll$1 = function () { return unbindAll_1(emitter); };

var getPointFromEvent = function (event) {
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
var addEventListener = function (element, eventNames, callback, options) {
    if (options === void 0) { options = false; }
    eventNames.forEach(function (name) {
        element.addEventListener(name, callback, options);
    });
};
var removeEventListener = function (element, eventNames, callback, options) {
    if (options === void 0) { options = false; }
    eventNames.forEach(function (name) {
        element.removeEventListener(name, callback, options);
    });
};

var EVENTS;
(function (EVENTS) {
    EVENTS["DRAG_START"] = "DRAG_START";
    EVENTS["DRAG"] = "DRAG";
    EVENTS["DRAG_STOP"] = "DRAG_STOP";
})(EVENTS || (EVENTS = {}));
/**
 * @hidden
 * The Raycaster listens on the mouse and touch events globally and
 * dispatches DRAG_START, DRAG, and DRAG_STOP events.
 */
var Raycaster = /** @class */ (function (_super) {
    __extends(Raycaster, _super);
    function Raycaster(camera, domElement, controls) {
        var _this = _super.call(this) || this;
        _this.camera = camera;
        _this.domElement = domElement;
        _this.controls = controls;
        _this.mouse = new Vector2();
        _this.cameraPosition = new Vector3();
        _this.activeHandle = null;
        _this.activePlane = null;
        _this.point = new Vector3();
        _this.normal = new Vector3();
        _this.visibleHandles = [];
        _this.visibleControls = [];
        _this.helperPlane = null;
        _this.controlsWorldQuaternion = new Quaternion();
        _this.clientDiagonalLength = 1;
        _this.previousScreenPoint = new Vector2();
        _this.currentScreenPoint = new Vector2();
        _this.isActivePlaneFlipped = false;
        _this.createAxisLine = function () {
            var geometry = new Geometry();
            geometry.vertices.push(new Vector3(0, 0, -100));
            geometry.vertices.push(new Vector3(0, 0, 100));
            return new Line("white", geometry);
        };
        _this.pointerDownListener = function (event) {
            var _a;
            var point = getPointFromEvent(event);
            // touches can be empty
            if (!point) {
                return;
            }
            var clientX = point.clientX, clientY = point.clientY;
            _this.setRayDirection(clientX, clientY);
            // useful for calculating dragRatio (used in dampingFactor calculation)
            _this.clientDiagonalLength = Math.sqrt(Math.pow(event.target.clientWidth, 2) +
                Math.pow(event.target.clientHeight, 2));
            _this.previousScreenPoint.set(clientX, clientY);
            var interactiveObjects = [];
            Object.values(_this.controls).map(function (controls) {
                interactiveObjects.push.apply(interactiveObjects, controls.getInteractiveObjects());
            });
            _this.activeHandle = _this.resolveHandleGroup(_this.intersectObjects(interactiveObjects, true)[0]);
            if ((_a = _this.activeHandle) === null || _a === void 0 ? void 0 : _a.parent) {
                var controls = _this.activeHandle.parent;
                // hiding other controls and handles instances if asked
                if (controls.hideOtherControlsInstancesOnDrag) {
                    Object.values(_this.controls).forEach(function (x) {
                        if (x.visible) {
                            _this.visibleControls.push(x);
                        }
                        x.visible = false;
                    });
                    controls.visible = true;
                }
                if (controls.hideOtherHandlesOnDrag) {
                    controls.children.map(function (handle) {
                        if (handle.visible) {
                            _this.visibleHandles.push(handle);
                        }
                        handle.visible = false;
                    });
                    _this.activeHandle.visible = true;
                }
                if (_this.activeHandle instanceof PickPlane) {
                    _this.setPickPlaneOpacity(PICK_PLANE_OPACITY.ACTIVE);
                }
                /**
                 * creating the activePlane - the plane on which intersection actions
                 * take place. mouse movements are translated to points on the activePlane
                 */
                _this.activePlane = new Plane$1();
                var eyePlaneNormal = _this.getEyePlaneNormal(_this.activeHandle);
                controls.getWorldQuaternion(_this.controlsWorldQuaternion);
                _this.normal.copy(_this.activeHandle instanceof PickGroup ? eyePlaneNormal : _this.activeHandle.up);
                if (!(_this.activeHandle instanceof RotationEye || _this.activeHandle instanceof PickGroup)) {
                    _this.normal.applyQuaternion(_this.controlsWorldQuaternion);
                }
                /*
                  if the angle between the eye-normal and the normal to the activePlane is
                  too small, a small mouse movement makes a large projection on the activePlane,
                  causing the object to jump big distances. To avoid this, the activePlane
                  is flipped by 90 degrees about the parallel vector of the handle.
                  This problem only requires mitigation in the TranslationGroup handle case.
                 */
                if (_this.activeHandle instanceof TranslationGroup) {
                    var dot = eyePlaneNormal.dot(_this.normal) / eyePlaneNormal.length();
                    // arccos(0.25) ~= 75 degrees
                    // this is the threshold to make the plane normal flip
                    _this.isActivePlaneFlipped = Math.abs(dot) < 0.25;
                    if (_this.isActivePlaneFlipped) {
                        _this.isActivePlaneFlipped = true;
                        _this.normal.applyAxisAngle(_this.activeHandle.parallel, Math.PI / 2);
                    }
                }
                if (_this.activeHandle instanceof TranslationGroup) {
                    _this.activePlane.setFromNormalAndCoplanarPoint(_this.normal, _this.activeHandle.position);
                }
                else {
                    _this.activePlane.setFromNormalAndCoplanarPoint(_this.normal, controls.position);
                }
                // find initial intersection
                var initialIntersectionPoint = new Vector3();
                if (_this.activeHandle instanceof PickGroup) {
                    _this.activeHandle.getWorldPosition(initialIntersectionPoint);
                }
                else {
                    _this.ray.intersectPlane(_this.activePlane, initialIntersectionPoint);
                }
                // activate the helper plane if asked
                // available only for TranslationGroup and RotationGroup
                // (except RotationEye - plane of rotation is obvious)
                var scene = controls.parent;
                if (controls.showHelperPlane &&
                    (_this.activeHandle instanceof TranslationGroup ||
                        _this.activeHandle instanceof RotationGroup) &&
                    !(_this.activeHandle instanceof RotationEye)) {
                    _this.helperPlane = new PlaneHelper(_this.activePlane, 1);
                    scene.add(_this.helperPlane);
                }
                /**
                 * activate the highlightAxis if asked
                 * available only for TranslationGroup and RotationGroup
                 * (except RotationEye - plane of rotation is obvious)
                 */
                if (controls.highlightAxis &&
                    (_this.activeHandle instanceof TranslationGroup ||
                        _this.activeHandle instanceof RotationGroup) &&
                    !(_this.activeHandle instanceof RotationEye)) {
                    _this.activeHandle.getWorldPosition(_this.highlightAxisLine.position);
                    var direction = _this.highlightAxisLine.position.clone();
                    if (_this.activeHandle instanceof TranslationGroup) {
                        direction.add(_this.activeHandle.parallel);
                    }
                    else {
                        direction.add(_this.activeHandle.up);
                    }
                    _this.highlightAxisLine.lookAt(direction);
                    scene.add(_this.highlightAxisLine);
                }
                // switch event listeners and dispatch DRAG_START
                removeEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                    capture: true
                });
                emitter.emit(EVENTS.DRAG_START, {
                    point: initialIntersectionPoint,
                    handle: _this.activeHandle
                });
                addEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
                    passive: false,
                    capture: true
                });
            }
            else {
                _this.activePlane = null;
            }
        };
        _this.getEyePlaneNormal = function (object) {
            _this.cameraPosition.copy(_this.camera.position);
            return _this.cameraPosition.sub(object.position);
        };
        _this.setRayDirection = function (clientX, clientY) {
            var rect = _this.domElement.getBoundingClientRect();
            var _a = _this.domElement, clientHeight = _a.clientHeight, clientWidth = _a.clientWidth;
            _this.mouse.x = ((clientX - rect.left) / clientWidth) * 2 - 1;
            _this.mouse.y = -((clientY - rect.top) / clientHeight) * 2 + 1;
            _this.setFromCamera(_this.mouse, _this.camera);
        };
        _this.pointerMoveListener = function (event) {
            if (_this.activeHandle === null || _this.activePlane === null) {
                return;
            }
            var point = getPointFromEvent(event);
            if (!point) {
                return;
            }
            var clientX = point.clientX, clientY = point.clientY;
            _this.setRayDirection(clientX, clientY);
            _this.ray.intersectPlane(_this.activePlane, _this.point);
            _this.currentScreenPoint.set(clientX, clientY);
            var distance = _this.currentScreenPoint.distanceTo(_this.previousScreenPoint);
            var dragRatio = distance / (_this.clientDiagonalLength || 1);
            emitter.emit(EVENTS.DRAG, {
                point: _this.point,
                handle: _this.activeHandle,
                dragRatio: dragRatio
            });
            _this.previousScreenPoint.set(clientX, clientY);
        };
        _this.pointerUpListener = function () {
            var _a, _b, _c, _d;
            removeEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
                capture: true
            });
            addEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                passive: false,
                capture: true
            });
            emitter.emit(EVENTS.DRAG_STOP, { point: _this.point, handle: _this.activeHandle });
            if (((_a = _this.activeHandle) === null || _a === void 0 ? void 0 : _a.parent) &&
                _this.activeHandle.parent.hideOtherControlsInstancesOnDrag) {
                _this.visibleControls.forEach(function (controls) {
                    controls.visible = true;
                });
                _this.visibleControls = [];
            }
            if (((_b = _this.activeHandle) === null || _b === void 0 ? void 0 : _b.parent) &&
                _this.activeHandle.parent.hideOtherHandlesOnDrag) {
                _this.visibleHandles.forEach(function (handle) {
                    handle.visible = true;
                });
                _this.visibleHandles = [];
            }
            if (_this.activeHandle instanceof PickPlane) {
                _this.setPickPlaneOpacity(PICK_PLANE_OPACITY.INACTIVE);
            }
            var scene = (_d = (_c = _this.activeHandle) === null || _c === void 0 ? void 0 : _c.parent) === null || _d === void 0 ? void 0 : _d.parent;
            if (scene) {
                if (_this.helperPlane) {
                    scene.remove(_this.helperPlane);
                }
                scene.remove(_this.highlightAxisLine);
            }
            _this.activeHandle = null;
            _this.activePlane = null;
        };
        _this.resolveHandleGroup = function (intersectedObject) {
            if (intersectedObject === undefined) {
                return null;
            }
            return intersectedObject.object.parent;
        };
        _this.destroy = function () {
            _this.activePlane = null;
            _this.activeHandle = null;
            removeEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                capture: true
            });
            removeEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
                capture: true
            });
            removeEventListener(_this.domElement, ["mouseup", "touchend"], _this.pointerUpListener, {
                capture: true
            });
        };
        _this.highlightAxisLine = _this.createAxisLine();
        /**
         * mousedown and touchstart are used instead of pointerdown because
         * pointermove seems to stop firing after some a few events in chrome mobile
         * this could be because of some capture/passive setting but couldn't find
         * anything useful. using touch(*) events works.
         */
        addEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
            passive: false,
            capture: true
        });
        addEventListener(_this.domElement, ["mouseup", "touchend"], _this.pointerUpListener, {
            passive: false,
            capture: true
        });
        return _this;
    }
    Raycaster.prototype.setPickPlaneOpacity = function (opacity) {
        if (!(this.activeHandle instanceof PickPlane)) {
            return;
        }
        var material = this.activeHandle.plane.material;
        if (Array.isArray(material)) {
            material.map(function (m) {
                m.opacity = opacity;
                m.needsUpdate = true;
            });
        }
        else {
            material.opacity = opacity;
            material.needsUpdate = true;
        }
    };
    return Raycaster;
}(Raycaster$1));

/**
 * The ControlsManager provides helper functions to create Controls instances
 * and link them up with a Raycaster instance (reused across multiple Controls
 * instances).
 * @noInheritDoc
 */
var ControlsManager = /** @class */ (function (_super) {
    __extends(ControlsManager, _super);
    /**
     * @param camera - the THREE.Camera instance used in the scene
     * @param domElement - the dom element on which THREE.js renderer is attached,
     * generally available as `renderer.domElement`
     */
    function ControlsManager(camera, domElement) {
        var _a;
        var _this = _super.call(this) || this;
        _this.camera = camera;
        _this.domElement = domElement;
        _this.objects = {};
        _this.controls = {};
        _this.eventListeners = (_a = {},
            _a[EVENTS.DRAG_START] = [],
            _a[EVENTS.DRAG] = [],
            _a[EVENTS.DRAG_STOP] = [],
            _a);
        _this.listenToEvents = function () {
            emitter.on(EVENTS.DRAG_START, function (_a) {
                var point = _a.point, handle = _a.handle;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDragStart({ point: point, handle: handle });
                _this.eventListeners[EVENTS.DRAG_START].map(function (callback) {
                    callback(controls.object, handle.name);
                });
            });
            emitter.on(EVENTS.DRAG, function (_a) {
                var point = _a.point, handle = _a.handle, dragRatio = _a.dragRatio;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDrag({ point: point, handle: handle, dragRatio: dragRatio });
                _this.eventListeners[EVENTS.DRAG].map(function (callback) {
                    callback(controls.object, handle.name);
                });
            });
            emitter.on(EVENTS.DRAG_STOP, function (_a) {
                var handle = _a.handle;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDragEnd({ handle: handle });
                _this.eventListeners[EVENTS.DRAG_STOP].map(function (callback) {
                    callback(controls.object, handle.name);
                });
            });
        };
        /**
         * Creates a Controls instance and attaches it to the provided THREE.js object
         *
         * @param object - the object provided by the user
         * @param options
         */
        _this.anchor = function (object, options) {
            var controls = _this.addControls(object, options);
            _this.objects[object.id] = object;
            return controls;
        };
        /**
         * Detaches the Controls instance from the provided THREE.js object
         *
         * @param object - the object provided by the user
         * @param controls - the controls instance anchored on the object
         */
        _this.detach = function (object, controls) {
            if (!_this.objects.hasOwnProperty(object.id)) {
                throw new Error("object should be attached first");
            }
            _this.remove(controls);
            _this.dispose(controls);
            delete _this.objects[object.id];
            delete _this.controls[controls.id];
        };
        _this.addControls = function (object, options) {
            var controls = new Controls(object, _this.camera, options);
            _this.controls[controls.id] = controls;
            _this.add(controls);
            return controls;
        };
        /**
         * Adds an event listener. Note that there is another method `addEventListener`
         * on THREE.Object3D from which this class extends but that is specific to the
         * internals of THREE.js, but not this library
         * @param event
         * @param callback - by default the second argument is the default group name
         * for the Handle involved; for a custom handle, it is the `name` property
         * set on the handle
         */
        _this.listen = function (event, callback) {
            _this.eventListeners[event].push(callback);
        };
        /**
         * Removes the event listener.
         * @param event
         * @param callback
         */
        _this.removeListen = function (event, callback) {
            var index = _this.eventListeners[event].findIndex(function (x) { return x === callback; });
            if (index !== -1) {
                _this.eventListeners[event].splice(index, 1);
            }
        };
        _this.dispose = function (object) {
            if (object instanceof Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                    object.material.map(function (material) { return material.dispose(); });
                }
                else {
                    object.material.dispose();
                }
            }
            while (object.children.length > 0) {
                object.children.map(function (child) {
                    _this.dispose(child);
                    object.remove(child);
                });
            }
        };
        /**
         * Destroys all Controls instances and removes all event listeners
         */
        _this.destroy = function () {
            var _a;
            unbindAll$1();
            var scene = _this.parent;
            if (scene !== null) {
                scene.remove(_this);
            }
            _this.dispose(_this);
            Object.values(_this.controls).map(function (control) {
                _this.dispose(control);
            });
            _this.rayCaster.destroy();
            _this.objects = {};
            _this.controls = {};
            _this.eventListeners = (_a = {},
                _a[EVENTS.DRAG_START] = [],
                _a[EVENTS.DRAG] = [],
                _a[EVENTS.DRAG_STOP] = [],
                _a);
        };
        _this.rayCaster = new Raycaster(_this.camera, _this.domElement, _this.controls);
        _this.listenToEvents();
        return _this;
    }
    return ControlsManager;
}(Object3D));

export { ANCHOR_MODE, ControlsManager, DEFAULT_HANDLE_GROUP_NAME, EVENTS, Pick, PickPlane, PickPlaneGroup, Rotation, RotationGroup, Translation, TranslationGroup };
//# sourceMappingURL=three-freeform-controls.es5.js.map
