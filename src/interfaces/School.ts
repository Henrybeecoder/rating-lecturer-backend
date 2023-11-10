import { Document, Types } from "mongoose";

export interface ISchool extends Document {
  schoolName: string;
}
