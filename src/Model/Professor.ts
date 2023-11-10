import mongoose, { Schema } from "mongoose";
import { IProf } from "../interfaces/Professor";

const ProfSchema: Schema<IProf> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    Title: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Professional_Department: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: true,
    },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    difficulty: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
  },

  { timestamps: true }
);

const Professor = mongoose.model<IProf>("Prof", ProfSchema);
export default Professor;
