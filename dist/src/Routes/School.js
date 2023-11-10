"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Schooling_1 = require("../Controller/Schooling");
const SchoolRouter = (0, express_1.Router)();
SchoolRouter.get("/", Schooling_1.getAllSchoolController);
exports.default = SchoolRouter;
