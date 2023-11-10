import { NextFunction, Request, Response } from "express";
import School from "../Model/School";

export const GetAllSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const school = await School.find().sort({ name: 1 });

    return res.status(200).json({
      message: `Gotten ${school.length} Schools Successfully`,
      data: school,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while getting all School",
      data: error,
    });
  }
};
