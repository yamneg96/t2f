import mongoose, { Schema, type Document } from "mongoose";
import { SourceType, ConversionStatus } from "@t2f/shared-types";

export interface IConversion extends Document {
  userId: mongoose.Types.ObjectId;
  html: string;
  ir: Record<string, unknown> | null;
  source: SourceType;
  sourceLabel: string;
  status: ConversionStatus;
  latencyMs: number;
  nodeCount: number;
  warnings: string[];
  viewport: { width: number; height: number };
  createdAt: Date;
  updatedAt: Date;
}

const conversionSchema = new Schema<IConversion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    html: { type: String, required: true },
    ir: { type: Schema.Types.Mixed, default: null },
    source: {
      type: String,
      enum: Object.values(SourceType),
      required: true,
    },
    sourceLabel: { type: String, default: "Pasted HTML" },
    status: {
      type: String,
      enum: Object.values(ConversionStatus),
      default: ConversionStatus.PENDING,
    },
    latencyMs: { type: Number, default: 0 },
    nodeCount: { type: Number, default: 0 },
    warnings: [{ type: String }],
    viewport: {
      width: { type: Number, default: 1440 },
      height: { type: Number, default: 900 },
    },
  },
  { timestamps: true }
);

conversionSchema.index({ createdAt: -1 });

export const Conversion = mongoose.model<IConversion>(
  "Conversion",
  conversionSchema
);
