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
exports.sessionOptions = exports.googleSessionMiddleware = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const envVariable_1 = __importDefault(require("../config/envVariable"));
const User_1 = __importDefault(require("../Model/User"));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: envVariable_1.default.PASSPORT_CLIENTID,
    clientSecret: envVariable_1.default.PASSPORT_CLIENT_SECRET,
    callbackURL: envVariable_1.default.PASSPORT_REDIRECT,
    scope: ["email", "profile"],
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log({ accessToken, profile });
        const user = yield User_1.default.findOne({ email: profile._json.email });
        if (!user) {
            let newUser = new User_1.default({
                name: `${profile._json.name} ${profile._json.family_name}`,
                googleID: profile.id,
                email: profile._json.email,
                isVerified: profile._json.email_verified,
                status: "active",
                registrationType: "google",
            });
            yield newUser.save();
            return done(null, newUser);
        }
        else {
            return done(null, user);
        }
    });
}));
function googleSessionMiddleware(req, res, next) {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        };
    }
    next();
}
exports.googleSessionMiddleware = googleSessionMiddleware;
exports.sessionOptions = {
    name: `Session`,
    keys: [envVariable_1.default.SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000,
};
