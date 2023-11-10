import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  userID: Types.ObjectId;
  school?: string;
  isVerified?: boolean;
  verifiedDate: string;
  _doc?: any;
  status: string;
  googleID?: string;
  registrationType: string;
}
