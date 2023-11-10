import { Router } from "express";
import userRouter from "../Routes/user";
import ProfRouter from "../Routes/profing";
import googleRouter from "../Routes/googleRoutes";
import SchoolRouter from "../Routes/School";
const api = Router();

api.use("/user", userRouter);
api.use("/prof", ProfRouter);
api.use("/auth", googleRouter);
api.use("/school", SchoolRouter);

export default api;
