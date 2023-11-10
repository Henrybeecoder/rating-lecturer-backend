import { Document } from "mongoose";

export interface IProf extends Document {
  userId: string;
  Title: string;
  Name: string;
  Professional_Department: string;
  school: string;
  ratings: Array<any>;
  difficulty: Array<number>;
}
