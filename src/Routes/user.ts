import { Router } from "express";
import {
  loginController,
  registerController,
  verifyEmailController,
  getAlluserController,
  getSingleUserController,
  rateProfessorController,
  deleteUserController,
} from "../Controller/user";

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.get("/verify-email/:userID/:token", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/", getAlluserController);
userRouter.get("/:userID", getSingleUserController);
userRouter.post("/:userID/:professorID", rateProfessorController);
userRouter.delete("/:userID", deleteUserController);

export default userRouter;
