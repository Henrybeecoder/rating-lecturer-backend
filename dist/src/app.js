"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const api_1 = __importDefault(require("./api"));
const AppError_1 = require("./utils/AppError");
const errorHandler_1 = require("./middlewares/error/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const google_1 = require("./services/google");
const passport_1 = __importDefault(require("passport"));
const appConfig = (app) => {
    app
        .use((0, cors_1.default)({ origin: "*", optionsSuccessStatus: 200 }))
        .use(express_1.default.json())
        .use((0, morgan_1.default)("tiny"));
    app.get("/", (req, res) => {
        try {
            res.status(200).json({
                message: "Server is up and running 😁😁😁😁😁",
            });
        }
        catch (error) {
            res.status(404).json({
                message: "Error was found",
            });
        }
    });
    //Google
    app
        .use((0, cookie_parser_1.default)())
        .use((0, cookie_session_1.default)(google_1.sessionOptions))
        .use(google_1.googleSessionMiddleware)
        .use(passport_1.default.initialize())
        .use(passport_1.default.session());
    app.use("/api", api_1.default);
    app.all("*", (req, res, next) => {
        next(new AppError_1.AppError({
            message: `This route ${req.originalUrl} does not exist`,
            httpCode: AppError_1.HttpCode.NOT_FOUND,
            name: "Route Error",
            isOperational: false,
        }));
    });
    app.use(errorHandler_1.errorHandler);
};
exports.default = appConfig;
