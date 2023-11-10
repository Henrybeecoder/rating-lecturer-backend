import { Response, Request, NextFunction } from "express";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import envVariable from "../config/envVariable";
import User from "../Model/User";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser<any, any>(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: envVariable.PASSPORT_CLIENTID,
      clientSecret: envVariable.PASSPORT_CLIENT_SECRET,
      callbackURL: envVariable.PASSPORT_REDIRECT,
      scope: ["email", "profile"],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      console.log({ accessToken, profile });
      const user = await User.findOne({ email: profile._json.email });

      if (!user) {
        let newUser = new User({
          name: `${profile._json.name} ${profile._json.family_name}`,
          googleID: profile.id,
          email: profile._json.email,
          isVerified: profile._json.email_verified,
          status: "active",
          registrationType: "google",
        });
        await newUser.save();
        return done(null, newUser);
      } else {
        return done(null, user);
      }
    }
  )
);

export function googleSessionMiddleware(
  req: any,
  res: Response,
  next: NextFunction
) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb: any) => {
      cb();
    };
  }

  if (req.session && !req.session.save) {
    req.session.save = (cb: any) => {
      cb();
    };
  }

  next();
}

export const sessionOptions = {
  name: `Session`,
  keys: [envVariable.SESSION_KEY],
  maxAge: 24 * 60 * 60 * 1000,
};
