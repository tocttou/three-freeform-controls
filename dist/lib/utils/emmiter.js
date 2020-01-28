"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nanoevents_1 = __importDefault(require("nanoevents"));
var unbind_all_1 = __importDefault(require("nanoevents/unbind-all"));
exports.emitter = new nanoevents_1.default();
exports.unbindAll = function () { return unbind_all_1.default(exports.emitter); };
//# sourceMappingURL=emmiter.js.map