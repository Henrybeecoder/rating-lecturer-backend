import { Request, Response, NextFunction } from "express";
import { GetAllSchool } from "../services/school";

export const getAllSchoolController = (
  req: Request,
  res: Response,
  next: NextFunction
) => GetAllSchool(req, res, next);
