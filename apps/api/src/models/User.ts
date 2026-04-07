import mongoose, { Schema, type Document } from "mongoose";
import { PlanType, UserRole } from "@t2f/shared-types";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  plan: PlanType;
  settings: {
    tailwindConfig?: string;
    figmaApiKey?: string;
    preserveMargins: boolean;
    experimentalAutoLayout: boolean;
    mapDesignTokens: boolean;
    autoLayoutStrict: boolean;
  };
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    plan: {
      type: String,
      enum: Object.values(PlanType),
      default: PlanType.HOBBY,
    },
    settings: {
      tailwindConfig: { type: String, default: "" },
      figmaApiKey: { type: String, default: "" },
      preserveMargins: { type: Boolean, default: true },
      experimentalAutoLayout: { type: Boolean, default: false },
      mapDesignTokens: { type: Boolean, default: true },
      autoLayoutStrict: { type: Boolean, default: true },
    },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
