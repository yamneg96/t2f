/**
 * Tailwind CSS Class Parser
 * Maps Tailwind utility classes to design tokens
 */

import type { DesignTokens, ColorToken, SpacingToken, TypographyToken } from "@t2f/shared-types";

// ── Tailwind color map (default palette) ─────────────
const TW_COLORS: Record<string, string> = {
  "slate-50": "#f8fafc", "slate-100": "#f1f5f9", "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1", "slate-400": "#94a3b8", "slate-500": "#64748b",
  "slate-600": "#475569", "slate-700": "#334155", "slate-800": "#1e293b",
  "slate-900": "#0f172a", "slate-950": "#020617",
  "gray-50": "#f9fafb", "gray-100": "#f3f4f6", "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db", "gray-400": "#9ca3af", "gray-500": "#6b7280",
  "gray-600": "#4b5563", "gray-700": "#374151", "gray-800": "#1f2937",
  "gray-900": "#111827", "gray-950": "#030712",
  "red-50": "#fef2f2", "red-100": "#fee2e2", "red-400": "#f87171",
  "red-500": "#ef4444", "red-600": "#dc2626", "red-700": "#b91c1c",
  "blue-50": "#eff6ff", "blue-100": "#dbeafe", "blue-400": "#60a5fa",
  "blue-500": "#3b82f6", "blue-600": "#2563eb", "blue-700": "#1d4ed8",
  "green-50": "#f0fdf4", "green-400": "#4ade80", "green-500": "#22c55e",
  "green-600": "#16a34a",
  "yellow-50": "#fefce8", "yellow-400": "#facc15", "yellow-500": "#eab308",
  "purple-500": "#a855f7", "purple-600": "#9333ea",
  "pink-500": "#ec4899",
  "cyan-400": "#22d3ee", "cyan-500": "#06b6d4",
  "amber-500": "#f59e0b",
  "white": "#ffffff", "black": "#000000",
  "transparent": "transparent",
};

// ── Spacing scale ────────────────────────────────────
const TW_SPACING: Record<string, number> = {
  "0": 0, "0.5": 2, "1": 4, "1.5": 6, "2": 8, "2.5": 10,
  "3": 12, "3.5": 14, "4": 16, "5": 20, "6": 24, "7": 28,
  "8": 32, "9": 36, "10": 40, "11": 44, "12": 48, "14": 56,
  "16": 64, "20": 80, "24": 96, "28": 112, "32": 128,
  "36": 144, "40": 160, "44": 176, "48": 192, "52": 208,
  "56": 224, "60": 240, "64": 256, "72": 288, "80": 320, "96": 384,
  "px": 1,
};

// ── Font size ────────────────────────────────────────
const TW_FONT_SIZE: Record<string, number> = {
  "xs": 12, "sm": 14, "base": 16, "lg": 18, "xl": 20,
  "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60,
  "7xl": 72, "8xl": 96, "9xl": 128,
};

// ── Font weight ──────────────────────────────────────
const TW_FONT_WEIGHT: Record<string, number> = {
  "thin": 100, "extralight": 200, "light": 300, "normal": 400,
  "medium": 500, "semibold": 600, "bold": 700, "extrabold": 800,
  "black": 900,
};

// ── Border radius ────────────────────────────────────
const TW_BORDER_RADIUS: Record<string, number> = {
  "none": 0, "sm": 2, "": 4, "md": 6, "lg": 8, "xl": 12,
  "2xl": 16, "3xl": 24, "full": 9999,
};

/**
 * Parse an array of Tailwind classes and extract design tokens
 */
