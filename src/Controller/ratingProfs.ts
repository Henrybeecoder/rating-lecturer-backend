import { NextFunction, Request, Response } from "express";
import {
  createProf,
  getSingleProf,
  GetAllProf,
  deleteProf,
  getProfessorRatings,
} from "../services/professor";

export const regProfController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createProf(req, res, next);

export const getSingleProfConroller = (
  req: Request,
  res: Response,
  next: NextFunction
) => getSingleProf(req, res, next);

export const getAllProfController = (
  req: Request,
  res: Response,
  next: NextFunction
) => GetAllProf(req, res, next);

export const deleteAllProfController = (
  req: Request,
  res: Response,
  next: NextFunction
) => deleteProf(req, res, next);
export const getProfessorRatingsController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getProfessorRatings(req, res, next);
