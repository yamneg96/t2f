// ═══════════════════════════════════════════════════════
// API Request/Response Types
// ═══════════════════════════════════════════════════════

import type { T2F_IR } from "./ir.js";
import {
  SourceType,
  ConversionStatus,
  PlanType,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "./enums.js";

// ── Auth ─────────────────────────────────────────────

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  createdAt: string;
}

// ── Conversion ───────────────────────────────────────

export interface ConvertRequest {
  html: string;
  source: SourceType;
  viewport?: {
    width: number;
    height: number;
  };
  tailwindConfig?: string; // JSON string of custom TW config
}

export interface ConvertResponse {
  id: string;
  status: ConversionStatus;
  ir: T2F_IR | null;
  warnings?: string[];
  processingTimeMs?: number;
  createdAt: string;
}

// ── History ──────────────────────────────────────────

export interface HistoryRecord {
  id: string;
  source: SourceType;
  sourceLabel: string; // URL, filename, or "Pasted HTML"
  status: ConversionStatus;
  latencyMs: number;
  nodeCount?: number;
  createdAt: string;
}

export interface HistoryListResponse {
  records: HistoryRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface HistoryDetailResponse {
  record: HistoryRecord;
  ir: T2F_IR;
  html: string;
}

// ── Settings ─────────────────────────────────────────

export interface UserSettings {
  tailwindConfig?: string; // JSON string
  figmaApiKey?: string;
  preserveMargins: boolean;
  experimentalAutoLayout: boolean;
  mapDesignTokens: boolean;
  autoLayoutStrict: boolean;
}

// ── Checkout / Payment ───────────────────────────────

export interface CheckoutRequest {
  plan: PlanType;
  paymentMethod: PaymentMethod;
  billingCycle?: "monthly" | "annual";
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

export interface ScreenshotPaymentRequest {
  plan: PlanType;
  billingCycle: "monthly" | "annual";
  // file uploaded as multipart
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  plan: PlanType;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  screenshotUrl?: string;
  stripeSessionId?: string;
  createdAt: string;
}

export interface AdminPaymentListResponse {
  payments: PaymentRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Generic ──────────────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}
