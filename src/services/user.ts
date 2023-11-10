import { Request, Response, NextFunction, RequestHandler } from "express";
import { SignOptions, Secret } from "jsonwebtoken";
import User from "../Model/User";
import Token from "../Model/Token";
import envVariable from "../config/envVariable";
import { verifyUserEmail } from "../utils/emailConfig";
import { AppError, HttpCode } from "../utils/AppError";
import Professor from "../Model/Professor";
import Rating from "../Model/Rating";

export const registerService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, school, password } = req.body || {};
  //

  const checkUserRegistered = await User.findOne({ email });
  if (
    checkUserRegistered?.isVerified === true &&
    checkUserRegistered.status === "active"
  ) {
    return res
      .status(400)
      .json({ message: "You already registered, proceed to login" });
  }
  const newUser = new User({ email, name, school, password });
  const user = await newUser.save();

  let token = new Token({ userID: user._id });

  const payload = {
    userID: user._id,
  };

  const accessTokenSecretKey = envVariable.ACCESS_TOKEN_SECRET_KEY as Secret;
  const accessTokenOptions: SignOptions = {
    expiresIn: Number(envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME),
    issuer: envVariable.JWT_ISSUER,
    audience: String(user._id),
  };

  const refreshTokenSecretKey = envVariable.REFRESH_TOKEN_SECRET_KEY as Secret;
  const refreshTokenOptions: SignOptions = {
    expiresIn: Number(envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME),
    issuer: envVariable.JWT_ISSUER,
    audience: String(user._id),
  };

  // Generate and set verify email token
  const generateAccessToken = await token.generateToken(
    payload,
    accessTokenSecretKey,
    accessTokenOptions
  );
  const generateRefreshToken = await token.generateToken(
    payload,
    refreshTokenSecretKey,
    refreshTokenOptions
  );

  token!.refreshToken = generateRefreshToken;
  token!.accessToken = generateAccessToken;
  token = await token.save();

  const verifyEmailLink = `${envVariable.WEBSITE_URL}/${user._id}/${token.refreshToken}/sign-in`;

  //https://ratingmyprofessor.web.app/userID/token/sign-in

  // // send email for verification
  const verifyingUser = {
    email: user!.email,
    id: user!._id,
    status: user!.status,
    link: verifyEmailLink,
  };
  await verifyUserEmail(verifyingUser).then(() =>
    console.log(`Email has been sent to: ${user!.email}`)
  );

  const data = {
    user: {
      accessToken: token!.accessToken,
      refreshToken: token!.refreshToken,
    },
  };

  return res.status(201).json({
    message: `Email has been sent to: ${user!.email}`,
    data,
  });
};

export const verifyEmailService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.userID);
    if (!user)
      next(
        new AppError({
          message:
            "Email verification token is invalid or has expired. Please click on resend for verify your Email.",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    //User is already verified
    if (user!.isVerified && user!.status === "inactive") {
      return res.status(200).json({
        message: "Your email is already verified, Please Login",
      });
    }

    const emailVerificationToken = await Token.findOne({
      userID: user!._id,
      refreshToken: req.params.token,
    });

    if (!emailVerificationToken)
      next(
        new AppError({
          message: "Email verification token is invalid or has expired.",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    // Verify the user
    user!.isVerified = true;
    user!.status = "active";
    user!.verifiedDate = new Date().toDateString();
    await user!.save();
    await emailVerificationToken!.deleteOne();

    return res.status(200).json({
      status: "success",
      message:
        "Your account has been successfully verified . Please proceed to create your profile.",
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const loginService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      next(
        new AppError({
          message: "This email and password does not exist",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    const checkPassword = await user!.comparePassword(password);
    if (!checkPassword)
      next(
        new AppError({
          message: "This email and password does not exist",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    let token = await Token.findOne({ userID: user!._id });

    if (!token) {
      token = new Token({ userID: user!._id });
      token = await token.save();
    }

    // Generate access and refresh token
    const generatedAccessToken = await token!.generateToken(
      { userID: user!._id },
      envVariable.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable.JWT_ISSUER,
        audience: String(user!._id),
      }
    );
    const generatedRefreshToken = await token!.generateToken(
      { userID: user!._id },
      envVariable.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable.JWT_ISSUER,
        audience: String(user!._id),
      }
    );

    //save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    // check if user verified
    if (!user!.isVerified || user!.status === "inactive") {
      const verifyEmailLink = `${envVariable.WEBSITE_URL}/verify-email/${
        user!._id
      }/${token.refreshToken}`;
      // // send email for verification
      const verifyingUser = {
        email: user!.email,
        id: user!._id,
        status: user!.status,
        link: verifyEmailLink,
      };
      await verifyUserEmail(verifyingUser).then(() =>
        console.log(`Email has been sent to ${user!.email}`)
      );

      const data = {
        user: {
          accessToken: token!.accessToken,
          refreshToken: token!.refreshToken,
        },
      };

      return res.status(401).json({
        message:
          "Your account is not verified, a verification code has been sent to your email",
        data,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, isVerified, status, ...otherUserInfo } = user!._doc;

    const data = {
      accessToken: token!.accessToken,
      refreshToken: token!.refreshToken,
      user: otherUserInfo,
    };

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: `Gotten ${user.length} Users Successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while getting all users",
      data: error,
    });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userID = req.params;
    const user = await User.findOne(userID);

    //checking if user exist
    if (!user) {
      next(
        new AppError({
          message: "User not found",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    return res.status(HttpCode.OK).json({
      message: `Hello ${user?.name} Nice to see you again`,
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while getting all users",
      data: error,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const userID = req.params;
    const user = await User.findByIdAndDelete(req.params.userID);

    //checking if user exist
    // if (!user) {
    //   next(
    //     new AppError({
    //       message: "Not Unauthorized",
    //       httpCode: HttpCode.NOT_FOUND,
    //     })
    //   );
    // }

    return res.status(HttpCode.OK).json({
      message: "Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while deleting users",
      data: error,
    });
  }
};

export async function rateProfessor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userID, professorID } = req.params;
    const { comments, rating, course_code, difficulty } = req.body;

    const user = await User.findById(userID);
    const professor = await Professor.findOne({ userId: professorID });

    if (!user && !professor) {
      throw new Error("User or professor not found");
    }
    // check if professor was already rated by user
    const existingRating = await Rating.findOne({ userID, professorID });

    if (existingRating) {
      throw new Error("You have already rated this professor.");
    }

    const rateProf = new Rating({
      userID,
      professorID,
      comments,
      rating,
      course_code,
      difficulty,
    });
    const data = await rateProf.save();
    // console.log(data, "created");

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json(error);
  }
}
