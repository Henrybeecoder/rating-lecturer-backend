import { model, Schema, Document } from "mongoose";
import { ISchool } from "../interfaces/School";

const SchoolSchema: Schema<ISchool> = new Schema(
  {
    schoolName: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const School = model<ISchool>("Schools", SchoolSchema);
export default School;
