import mongoose, { Schema, type Document } from "mongoose";
import { PlanType, PaymentMethod, PaymentStatus } from "@t2f/shared-types";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  plan: PlanType;
  billingCycle: "monthly" | "annual";
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  screenshotUrl?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  adminNote?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: { type: String, required: true },
    plan: { type: String, enum: Object.values(PlanType), required: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    screenshotUrl: { type: String },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    adminNote: { type: String },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
