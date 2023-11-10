import { Document, Types } from "mongoose";

export interface IRatings extends Document {
  comments: string;
  userID: Types.ObjectId;
  professorID: string;
  rating: number;
  course_code: string;
  difficulty: number;
}
