import { Router } from "express";
import {
  deleteAllProfController,
  getAllProfController,
  getProfessorRatingsController,
  getSingleProfConroller,
  regProfController,
} from "../Controller/ratingProfs";

const ProfRouter = Router();

ProfRouter.get("/", getAllProfController);
ProfRouter.post("/create", regProfController);
ProfRouter.get("/:profID", getSingleProfConroller);
ProfRouter.delete("/:profID", deleteAllProfController);
ProfRouter.get("/rating/:professorID", getProfessorRatingsController);

export default ProfRouter;
