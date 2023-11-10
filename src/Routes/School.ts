import { Router } from "express";
import { getAllSchoolController } from "../Controller/Schooling";

const SchoolRouter = Router();

SchoolRouter.get("/", getAllSchoolController);

export default SchoolRouter;
