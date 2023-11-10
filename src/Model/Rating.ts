import { model, Schema, Document } from "mongoose";
import { IRatings } from "../interfaces/Rating";

const ratingSchema: Schema<IRatings> = new Schema(
  {
    professorID: { type: String },
    userID: { type: Schema.Types.ObjectId },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    difficulty: { type: Number, min: 1, max: 5 },
    course_code: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Rating = model<IRatings>("Rating", ratingSchema);
export default Rating;
