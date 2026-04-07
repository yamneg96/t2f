// ═══════════════════════════════════════════════════════
// T2F Intermediate Representation (IR) Types
// The core abstraction between web input and Figma output
// ═══════════════════════════════════════════════════════

import {
  NodeType,
  LayoutMode,
  LayoutDirection,
  AlignType,
  PositionType,
  SourceType,
} from "./enums.js";

// ── Design Tokens ────────────────────────────────────

export interface ColorToken {
  value: string; // hex, rgb, or oklch
  name?: string; // e.g. "blue-500"
}

export interface SpacingToken {
  value: number; // in px
  name?: string; // e.g. "4" (maps to 16px)
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight?: number;
  letterSpacing?: number;
  name?: string; // e.g. "text-lg font-bold"
}

export interface DesignTokens {
  colors: Record<string, ColorToken>;
  spacing: Record<string, SpacingToken>;
  typography: Record<string, TypographyToken>;
  borderRadius?: Record<string, number>;
}

// ── Assets ───────────────────────────────────────────

export interface ImageAsset {
  id: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
  base64?: string; // for embedded images
}

export interface AssetRegistry {
  images: Record<string, ImageAsset>;
  svgs?: Record<string, string>; // raw SVG strings keyed by ID
}

// ── Fill / Stroke ────────────────────────────────────

export interface SolidFill {
  type: "SOLID";
  color: string; // hex
  opacity?: number;
  tokenRef?: string; // reference to tokens.colors key
}

export interface ImageFill {
  type: "IMAGE";
  assetId: string; // reference to assets.images key
  scaleMode?: "FILL" | "FIT" | "CROP" | "TILE";
}

export interface GradientStop {
  color: string;
  position: number; // 0-1
}

export interface GradientFill {
  type: "GRADIENT";
  gradientType: "LINEAR" | "RADIAL";
  stops: GradientStop[];
  angle?: number; // degrees for linear
}

export type Fill = SolidFill | ImageFill | GradientFill;

export interface Stroke {
  color: string;
  width: number;
  opacity?: number;
  tokenRef?: string;
}

// ── Shadow ───────────────────────────────────────────

export interface Shadow {
  type: "DROP_SHADOW" | "INNER_SHADOW";
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread?: number;
  opacity?: number;
}

// ── Layout / Position ────────────────────────────────

export interface LayoutProps {
  mode: LayoutMode;
  direction?: LayoutDirection;
  justifyContent?: AlignType;
  alignItems?: AlignType;
  gap?: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  wrap?: boolean;
}

export interface PositionProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  positionType: PositionType;
}

// ── Style Props ──────────────────────────────────────

export interface StyleProps {
  fills?: Fill[];
  strokes?: Stroke[];
  borderRadius?: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
  opacity?: number;
  shadows?: Shadow[];
  overflow?: "VISIBLE" | "HIDDEN" | "SCROLL";
}

// ── Text Content ─────────────────────────────────────

export interface TextContent {
  text: string;
  typographyTokenRef?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
  colorTokenRef?: string;
}

// ── Constraints ──────────────────────────────────────

export interface Constraints {
  horizontal?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE";
  vertical?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE";
}

// ── Debug Meta ───────────────────────────────────────

export interface NodeMeta {
  sourceTag?: string; // e.g. "div", "span", "button"
  classList?: string[]; // original Tailwind classes
  computedStyles?: Record<string, string>; // raw CSS for debugging
  warnings?: string[];
}

// ── Design Node (the tree node) ──────────────────────

export interface DesignNode {
  type: NodeType;
  id: string;
  name: string;
  layout?: LayoutProps;
  position?: PositionProps;
  style?: StyleProps;
  content?: TextContent;
  children?: DesignNode[];
  constraints?: Constraints;
  meta?: NodeMeta;
}

// ── Root IR Document ─────────────────────────────────

export interface T2F_IR {
  version: "1.0";
  meta: {
    source: SourceType;
    viewport: {
      width: number;
      height: number;
    };
    generatedAt: string; // ISO 8601
    processingTimeMs?: number;
    nodeCount?: number;
  };
  tokens: DesignTokens;
  assets: AssetRegistry;
  nodes: DesignNode[];
}
