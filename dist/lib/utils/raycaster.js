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
var emmiter_1 = require("./emmiter");
var pick_plane_1 = __importDefault(require("../controls/handles/pick-plane"));
var constants_1 = require("./constants");
var handles_1 = require("../controls/handles");
var rotation_eye_1 = __importDefault(require("../controls/handles/rotation-eye"));
var helper_1 = require("./helper");
var line_1 = __importDefault(require("../primitives/line"));
var EVENTS;
(function (EVENTS) {
    EVENTS["DRAG_START"] = "DRAG_START";
    EVENTS["DRAG"] = "DRAG";
    EVENTS["DRAG_STOP"] = "DRAG_STOP";
})(EVENTS = exports.EVENTS || (exports.EVENTS = {}));
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
        _this.mouse = new THREE.Vector2();
        _this.cameraPosition = new THREE.Vector3();
        _this.activeHandle = null;
        _this.activePlane = null;
        _this.point = new THREE.Vector3();
        _this.normal = new THREE.Vector3();
        _this.visibleHandles = [];
        _this.visibleControls = [];
        _this.helperPlane = null;
        _this.controlsWorldQuaternion = new THREE.Quaternion();
        _this.clientDiagonalLength = 1;
        _this.previousScreenPoint = new THREE.Vector2();
        _this.currentScreenPoint = new THREE.Vector2();
        _this.isActivePlaneFlipped = false;
        _this.createAxisLine = function () {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, 0, -100));
            geometry.vertices.push(new THREE.Vector3(0, 0, 100));
            return new line_1.default("white", geometry);
        };
        _this.pointerDownListener = function (event) {
            var _a;
            var point = helper_1.getPointFromEvent(event);
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
                if (_this.activeHandle instanceof pick_plane_1.default) {
                    _this.setPickPlaneOpacity(constants_1.PICK_PLANE_OPACITY.ACTIVE);
                }
                /**
                 * creating the activePlane - the plane on which intersection actions
                 * take place. mouse movements are translated to points on the activePlane
                 */
                _this.activePlane = new THREE.Plane();
                var eyePlaneNormal = _this.getEyePlaneNormal(_this.activeHandle);
                controls.getWorldQuaternion(_this.controlsWorldQuaternion);
                _this.normal.copy(_this.activeHandle instanceof handles_1.PickGroup ? eyePlaneNormal : _this.activeHandle.up);
                if (!(_this.activeHandle instanceof rotation_eye_1.default || _this.activeHandle instanceof handles_1.PickGroup)) {
                    _this.normal.applyQuaternion(_this.controlsWorldQuaternion);
                }
                /*
                  if the angle between the eye-normal and the normal to the activePlane is
                  too small, a small mouse movement makes a large projection on the activePlane,
                  causing the object to jump big distances. To avoid this, the activePlane
                  is flipped by 90 degrees about the parallel vector of the handle.
                  This problem only requires mitigation in the TranslationGroup handle case.
                 */
                if (_this.activeHandle instanceof handles_1.TranslationGroup) {
                    var dot = eyePlaneNormal.dot(_this.normal) / eyePlaneNormal.length();
                    // arccos(0.25) ~= 75 degrees
                    // this is the threshold to make the plane normal flip
                    _this.isActivePlaneFlipped = Math.abs(dot) < 0.25;
                    if (_this.isActivePlaneFlipped) {
                        _this.isActivePlaneFlipped = true;
                        _this.normal.applyAxisAngle(_this.activeHandle.parallel, Math.PI / 2);
                    }
                }
                if (_this.activeHandle instanceof handles_1.TranslationGroup) {
                    _this.activePlane.setFromNormalAndCoplanarPoint(_this.normal, _this.activeHandle.position);
                }
                else {
                    _this.activePlane.setFromNormalAndCoplanarPoint(_this.normal, controls.position);
                }
                // find initial intersection
                var initialIntersectionPoint = new THREE.Vector3();
                if (_this.activeHandle instanceof handles_1.PickGroup) {
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
                    (_this.activeHandle instanceof handles_1.TranslationGroup ||
                        _this.activeHandle instanceof handles_1.RotationGroup) &&
                    !(_this.activeHandle instanceof rotation_eye_1.default)) {
                    _this.helperPlane = new THREE.PlaneHelper(_this.activePlane, 1);
                    scene.add(_this.helperPlane);
                }
                /**
                 * activate the highlightAxis if asked
                 * available only for TranslationGroup and RotationGroup
                 * (except RotationEye - plane of rotation is obvious)
                 */
                if (controls.highlightAxis &&
                    (_this.activeHandle instanceof handles_1.TranslationGroup ||
                        _this.activeHandle instanceof handles_1.RotationGroup) &&
                    !(_this.activeHandle instanceof rotation_eye_1.default)) {
                    _this.activeHandle.getWorldPosition(_this.highlightAxisLine.position);
                    var direction = _this.highlightAxisLine.position.clone();
                    if (_this.activeHandle instanceof handles_1.TranslationGroup) {
                        direction.add(_this.activeHandle.parallel);
                    }
                    else {
                        direction.add(_this.activeHandle.up);
                    }
                    _this.highlightAxisLine.lookAt(direction);
                    scene.add(_this.highlightAxisLine);
                }
                // switch event listeners and dispatch DRAG_START
                helper_1.removeEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                    capture: true
                });
                emmiter_1.emitter.emit(EVENTS.DRAG_START, {
                    point: initialIntersectionPoint,
                    handle: _this.activeHandle
                });
                helper_1.addEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
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
            var point = helper_1.getPointFromEvent(event);
            if (!point) {
                return;
            }
            var clientX = point.clientX, clientY = point.clientY;
            _this.setRayDirection(clientX, clientY);
            _this.ray.intersectPlane(_this.activePlane, _this.point);
            _this.currentScreenPoint.set(clientX, clientY);
            var distance = _this.currentScreenPoint.distanceTo(_this.previousScreenPoint);
            var dragRatio = distance / (_this.clientDiagonalLength || 1);
            emmiter_1.emitter.emit(EVENTS.DRAG, {
                point: _this.point,
                handle: _this.activeHandle,
                dragRatio: dragRatio
            });
            _this.previousScreenPoint.set(clientX, clientY);
        };
        _this.pointerUpListener = function () {
            var _a, _b, _c, _d;
            helper_1.removeEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
                capture: true
            });
            helper_1.addEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                passive: false,
                capture: true
            });
            emmiter_1.emitter.emit(EVENTS.DRAG_STOP, { point: _this.point, handle: _this.activeHandle });
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
            if (_this.activeHandle instanceof pick_plane_1.default) {
                _this.setPickPlaneOpacity(constants_1.PICK_PLANE_OPACITY.INACTIVE);
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
            helper_1.removeEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
                capture: true
            });
            helper_1.removeEventListener(_this.domElement, ["mousemove", "touchmove"], _this.pointerMoveListener, {
                capture: true
            });
            helper_1.removeEventListener(_this.domElement, ["mouseup", "touchend"], _this.pointerUpListener, {
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
        helper_1.addEventListener(_this.domElement, ["mousedown", "touchstart"], _this.pointerDownListener, {
            passive: false,
            capture: true
        });
        helper_1.addEventListener(_this.domElement, ["mouseup", "touchend"], _this.pointerUpListener, {
            passive: false,
            capture: true
        });
        return _this;
    }
    Raycaster.prototype.setPickPlaneOpacity = function (opacity) {
        if (!(this.activeHandle instanceof pick_plane_1.default)) {
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
}(THREE.Raycaster));
exports.default = Raycaster;
//# sourceMappingURL=raycaster.js.map