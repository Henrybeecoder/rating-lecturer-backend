import { Schema, model, Document, Types } from "mongoose";
import { IUser } from "../interfaces/User";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

interface IUserDocument extends Document, IUser {
  // document level operations
  comparePassword(password: string): Promise<boolean>;
}
const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true, validate: isEmail, lowercase: true },
    userID: { type: Schema.Types.ObjectId },
    school: { type: String },
    isVerified: { type: Boolean, default: false },
    verifiedDate: { type: String },
    status: { type: String, default: "inactive" },
    googleID: { type: String },
    registrationType: { type: String, default: "email and password" },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.isVerified;
        delete ret.__v;
        delete ret.status;
      },
    },
    timestamps: true,
    versionKey: false,
  }
);

// this is to encrypt the password
userSchema.pre("save", async function (next) {
  const user = this;
  console.log(`Data before save: ${JSON.stringify(user)}`);

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

// this is to compare passwords
userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = model<IUserDocument>("User", userSchema);
export default User;
