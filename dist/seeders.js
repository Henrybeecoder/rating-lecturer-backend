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
const fs_1 = require("fs");
const csv_parser_1 = __importDefault(require("csv-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const envVariable_1 = __importDefault(require("./src/config/envVariable"));
const School_1 = __importDefault(require("./src/Model/School"));
mongoose_1.default.connect(envVariable_1.default.MongoDbConnection);
function csvToJson() {
    const results = [];
    // craeting a stream that is Reading our csv file
    (0, fs_1.createReadStream)("./src/Config/Schools.csv")
        //this is doing a read-transform operation
        .pipe((0, csv_parser_1.default)())
        //turning our stream into a buffer and getting it as a json object
        .on("data", (data) => {
        // const jsonObject = {
        //   ...data,
        //   userId: generate(6),
        // };
        const jsonObject = Object.assign({}, data);
        results.push(jsonObject);
        // console.log(results);
    })
        .on("end", () => {
        writeData(results);
    });
}
function writeData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield School_1.default.insertMany(data);
            console.log(users.length);
            console.log("Successfully inserted");
        }
        catch (error) {
            console.log("Failed to insert", error);
        }
    });
}
csvToJson();
