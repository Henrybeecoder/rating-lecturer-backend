import express, { Application } from "express";
import appConfig from "./app";
import envVariable from "./config/envVariable";
import dbConnection from "./config/DB";

const app = express();

(async () => {
  try {
    await dbConnection();
    appConfig(app);
    app.listen(process.env.PORT || envVariable.PORT, () => {
      console.log(`Server listening on ${envVariable.PORT}`);
    });
  } catch (error: any) {
    console.log(error);
  }
})();

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
