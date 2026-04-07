// ═══════════════════════════════════════════════════════
// Shared Enums for T2F System
// ═══════════════════════════════════════════════════════

/** The type of node in the IR design tree */
export enum NodeType {
  FRAME = "FRAME",
  TEXT = "TEXT",
  RECTANGLE = "RECTANGLE",
  IMAGE = "IMAGE",
  VECTOR = "VECTOR",
  GROUP = "GROUP",
}

/** Layout mode for containers */
export enum LayoutMode {
  FLEX = "FLEX",
  GRID = "GRID",
  NONE = "NONE",
}

/** Layout direction */
export enum LayoutDirection {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

/** Primary/counter axis alignment (maps to Figma) */
export enum AlignType {
  MIN = "MIN",
  CENTER = "CENTER",
  MAX = "MAX",
  STRETCH = "STRETCH",
  SPACE_BETWEEN = "SPACE_BETWEEN",
}

/** Position type for nodes */
export enum PositionType {
  AUTO = "AUTO",
  ABSOLUTE = "ABSOLUTE",
}

/** Source type of the conversion input */
export enum SourceType {
  HTML = "html",
  URL = "url",
  FILE = "file",
}

/** Conversion status */
export enum ConversionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}

/** User subscription plan */
export enum PlanType {
  HOBBY = "hobby",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

/** Payment method */
export enum PaymentMethod {
  STRIPE = "stripe",
  SCREENSHOT = "screenshot",
}

/** Payment verification status */
export enum PaymentStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

/** User role */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
