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
const mongoose_1 = require("mongoose");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true, validate: isEmail_1.default, lowercase: true },
    userID: { type: mongoose_1.Schema.Types.ObjectId },
    school: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedDate: { type: String },
    status: { type: String, default: "inactive" },
    googleID: { type: String },
    registrationType: { type: String, default: "email and password" },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.isVerified;
            delete ret.__v;
            delete ret.status;
        },
    },
    timestamps: true,
    versionKey: false,
});
// this is to encrypt the password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        console.log(`Data before save: ${JSON.stringify(user)}`);
        if (user.isModified("password")) {
            const salt = yield bcrypt_1.default.genSalt(12);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
        }
        next();
    });
});
// this is to compare passwords
userSchema.methods.comparePassword = function (userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt_1.default.compare(userPassword, this.password);
        return isMatch;
    });
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
