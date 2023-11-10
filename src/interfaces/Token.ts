import { Schema } from "mongoose";

export interface IToken {
  emailVerificationExpiresToken?: Date;
  emailVerificationToken?: string;
  resetPasswordExpires?: Date;
  resetPasswordToken?: string;
  userID: Schema.Types.ObjectId;
  accessToken?: string;
  refreshToken?: string;
}
