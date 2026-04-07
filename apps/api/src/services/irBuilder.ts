/**
 * IR Builder
 * Builds the T2F Intermediate Representation from extracted DOM data
 */

import { v4 as uuid } from "uuid";
import {
  NodeType,
  LayoutMode,
  PositionType,
  SourceType,
  type T2F_IR,
  type DesignNode,
  type DesignTokens,
  type AssetRegistry,
  type Fill,
  type TextContent,
} from "@t2f/shared-types";
import { parseTailwindClasses } from "./tailwindParser.js";
import { computeLayout, computePosition } from "./layoutMapper.js";

/** Raw element data extracted by Playwright */
export interface ExtractedElement {
  tag: string;
  classList: string[];
  textContent: string;
  childrenCount: number;
  computedStyles: Record<string, string>;
  boundingBox: { x: number; y: number; width: number; height: number };
  children: ExtractedElement[];
  attributes: Record<string, string>;
}

/** Build a complete IR from extracted DOM elements */
export function buildIR(
  elements: ExtractedElement[],
  source: SourceType,
  viewport: { width: number; height: number }
): T2F_IR {
  const startTime = Date.now();
  const globalTokens: DesignTokens = {
    colors: {},
    spacing: {},
    typography: {},
    borderRadius: {},
  };
  const assets: AssetRegistry = { images: {} };

  const nodes = elements.map((el) =>
    buildNode(el, globalTokens, assets)
  );

  const nodeCount = countNodes(nodes);

  return {
    version: "1.0",
    meta: {
      source,
      viewport,
      generatedAt: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      nodeCount,
    },
    tokens: globalTokens,
    assets,
    nodes,
  };
}

function buildNode(
  el: ExtractedElement,
  tokens: DesignTokens,
  assets: AssetRegistry
): DesignNode {
  const { tokens: elTokens, parsedProps } = parseTailwindClasses(el.classList);

  // Merge tokens
  Object.assign(tokens.colors, elTokens.colors);
  Object.assign(tokens.spacing, elTokens.spacing);
  Object.assign(tokens.typography, elTokens.typography);
  if (elTokens.borderRadius) {
    tokens.borderRadius = { ...tokens.borderRadius, ...elTokens.borderRadius };
  }

  // Determine node type
  const nodeType = determineNodeType(el);

  // Build layout from computed styles
  const layout = computeLayout({
    display: el.computedStyles["display"] ?? "block",
    flexDirection: el.computedStyles["flex-direction"] ?? "row",
    justifyContent: el.computedStyles["justify-content"] ?? "normal",
    alignItems: el.computedStyles["align-items"] ?? "normal",
    gap: el.computedStyles["gap"] ?? "0px",
    paddingTop: el.computedStyles["padding-top"] ?? "0px",
    paddingRight: el.computedStyles["padding-right"] ?? "0px",
    paddingBottom: el.computedStyles["padding-bottom"] ?? "0px",
    paddingLeft: el.computedStyles["padding-left"] ?? "0px",
    position: el.computedStyles["position"] ?? "static",
    top: el.computedStyles["top"] ?? "0px",
    left: el.computedStyles["left"] ?? "0px",
    width: el.boundingBox.width,
    height: el.boundingBox.height,
    flexWrap: el.computedStyles["flex-wrap"] ?? "nowrap",
  });

  const position = computePosition({
    display: el.computedStyles["display"] ?? "block",
    flexDirection: el.computedStyles["flex-direction"] ?? "row",
    justifyContent: el.computedStyles["justify-content"] ?? "normal",
    alignItems: el.computedStyles["align-items"] ?? "normal",
    gap: el.computedStyles["gap"] ?? "0px",
    paddingTop: el.computedStyles["padding-top"] ?? "0px",
    paddingRight: el.computedStyles["padding-right"] ?? "0px",
    paddingBottom: el.computedStyles["padding-bottom"] ?? "0px",
    paddingLeft: el.computedStyles["padding-left"] ?? "0px",
    position: el.computedStyles["position"] ?? "static",
    top: el.computedStyles["top"] ?? "0px",
    left: el.computedStyles["left"] ?? "0px",
    width: el.boundingBox.width,
    height: el.boundingBox.height,
    flexWrap: el.computedStyles["flex-wrap"] ?? "nowrap",
  });

  // Build fills
  const fills: Fill[] = [];
  const bgColor = el.computedStyles["background-color"];
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
    fills.push({ type: "SOLID", color: rgbToHex(bgColor) });
  }

  // Build text content
  let content: TextContent | undefined;
  if (nodeType === NodeType.TEXT) {
    content = {
      text: el.textContent.trim(),
      fontSize: parseFloat(el.computedStyles["font-size"] ?? "16"),
      fontFamily: cleanFontFamily(el.computedStyles["font-family"] ?? "Inter"),
      fontWeight: parseInt(el.computedStyles["font-weight"] ?? "400"),
      textAlign: mapTextAlign(el.computedStyles["text-align"]),
      color: el.computedStyles["color"]
        ? rgbToHex(el.computedStyles["color"])
        : undefined,
    };
  }

  // Handle images
  if (nodeType === NodeType.IMAGE && el.attributes["src"]) {
    const assetId = uuid();
    assets.images[assetId] = {
      id: assetId,
      url: el.attributes["src"],
      width: el.boundingBox.width,
      height: el.boundingBox.height,
    };
    fills.push({ type: "IMAGE", assetId });
  }

  // Border radius
  const br = parseFloat(el.computedStyles["border-radius"] ?? "0");
  const borderRadius =
    br > 0
      ? { topLeft: br, topRight: br, bottomRight: br, bottomLeft: br }
      : undefined;

  // Opacity
  const opacity = parseFloat(el.computedStyles["opacity"] ?? "1");

  // Semantic naming
  const name = generateNodeName(el, nodeType);

  // Recurse children
  const children =
    nodeType === NodeType.FRAME || nodeType === NodeType.GROUP
      ? el.children.map((child) => buildNode(child, tokens, assets))
      : undefined;

  const warnings: string[] = [];
  if (
    el.computedStyles["display"] === "grid" ||
    el.computedStyles["display"] === "inline-grid"
  ) {
    warnings.push("CSS grid approximated as Auto Layout");
  }

  return {
    type: nodeType,
    id: uuid(),
    name,
    layout: layout.mode !== LayoutMode.NONE ? layout : undefined,
    position:
      position.positionType === PositionType.ABSOLUTE ? position : undefined,
    style: {
      fills: fills.length > 0 ? fills : undefined,
      borderRadius,
      opacity: opacity < 1 ? opacity : undefined,
    },
    content,
    children,
    meta: {
      sourceTag: el.tag,
      classList: el.classList.length > 0 ? el.classList : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    },
  };
}

