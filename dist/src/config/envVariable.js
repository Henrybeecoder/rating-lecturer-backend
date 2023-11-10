"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVariable = {
    PORT: process.env.PORT,
    MONGO_LOCAL: process.env.MONGO_LOCAL,
    MongoDbConnection: process.env.MongoDbConnection,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_KEY_EXPIRE_TIME: process.env.ACCESS_TOKEN_KEY_EXPIRE_TIME,
    REFRESH_TOKEN_KEY_EXPIRE_TIME: process.env.REFRESH_TOKEN_KEY_EXPIRE_TIME,
    JWT_ISSUER: process.env.JWT_ISSUER,
    WEBSITE_URL: process.env.WEBSITE_URL,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_REFRESHTOKEN: process.env.GOOGLE_REFRESHTOKEN,
    GOOGLE_REDIRECT: process.env.GOOGLE_REDIRECT,
    RESET_PASSWORD_EXPIRE_TIME: process.env.RESET_PASSWORD_EXPIRE_TIME,
    PASSPORT_REFRESHTOKEN: process.env.PASSPORT_REFRESHTOKEN,
    PASSPORT_CLIENTID: process.env.PASSPORT_CLIENTID,
    PASSPORT_CLIENT_SECRET: process.env.PASSPORT_CLIENT_SECRET,
    PASSPORT_REDIRECT: process.env.PASSPORT_REDIRECT,
    SESSION_KEY: process.env.SESSION_KEY,
};
exports.default = envVariable;
