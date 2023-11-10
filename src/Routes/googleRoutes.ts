import { Router, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../interfaces/User";
import jwt from "jsonwebtoken";
import envVariable from "../config/envVariable";
import User from "../Model/User";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:4700/api/auth/success",
    failureRedirect: "http://localhost:4700/api/auth/failure",
  })
);

router.route("/failure").get((req: Request, res: Response) => {
  return res.status(404).json({ message: "Page not Found " });
});

router.route("/success").get((req: Request, res: Response) => {
  const user = req.user as IUser;

  const payload = {
    userID: user._id,
  };

  const encryptUser = jwt.sign(payload, envVariable.TOKEN_SECRET, {
    expiresIn: envVariable.JWT_EXPIRES,
  });

  return res.status(200).json({
    message: `Welcome ${user.name}`,
    data: { user, encryptUser },
  });
});

export default router;