function determineNodeType(el: ExtractedElement): NodeType {
  if (el.tag === "img" || el.tag === "svg") return NodeType.IMAGE;
  if (el.tag === "picture" || el.tag === "video") return NodeType.IMAGE;

  // Text nodes: elements with text and no children
  const textTags = [
    "p", "span", "h1", "h2", "h3", "h4", "h5", "h6",
    "a", "label", "strong", "em", "b", "i", "code", "pre",
    "li", "td", "th", "caption", "figcaption",
  ];
  if (
    textTags.includes(el.tag) &&
    el.children.length === 0 &&
    el.textContent.trim().length > 0
  ) {
    return NodeType.TEXT;
  }

  // Container / frame
  if (el.children.length > 0) return NodeType.FRAME;

  // Empty div with background → rectangle
  if (el.textContent.trim().length === 0 && el.children.length === 0) {
    return NodeType.RECTANGLE;
  }

  return NodeType.FRAME;
}

function generateNodeName(el: ExtractedElement, type: NodeType): string {
  // Use id, aria-label, or class-based name
  if (el.attributes["id"]) return el.attributes["id"];
  if (el.attributes["aria-label"]) return el.attributes["aria-label"];

  // Tag-based fallback
  const tagMap: Record<string, string> = {
    nav: "Navigation", header: "Header", footer: "Footer",
    main: "Main_Content", section: "Section", article: "Article",
    aside: "Sidebar", button: "Button", a: "Link",
    img: "Image", svg: "Vector",
  };

  const prefix = tagMap[el.tag] ?? el.tag.charAt(0).toUpperCase() + el.tag.slice(1);

  if (type === NodeType.TEXT && el.textContent.trim()) {
    const text = el.textContent.trim().slice(0, 24);
    return `${prefix}_${text.replace(/\s+/g, "_")}`;
  }

  return prefix;
}

function rgbToHex(rgb: string): string {
  // Already hex
  if (rgb.startsWith("#")) return rgb;

  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return "#000000";

  const r = parseInt(match[1]!).toString(16).padStart(2, "0");
  const g = parseInt(match[2]!).toString(16).padStart(2, "0");
  const b = parseInt(match[3]!).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

function cleanFontFamily(ff: string): string {
  return ff.split(",")[0]?.trim().replace(/['"]/g, "") ?? "Inter";
}

function mapTextAlign(
  align?: string
): "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY" {
  switch (align) {
    case "center": return "CENTER";
    case "right": return "RIGHT";
    case "justify": return "JUSTIFY";
    default: return "LEFT";
  }
}

function countNodes(nodes: DesignNode[]): number {
  let count = 0;
  for (const node of nodes) {
    count++;
    if (node.children) count += countNodes(node.children);
  }
  return count;
}
