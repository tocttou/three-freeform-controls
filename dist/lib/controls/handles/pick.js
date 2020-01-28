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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var octahedron_1 = __importDefault(require("../../primitives/octahedron"));
var index_1 = require("./index");
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
        _this.octahedron = new octahedron_1.default("white");
        _this.add(_this.octahedron);
        return _this;
    }
    return Pick;
}(index_1.PickGroup));
exports.default = Pick;
//# sourceMappingURL=pick.js.map