"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchoolSchema = new mongoose_1.Schema({
    schoolName: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true,
});
const School = (0, mongoose_1.model)("Schools", SchoolSchema);
exports.default = School;
