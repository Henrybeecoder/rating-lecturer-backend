"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSchool = void 0;
const School_1 = __importDefault(require("../Model/School"));
const GetAllSchool = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const school = yield School_1.default.find().sort({ name: 1 });
        return res.status(200).json({
            message: `Gotten ${school.length} Schools Successfully`,
            data: school,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while getting all School",
            data: error,
        });
    }
});
exports.GetAllSchool = GetAllSchool;
