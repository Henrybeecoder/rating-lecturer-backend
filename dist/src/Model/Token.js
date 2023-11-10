"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSchema = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpires: {
        type: Date,
        required: false,
    },
    emailVerificationToken: {
        type: String,
        required: false,
    },
    emailVerificationExpiresToken: {
        type: Date,
        required: false,
    },
    accessToken: {
        type: String,
        required: false,
    },
    refreshToken: {
        type: String,
        required: false,
    },
}, { timestamps: true });
// Generate Refresh/Access Token
exports.TokenSchema.methods.generateToken = function (payload, secret, signOptions) {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.sign(payload, secret, signOptions, (err, encoded) => {
            if (err === null && encoded !== undefined) {
                resolve(encoded);
            }
            else {
                reject(err);
            }
        });
    });
};
// Generate email verification token
exports.TokenSchema.methods.generateEmailVerificationToken = function () {
    this.emailVerificationToken = crypto_1.default.randomBytes(32).toString("hex");
    this.emailVerificationExpiresToken = Date.now() + 3600000; // expires in an hour
};
// Generate Password Reset
exports.TokenSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto_1.default.randomBytes(32).toString("hex");
    this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};
exports.TokenSchema.post("save", function () {
    console.log("Token is been Saved ", this);
});
const Token = (0, mongoose_1.model)("Token", exports.TokenSchema);
exports.default = Token;
