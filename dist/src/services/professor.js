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
exports.getProfessorRatings = exports.getRating = exports.deleteProf = exports.GetAllProf = exports.getSingleProf = exports.createProf = void 0;
const Professor_1 = __importDefault(require("../Model/Professor"));
const AppError_1 = require("../utils/AppError");
const randomstring_1 = require("randomstring");
const Rating_1 = __importDefault(require("../Model/Rating"));
//Create a Professor
const createProf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, Title, Name, Professional_Department, school } = req.body;
    try {
        const createUser = yield Professor_1.default.create({
            userId: (0, randomstring_1.generate)(6),
            Title,
            Name,
            Professional_Department,
            school,
        });
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Successfully created Proffesor",
            data: createUser,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while creating a Professors",
            data: error,
        });
    }
});
exports.createProf = createProf;
//get a single Proffesor
const getSingleProf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const singleProf = yield Professor_1.default.findOne({ userId: req.params.profID });
    //checking if prof exists
    if (!singleProf) {
        next(new AppError_1.AppError({
            message: "Proffersor does  not exist",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    }
    return res.status(200).json({
        message: "Successfully gotten prof",
        data: singleProf,
    });
});
exports.getSingleProf = getSingleProf;
//get All prof
const GetAllProf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professorsWithRatings = yield Professor_1.default.aggregate([
            {
                $lookup: {
                    from: "ratings",
                    localField: "userId",
                    foreignField: "professorID",
                    as: "ratings",
                },
            },
            {
                $unwind: {
                    path: "$ratings",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    Title: { $first: "$Title" },
                    Name: { $first: "$Name" },
                    Professional_Department: { $first: "$Professional_Department" },
                    school: { $first: "$school" },
                    ratings: { $push: "$ratings.rating" },
                },
            },
            {
                $addFields: {
                    averageRate: { $avg: "$ratings" },
                },
            },
        ]);
        console.log();
        return res.status(200).json({
            message: `Gotten ${professorsWithRatings.length} Professors Successfully with Ratings and Average Rate`,
            data: professorsWithRatings,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while getting all Prof",
            data: error,
        });
    }
});
exports.GetAllProf = GetAllProf;
//delete profs
const deleteProf = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Prof = yield Professor_1.default.findByIdAndDelete(req.params.profID);
    if (!Prof) {
        next(new AppError_1.AppError({
            message: "An error occurred in deleting this prof",
            httpCode: AppError_1.HttpCode.FORBIDDEN,
        }));
    }
    return res.status(AppError_1.HttpCode.OK).json({
        message: "Successfully deleted the Prof",
    });
});
exports.deleteProf = deleteProf;
function getRating(professorID) {
    return __awaiter(this, void 0, void 0, function* () {
        const aggregateResult = yield Rating_1.default.aggregate([
            {
                $match: { professorID },
            },
            {
                $group: {
                    _id: "$professorID",
                    totalRating: { $sum: "$rating" },
                    averageRating: { $avg: "$rating" },
                    raters: { $push: "$userID" },
                    comments: { $push: "$comments" },
                    rating: { $push: "$rating" },
                    difficulty: { $push: "$difficulty" },
                    averDifficulty: { $avg: "$difficulty" },
                    totalDifficulty: { $sum: "$difficulty" },
                },
            },
        ]);
        if (aggregateResult.length === 0) {
            // Professor has no ratings yet
            return {
                totalRating: 0,
                averageRating: 0,
                raters: [],
                comments: [],
                rating: [],
                difficulty: [],
                averDifficulty: 0,
                totalDifficulty: 0,
            };
        }
        return aggregateResult[0];
    });
}
exports.getRating = getRating;
const getProfessorRatings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { professorID } = req.params;
        const rating = yield getRating(professorID);
        return res.status(200).json(rating);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getProfessorRatings = getProfessorRatings;
