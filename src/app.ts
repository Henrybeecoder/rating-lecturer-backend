import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import api from "./api";
import { AppError, HttpCode } from "./utils/AppError";
import { errorHandler } from "./middlewares/error/errorHandler";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { googleSessionMiddleware, sessionOptions } from "./services/google";
import passport from "passport";

const appConfig = (app: Application) => {
  app
    .use(cors({ origin: "*", optionsSuccessStatus: 200 }))
    .use(express.json())
    .use(morgan("tiny"));

  app.get("/", (req: Request, res: Response) => {
    try {
      res.status(200).json({
        message: "Server is up and running 😁😁😁😁😁",
      });
    } catch (error) {
      res.status(404).json({
        message: "Error was found",
      });
    }
  });

  //Google
  app
    .use(cookieParser())
    .use(cookieSession(sessionOptions))
    .use(googleSessionMiddleware)
    .use(passport.initialize())
    .use(passport.session());

  app.use("/api", api);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: `This route ${req.originalUrl} does not exist`,
        httpCode: HttpCode.NOT_FOUND,
        name: "Route Error",
        isOperational: false,
      })
    );
  });
  app.use(errorHandler);
};

export default appConfig;
