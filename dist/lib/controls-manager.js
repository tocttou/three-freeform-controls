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
var controls_1 = __importDefault(require("./controls"));
var raycaster_1 = __importStar(require("./utils/raycaster"));
var emmiter_1 = require("./utils/emmiter");
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
            _a[raycaster_1.EVENTS.DRAG_START] = [],
            _a[raycaster_1.EVENTS.DRAG] = [],
            _a[raycaster_1.EVENTS.DRAG_STOP] = [],
            _a);
        _this.listenToEvents = function () {
            emmiter_1.emitter.on(raycaster_1.EVENTS.DRAG_START, function (_a) {
                var point = _a.point, handle = _a.handle;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDragStart({ point: point, handle: handle });
                _this.eventListeners[raycaster_1.EVENTS.DRAG_START].map(function (callback) {
                    callback(controls.object, handle.name);
                });
            });
            emmiter_1.emitter.on(raycaster_1.EVENTS.DRAG, function (_a) {
                var point = _a.point, handle = _a.handle, dragRatio = _a.dragRatio;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDrag({ point: point, handle: handle, dragRatio: dragRatio });
                _this.eventListeners[raycaster_1.EVENTS.DRAG].map(function (callback) {
                    callback(controls.object, handle.name);
                });
            });
            emmiter_1.emitter.on(raycaster_1.EVENTS.DRAG_STOP, function (_a) {
                var handle = _a.handle;
                if (handle === null) {
                    return;
                }
                var controls = handle.parent;
                if (controls === null) {
                    return;
                }
                controls.processDragEnd({ handle: handle });
                _this.eventListeners[raycaster_1.EVENTS.DRAG_STOP].map(function (callback) {
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
            var controls = new controls_1.default(object, _this.camera, options);
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
            if (object instanceof THREE.Mesh) {
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
            emmiter_1.unbindAll();
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
                _a[raycaster_1.EVENTS.DRAG_START] = [],
                _a[raycaster_1.EVENTS.DRAG] = [],
                _a[raycaster_1.EVENTS.DRAG_STOP] = [],
                _a);
        };
        _this.rayCaster = new raycaster_1.default(_this.camera, _this.domElement, _this.controls);
        _this.listenToEvents();
        return _this;
    }
    return ControlsManager;
}(THREE.Object3D));
exports.default = ControlsManager;
//# sourceMappingURL=controls-manager.js.map