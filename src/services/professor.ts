import Professor from "../Model/Professor";
import { AppError, HttpCode } from "../utils/AppError";
import { errorHandler } from "../middlewares/error/errorHandler";
import { generate } from "randomstring";

import { NextFunction, Request, Response } from "express";
import User from "../Model/User";
import Rating from "../Model/Rating";

//Create a Professor
export const createProf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, Title, Name, Professional_Department, school } = req.body;
  try {
    const createUser = await Professor.create({
      userId: generate(6),
      Title,
      Name,
      Professional_Department,
      school,
    });

    return res.status(HttpCode.OK).json({
      message: "Successfully created Proffesor",
      data: createUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while creating a Professors",
      data: error,
    });
  }
};

//get a single Proffesor
export const getSingleProf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const singleProf = await Professor.findOne({ userId: req.params.profID });
  //checking if prof exists
  if (!singleProf) {
    next(
      new AppError({
        message: "Proffersor does  not exist",
        httpCode: HttpCode.BAD_REQUEST,
      })
    );
  }
  return res.status(200).json({
    message: "Successfully gotten prof",
    data: singleProf,
  });
};

//get All prof
export const GetAllProf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const professorsWithRatings = await Professor.aggregate([
      {
        $lookup: {
          from: "ratings",
          localField: "userId",
          foreignField: "professorID",
          as: "ratings",
        },
      },
      {
        $unwind: {
          path: "$ratings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          Title: { $first: "$Title" },
          Name: { $first: "$Name" },
          Professional_Department: { $first: "$Professional_Department" },
          school: { $first: "$school" },
          ratings: { $push: "$ratings.rating" },
        },
      },
      {
        $addFields: {
          averageRate: { $avg: "$ratings" },
        },
      },
    ]);

    console.log();
    return res.status(200).json({
      message: `Gotten ${professorsWithRatings.length} Professors Successfully with Ratings and Average Rate`,
      data: professorsWithRatings,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while getting all Prof",
      data: error,
    });
  }
};

//delete profs
export const deleteProf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Prof = await Professor.findByIdAndDelete(req.params.profID);

  if (!Prof) {
    next(
      new AppError({
        message: "An error occurred in deleting this prof",
        httpCode: HttpCode.FORBIDDEN,
      })
    );
  }

  return res.status(HttpCode.OK).json({
    message: "Successfully deleted the Prof",
  });
};

export async function getRating(professorID: string) {
  const aggregateResult = await Rating.aggregate([
    {
      $match: { professorID },
    },

    {
      $group: {
        _id: "$professorID",
        totalRating: { $sum: "$rating" },
        averageRating: { $avg: "$rating" },
        raters: { $push: "$userID" },
        comments: { $push: "$comments" },
        rating: { $push: "$rating" },
        difficulty: { $push: "$difficulty" },
        averDifficulty: { $avg: "$difficulty" },
        totalDifficulty: { $sum: "$difficulty" },
      },
    },
  ]);

  if (aggregateResult.length === 0) {
    // Professor has no ratings yet
    return {
      totalRating: 0,
      averageRating: 0,
      raters: [],
      comments: [],
      rating: [],
      difficulty: [],
      averDifficulty: 0,
      totalDifficulty: 0,
    };
  }

  return aggregateResult[0];
}

export const getProfessorRatings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { professorID } = req.params;

    const rating = await getRating(professorID);
    return res.status(200).json(rating);
  } catch (error: any) {
    return res.status(500).json(error);
  }
};