export function parseTailwindClasses(classList: string[]): {
  tokens: Partial<DesignTokens>;
  parsedProps: Record<string, unknown>;
} {
  const colors: Record<string, ColorToken> = {};
  const spacing: Record<string, SpacingToken> = {};
  const typography: Record<string, TypographyToken> = {};
  const borderRadius: Record<string, number> = {};
  const parsedProps: Record<string, unknown> = {};

  for (const cls of classList) {
    // Skip empty, variants (hover:, md:, etc.), and modifiers
    const baseCls = cls.replace(/^(hover|focus|active|group-hover|md|lg|xl|2xl|sm|dark):/, "");

    // ── Colors ──
    const bgMatch = baseCls.match(/^bg-(.+)$/);
    if (bgMatch?.[1]) {
      const colorKey = bgMatch[1];
      const resolved = resolveColor(colorKey);
      if (resolved) {
        colors[colorKey] = { value: resolved, name: colorKey };
        parsedProps["backgroundColor"] = resolved;
      }
    }

    const textColorMatch = baseCls.match(/^text-((?!xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|left|center|right|justify).+)$/);
    if (textColorMatch?.[1]) {
      const colorKey = textColorMatch[1];
      const resolved = resolveColor(colorKey);
      if (resolved) {
        colors[colorKey] = { value: resolved, name: colorKey };
        parsedProps["color"] = resolved;
      }
    }

    const borderColorMatch = baseCls.match(/^border-(.+)$/);
    if (borderColorMatch?.[1] && !["t", "r", "b", "l", "x", "y", "0", "2", "4", "8", "collapse", "separate"].includes(borderColorMatch[1])) {
      const colorKey = borderColorMatch[1];
      const resolved = resolveColor(colorKey);
      if (resolved) {
        colors[colorKey] = { value: resolved, name: colorKey };
      }
    }

    // ── Spacing (padding/margin) ──
    const paddingMatch = baseCls.match(/^(p|px|py|pt|pr|pb|pl)-(.+)$/);
    if (paddingMatch?.[2]) {
      const val = TW_SPACING[paddingMatch[2]];
      if (val !== undefined) {
        spacing[paddingMatch[2]] = { value: val, name: paddingMatch[2] };
        parsedProps[`padding_${paddingMatch[1]}`] = val;
      }
    }

    const marginMatch = baseCls.match(/^(m|mx|my|mt|mr|mb|ml)-(.+)$/);
    if (marginMatch?.[2]) {
      const val = TW_SPACING[marginMatch[2]];
      if (val !== undefined) {
        spacing[marginMatch[2]] = { value: val, name: marginMatch[2] };
      }
    }

    const gapMatch = baseCls.match(/^gap-(.+)$/);
    if (gapMatch?.[1]) {
      const val = TW_SPACING[gapMatch[1]];
      if (val !== undefined) {
        spacing[gapMatch[1]] = { value: val, name: gapMatch[1] };
        parsedProps["gap"] = val;
      }
    }

    // ── Typography ──
    const fontSizeMatch = baseCls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/);
    if (fontSizeMatch?.[1]) {
      const size = TW_FONT_SIZE[fontSizeMatch[1]];
      if (size) {
        parsedProps["fontSize"] = size;
      }
    }

    const fontWeightMatch = baseCls.match(/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/);
    if (fontWeightMatch?.[1]) {
      const weight = TW_FONT_WEIGHT[fontWeightMatch[1]];
      if (weight) {
        parsedProps["fontWeight"] = weight;
      }
    }

    // ── Border Radius ──
    const radiusMatch = baseCls.match(/^rounded(?:-(none|sm|md|lg|xl|2xl|3xl|full))?$/);
    if (radiusMatch) {
      const key = radiusMatch[1] ?? "";
      const val = TW_BORDER_RADIUS[key];
      if (val !== undefined) {
        borderRadius[key || "default"] = val;
        parsedProps["borderRadius"] = val;
      }
    }

    // ── Layout ──
    if (baseCls === "flex") parsedProps["display"] = "flex";
    if (baseCls === "grid") parsedProps["display"] = "grid";
    if (baseCls === "block") parsedProps["display"] = "block";
    if (baseCls === "inline-flex") parsedProps["display"] = "inline-flex";
    if (baseCls === "hidden") parsedProps["display"] = "none";

    if (baseCls === "flex-row") parsedProps["flexDirection"] = "row";
    if (baseCls === "flex-col") parsedProps["flexDirection"] = "column";

    if (baseCls === "items-center") parsedProps["alignItems"] = "center";
    if (baseCls === "items-start") parsedProps["alignItems"] = "flex-start";
    if (baseCls === "items-end") parsedProps["alignItems"] = "flex-end";
    if (baseCls === "items-stretch") parsedProps["alignItems"] = "stretch";

    if (baseCls === "justify-center") parsedProps["justifyContent"] = "center";
    if (baseCls === "justify-between") parsedProps["justifyContent"] = "space-between";
    if (baseCls === "justify-start") parsedProps["justifyContent"] = "flex-start";
    if (baseCls === "justify-end") parsedProps["justifyContent"] = "flex-end";

    if (baseCls === "flex-wrap") parsedProps["flexWrap"] = "wrap";

    // ── Width/Height ──
    const widthMatch = baseCls.match(/^w-(.+)$/);
    if (widthMatch?.[1]) {
      const val = TW_SPACING[widthMatch[1]];
      if (val !== undefined) parsedProps["width"] = val;
      if (widthMatch[1] === "full") parsedProps["width"] = "100%";
      if (widthMatch[1] === "screen") parsedProps["width"] = "100vw";
    }

    const heightMatch = baseCls.match(/^h-(.+)$/);
    if (heightMatch?.[1]) {
      const val = TW_SPACING[heightMatch[1]];
      if (val !== undefined) parsedProps["height"] = val;
      if (heightMatch[1] === "full") parsedProps["height"] = "100%";
      if (heightMatch[1] === "screen") parsedProps["height"] = "100vh";
    }

    // ── Opacity ──
    const opacityMatch = baseCls.match(/^opacity-(\d+)$/);
    if (opacityMatch?.[1]) {
      parsedProps["opacity"] = parseInt(opacityMatch[1]) / 100;
    }

    // ── Text alignment ──
    if (baseCls === "text-left") parsedProps["textAlign"] = "LEFT";
    if (baseCls === "text-center") parsedProps["textAlign"] = "CENTER";
    if (baseCls === "text-right") parsedProps["textAlign"] = "RIGHT";
    if (baseCls === "text-justify") parsedProps["textAlign"] = "JUSTIFY";

    // ── Position ──
    if (baseCls === "relative") parsedProps["position"] = "relative";
    if (baseCls === "absolute") parsedProps["position"] = "absolute";
    if (baseCls === "fixed") parsedProps["position"] = "fixed";
    if (baseCls === "sticky") parsedProps["position"] = "sticky";

    // ── Overflow ──
    if (baseCls === "overflow-hidden") parsedProps["overflow"] = "HIDDEN";
    if (baseCls === "overflow-auto" || baseCls === "overflow-scroll")
      parsedProps["overflow"] = "SCROLL";
  }

  // Build typography tokens from accumulated props
  if (parsedProps["fontSize"] || parsedProps["fontWeight"]) {
    const typoKey = classList.filter(c =>
      c.match(/^(text-(xs|sm|base|lg|xl|\d+xl)|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black))$/)
    ).join(" ");
    if (typoKey) {
      typography[typoKey] = {
        fontFamily: "Inter",
        fontSize: (parsedProps["fontSize"] as number) ?? 16,
        fontWeight: (parsedProps["fontWeight"] as number) ?? 400,
        name: typoKey,
      };
    }
  }

  return {
    tokens: { colors, spacing, typography, borderRadius },
    parsedProps,
  };
}

function resolveColor(colorKey: string): string | null {
  // Direct hex value (arbitrary value like bg-[#060e20])
  const arbMatch = colorKey.match(/^\[#([0-9a-fA-F]{3,8})\]$/);
  if (arbMatch) return `#${arbMatch[1]}`;

  // With opacity modifier (e.g. blue-500/60)
  const opacityMatch = colorKey.match(/^(.+)\/(\d+)$/);
  if (opacityMatch?.[1]) {
    const base = TW_COLORS[opacityMatch[1]];
    if (base) return base;
  }

  return TW_COLORS[colorKey] ?? null;
}

export { TW_COLORS, TW_SPACING, TW_FONT_SIZE, TW_FONT_WEIGHT };
