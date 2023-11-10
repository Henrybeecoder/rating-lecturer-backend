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
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const envVariable_1 = __importDefault(require("./config/envVariable"));
const DB_1 = __importDefault(require("./config/DB"));
const app = (0, express_1.default)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DB_1.default)();
        (0, app_1.default)(app);
        app.listen(process.env.PORT || envVariable_1.default.PORT, () => {
            console.log(`Server listening on ${envVariable_1.default.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
//Protecting myserver from crashing when a user do what they are authorized to do
//Uncaught exceptions
// process.on("uncaughtException", (error: any) => {
//   console.log("Server is shutting down due to uncaught exception");
//   console.log("error");
//   process.exit(1);
// });
// //Uncaughthandled exceptions
// process.on("unhandledRejection", (reason: any) => {
//   console.log("server is shutting down due to unhandled rejection");
//   console.log(reason);
//   process.exit(1);
// });
