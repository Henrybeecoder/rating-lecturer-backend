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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateProfessor = exports.deleteUser = exports.getOneUser = exports.getAllUser = exports.loginService = exports.verifyEmailService = exports.registerService = void 0;
const User_1 = __importDefault(require("../Model/User"));
const Token_1 = __importDefault(require("../Model/Token"));
const envVariable_1 = __importDefault(require("../config/envVariable"));
const emailConfig_1 = require("../utils/emailConfig");
const AppError_1 = require("../utils/AppError");
const Professor_1 = __importDefault(require("../Model/Professor"));
const Rating_1 = __importDefault(require("../Model/Rating"));
const registerService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, school, password } = req.body || {};
    //
    const checkUserRegistered = yield User_1.default.findOne({ email });
    if ((checkUserRegistered === null || checkUserRegistered === void 0 ? void 0 : checkUserRegistered.isVerified) === true &&
        checkUserRegistered.status === "active") {
        return res
            .status(400)
            .json({ message: "You already registered, proceed to login" });
    }
    const newUser = new User_1.default({ email, name, school, password });
    const user = yield newUser.save();
    let token = new Token_1.default({ userID: user._id });
    const payload = {
        userID: user._id,
    };
    const accessTokenSecretKey = envVariable_1.default.ACCESS_TOKEN_SECRET_KEY;
    const accessTokenOptions = {
        expiresIn: Number(envVariable_1.default.ACCESS_TOKEN_KEY_EXPIRE_TIME),
        issuer: envVariable_1.default.JWT_ISSUER,
        audience: String(user._id),
    };
    const refreshTokenSecretKey = envVariable_1.default.REFRESH_TOKEN_SECRET_KEY;
    const refreshTokenOptions = {
        expiresIn: Number(envVariable_1.default.REFRESH_TOKEN_KEY_EXPIRE_TIME),
        issuer: envVariable_1.default.JWT_ISSUER,
        audience: String(user._id),
    };
    // Generate and set verify email token
    const generateAccessToken = yield token.generateToken(payload, accessTokenSecretKey, accessTokenOptions);
    const generateRefreshToken = yield token.generateToken(payload, refreshTokenSecretKey, refreshTokenOptions);
    token.refreshToken = generateRefreshToken;
    token.accessToken = generateAccessToken;
    token = yield token.save();
    const verifyEmailLink = `${envVariable_1.default.WEBSITE_URL}/${user._id}/${token.refreshToken}/sign-in`;
    //https://ratingmyprofessor.web.app/userID/token/sign-in
    // // send email for verification
    const verifyingUser = {
        email: user.email,
        id: user._id,
        status: user.status,
        link: verifyEmailLink,
    };
    yield (0, emailConfig_1.verifyUserEmail)(verifyingUser).then(() => console.log(`Email has been sent to: ${user.email}`));
    const data = {
        user: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        },
    };
    return res.status(201).json({
        message: `Email has been sent to: ${user.email}`,
        data,
    });
});
exports.registerService = registerService;
const verifyEmailService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.userID);
        if (!user)
            next(new AppError_1.AppError({
                message: "Email verification token is invalid or has expired. Please click on resend for verify your Email.",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            }));
        //User is already verified
        if (user.isVerified && user.status === "inactive") {
            return res.status(200).json({
                message: "Your email is already verified, Please Login",
            });
        }
        const emailVerificationToken = yield Token_1.default.findOne({
            userID: user._id,
            refreshToken: req.params.token,
        });
        if (!emailVerificationToken)
            next(new AppError_1.AppError({
                message: "Email verification token is invalid or has expired.",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            }));
        // Verify the user
        user.isVerified = true;
        user.status = "active";
        user.verifiedDate = new Date().toDateString();
        yield user.save();
        yield emailVerificationToken.deleteOne();
        return res.status(200).json({
            status: "success",
            message: "Your account has been successfully verified . Please proceed to create your profile.",
        });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
