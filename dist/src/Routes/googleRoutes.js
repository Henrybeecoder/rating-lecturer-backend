"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envVariable_1 = __importDefault(require("../config/envVariable"));
const router = (0, express_1.Router)();
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:4700/api/auth/success",
    failureRedirect: "http://localhost:4700/api/auth/failure",
}));
router.route("/failure").get((req, res) => {
    return res.status(404).json({ message: "Page not Found " });
});
router.route("/success").get((req, res) => {
    const user = req.user;
    const payload = {
        userID: user._id,
    };
    const encryptUser = jsonwebtoken_1.default.sign(payload, envVariable_1.default.TOKEN_SECRET, {
        expiresIn: envVariable_1.default.JWT_EXPIRES,
    });
    return res.status(200).json({
        message: `Welcome ${user.name}`,
        data: { user, encryptUser },
    });
});
exports.default = router;
