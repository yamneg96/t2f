/**
 * Layout Mapper
 * Converts CSS computed layout properties to IR layout format
 */

import {
  LayoutMode,
  LayoutDirection,
  AlignType,
  PositionType,
  type LayoutProps,
  type PositionProps,
} from "@t2f/shared-types";

interface ComputedLayoutData {
  display: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gap: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  position: string;
  top: string;
  left: string;
  width: number;
  height: number;
  flexWrap: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

function parsePixelValue(val: string): number {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.round(num);
}

function mapJustifyContent(value: string): AlignType {
  switch (value) {
    case "center":
      return AlignType.CENTER;
    case "flex-end":
    case "end":
      return AlignType.MAX;
    case "space-between":
      return AlignType.SPACE_BETWEEN;
    case "flex-start":
    case "start":
    case "normal":
    default:
      return AlignType.MIN;
  }
}

function mapAlignItems(value: string): AlignType {
  switch (value) {
    case "center":
      return AlignType.CENTER;
    case "flex-end":
    case "end":
      return AlignType.MAX;
    case "stretch":
      return AlignType.STRETCH;
    case "flex-start":
    case "start":
    case "normal":
    default:
      return AlignType.MIN;
  }
}

export function computeLayout(data: ComputedLayoutData): LayoutProps {
  const isFlex = data.display === "flex" || data.display === "inline-flex";
  const isGrid = data.display === "grid" || data.display === "inline-grid";

  if (isFlex) {
    return {
      mode: LayoutMode.FLEX,
      direction:
        data.flexDirection === "column" || data.flexDirection === "column-reverse"
          ? LayoutDirection.VERTICAL
          : LayoutDirection.HORIZONTAL,
      justifyContent: mapJustifyContent(data.justifyContent),
      alignItems: mapAlignItems(data.alignItems),
      gap: parsePixelValue(data.gap),
      padding: {
        top: parsePixelValue(data.paddingTop),
        right: parsePixelValue(data.paddingRight),
        bottom: parsePixelValue(data.paddingBottom),
        left: parsePixelValue(data.paddingLeft),
      },
      wrap: data.flexWrap === "wrap" || data.flexWrap === "wrap-reverse",
    };
  }

  if (isGrid) {
    // Approximate CSS Grid as vertical flex (Figma has no grid)
    return {
      mode: LayoutMode.FLEX,
      direction: LayoutDirection.VERTICAL,
      justifyContent: AlignType.MIN,
      alignItems: AlignType.STRETCH,
      gap: parsePixelValue(data.gap),
      padding: {
        top: parsePixelValue(data.paddingTop),
        right: parsePixelValue(data.paddingRight),
        bottom: parsePixelValue(data.paddingBottom),
        left: parsePixelValue(data.paddingLeft),
      },
      wrap: false,
    };
  }

  return { mode: LayoutMode.NONE };
}

export function computePosition(data: ComputedLayoutData): PositionProps {
  const isAbsolute =
    data.position === "absolute" || data.position === "fixed";

  return {
    x: isAbsolute ? parsePixelValue(data.left) : undefined,
    y: isAbsolute ? parsePixelValue(data.top) : undefined,
    width: data.width,
    height: data.height,
    positionType: isAbsolute ? PositionType.ABSOLUTE : PositionType.AUTO,
  };
}
