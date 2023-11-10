import { createReadStream } from "fs";
import csv from "csv-parser";
import { generate } from "randomstring";
import mongoose from "mongoose";
import envVariable from "./src/config/envVariable";
import School from "./src/Model/School";

mongoose.connect(envVariable.MongoDbConnection);

function csvToJson() {
  const results: {}[] = [];
  // craeting a stream that is Reading our csv file
  createReadStream("./src/Config/Schools.csv")
    //this is doing a read-transform operation
    .pipe(csv())
    //turning our stream into a buffer and getting it as a json object
    .on("data", (data) => {
      // const jsonObject = {
      //   ...data,
      //   userId: generate(6),
      // };
      const jsonObject = { ...data };
      results.push(jsonObject);
      // console.log(results);
    })
    .on("end", () => {
      writeData(results);
    });
}

async function writeData(data: any) {
  try {
    const users = await School.insertMany(data);
    console.log(users.length);
    console.log("Successfully inserted");
  } catch (error: any) {
    console.log("Failed to insert", error);
  }
}

csvToJson();
