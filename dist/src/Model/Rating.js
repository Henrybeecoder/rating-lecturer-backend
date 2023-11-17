"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    professorID: { type: String },
    userID: { type: mongoose_1.Schema.Types.ObjectId },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    difficulty: { type: Number, min: 1, max: 5 },
    course_code: { type: String },
}, {
    versionKey: false,
    timestamps: true,
});
const Rating = (0, mongoose_1.model)("Rating", ratingSchema);
exports.default = Rating;
