"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSchoolController = void 0;
const school_1 = require("../services/school");
const getAllSchoolController = (req, res, next) => (0, school_1.GetAllSchool)(req, res, next);
exports.getAllSchoolController = getAllSchoolController;
