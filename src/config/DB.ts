import mongoose from "mongoose";
import envVariable from "./envVariable";

async function dbConnection() {
  try {
    const conn = await mongoose.connect(envVariable.MongoDbConnection);
    console.log(`Database is connected to ${conn.connection.host}`);
  } catch (error: any) {
    console.log(error);
  }
}

export default dbConnection;
