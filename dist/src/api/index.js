"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../Routes/user"));
const profing_1 = __importDefault(require("../Routes/profing"));
const googleRoutes_1 = __importDefault(require("../Routes/googleRoutes"));
const School_1 = __importDefault(require("../Routes/School"));
const api = (0, express_1.Router)();
api.use("/user", user_1.default);
api.use("/prof", profing_1.default);
api.use("/auth", googleRoutes_1.default);
api.use("/school", School_1.default);
exports.default = api;
