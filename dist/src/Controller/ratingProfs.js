"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfessorRatingsController = exports.deleteAllProfController = exports.getAllProfController = exports.getSingleProfConroller = exports.regProfController = void 0;
const professor_1 = require("../services/professor");
const regProfController = (req, res, next) => (0, professor_1.createProf)(req, res, next);
exports.regProfController = regProfController;
const getSingleProfConroller = (req, res, next) => (0, professor_1.getSingleProf)(req, res, next);
exports.getSingleProfConroller = getSingleProfConroller;
const getAllProfController = (req, res, next) => (0, professor_1.GetAllProf)(req, res, next);
exports.getAllProfController = getAllProfController;
const deleteAllProfController = (req, res, next) => (0, professor_1.deleteProf)(req, res, next);
exports.deleteAllProfController = deleteAllProfController;
const getProfessorRatingsController = (req, res, next) => (0, professor_1.getProfessorRatings)(req, res, next);
exports.getProfessorRatingsController = getProfessorRatingsController;