exports.verifyEmailService = verifyEmailService;
const loginService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            next(new AppError_1.AppError({
                message: "This email and password does not exist",
                httpCode: AppError_1.HttpCode.UNAUTHORIZED,
            }));
        const checkPassword = yield user.comparePassword(password);
        if (!checkPassword)
            next(new AppError_1.AppError({
                message: "This email and password does not exist",
                httpCode: AppError_1.HttpCode.UNAUTHORIZED,
            }));
        let token = yield Token_1.default.findOne({ userID: user._id });
        if (!token) {
            token = new Token_1.default({ userID: user._id });
            token = yield token.save();
        }
        // Generate access and refresh token
        const generatedAccessToken = yield token.generateToken({ userID: user._id }, envVariable_1.default.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: envVariable_1.default.ACCESS_TOKEN_KEY_EXPIRE_TIME,
            issuer: envVariable_1.default.JWT_ISSUER,
            audience: String(user._id),
        });
        const generatedRefreshToken = yield token.generateToken({ userID: user._id }, envVariable_1.default.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: envVariable_1.default.REFRESH_TOKEN_KEY_EXPIRE_TIME,
            issuer: envVariable_1.default.JWT_ISSUER,
            audience: String(user._id),
        });
        //save the updated token
        token.refreshToken = generatedRefreshToken;
        token.accessToken = generatedAccessToken;
        token = yield token.save();
        // check if user verified
        if (!user.isVerified || user.status === "inactive") {
            const verifyEmailLink = `${envVariable_1.default.WEBSITE_URL}/verify-email/${user._id}/${token.refreshToken}`;
            // // send email for verification
            const verifyingUser = {
                email: user.email,
                id: user._id,
                status: user.status,
                link: verifyEmailLink,
            };
            yield (0, emailConfig_1.verifyUserEmail)(verifyingUser).then(() => console.log(`Email has been sent to ${user.email}`));
            const data = {
                user: {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                },
            };
            return res.status(401).json({
                message: "Your account is not verified, a verification code has been sent to your email",
                data,
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user._doc, { password: pass, isVerified, status } = _a, otherUserInfo = __rest(_a, ["password", "isVerified", "status"]);
        const data = {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            user: otherUserInfo,
        };
        return res.status(200).json({
            message: "Success",
            data,
        });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.loginService = loginService;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: `Gotten ${user.length} Users Successfully`,
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while getting all users",
            data: error,
        });
    }
});
exports.getAllUser = getAllUser;
const getOneUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.params;
        const user = yield User_1.default.findOne(userID);
        //checking if user exist
        if (!user) {
            next(new AppError_1.AppError({
                message: "User not found",
                httpCode: AppError_1.HttpCode.NOT_FOUND,
            }));
        }
        return res.status(AppError_1.HttpCode.OK).json({
            message: `Hello ${user === null || user === void 0 ? void 0 : user.name} Nice to see you again`,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while getting all users",
            data: error,
        });
    }
});
exports.getOneUser = getOneUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userID = req.params;
        const user = yield User_1.default.findByIdAndDelete(req.params.userID);
        //checking if user exist
        // if (!user) {
        //   next(
        //     new AppError({
        //       message: "Not Unauthorized",
        //       httpCode: HttpCode.NOT_FOUND,
        //     })
        //   );
        // }
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Successfully",
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occurred while deleting users",
            data: error,
        });
    }
});
exports.deleteUser = deleteUser;
function rateProfessor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userID, professorID } = req.params;
            const { comments, rating } = req.body;
            const user = yield User_1.default.findById(userID);
            const professor = yield Professor_1.default.findOne({ userId: professorID });
            if (!user && !professor) {
                throw new Error("User or professor not found");
            }
            // check if professor was already rated by user
            const existingRating = yield Rating_1.default.findOne({ userID, professorID });
            if (existingRating) {
                throw new Error("You have already rated this professor.");
            }
            const rateProf = new Rating_1.default({
                userID,
                professorID,
                comments,
                rating,
            });
            const data = yield rateProf.save();
            // console.log(data, "created");
            return res.status(200).json(data);
        }
        catch (error) {
            return res.status(500).json(error);
        }
    });
}
exports.rateProfessor = rateProfessor;
