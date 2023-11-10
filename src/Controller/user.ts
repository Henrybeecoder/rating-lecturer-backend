import { Request, Response, NextFunction } from "express";
import {
  deleteUser,
  getAllUser,
  getOneUser,
  loginService,
  rateProfessor,
  registerService,
  verifyEmailService,
} from "../services/user";

export const registerController = (
  req: Request,
  res: Response,
  next: NextFunction
) => registerService(req, res, next);
export const verifyEmailController = (
  req: Request,
  res: Response,
  next: NextFunction
) => verifyEmailService(req, res, next);
export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => loginService(req, res, next);

export const getAlluserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getAllUser(req, res);

export const getSingleUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getOneUser(req, res, next);
export const rateProfessorController = (
  req: Request,
  res: Response,
  next: NextFunction
) => rateProfessor(req, res, next);

export const deleteUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => deleteUser(req, res, next);
