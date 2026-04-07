/**
 * Renderer Service
 * Sends HTML to the render worker (Playwright) for style extraction
 * Falls back to a simplified DOM parser if the worker is unavailable
 */

import { env } from "../config/env.js";
import type { ExtractedElement } from "./irBuilder.js";

interface RenderResult {
  elements: ExtractedElement[];
  viewport: { width: number; height: number };
}

/**
 * Render HTML and extract computed styles via the render worker
 */
export async function renderAndExtract(
  html: string,
  viewport = { width: 1440, height: 900 }
): Promise<RenderResult> {
  try {
    // Try the render worker first
    const response = await fetch(`${env.RENDER_WORKER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, viewport }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (response.ok) {
      const data = (await response.json()) as RenderResult;
      return data;
    }

    console.warn("⚠️  Render worker returned error, using fallback parser");
  } catch (error) {
    console.warn("⚠️  Render worker unavailable, using fallback parser:", (error as Error).message);
  }

  // Fallback: simplified HTML parsing (no Playwright)
  return fallbackParse(html, viewport);
}

/**
 * Simplified fallback parser when Playwright is unavailable.
 * Extracts basic structure from HTML string using regex-based parsing.
 * This is NOT a full replacement for Playwright but allows the system to function.
 */
function fallbackParse(
  html: string,
  viewport: { width: number; height: number }
): RenderResult {
  const elements: ExtractedElement[] = [];

  // Extract the body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch?.[1] ?? html;

  // Parse top-level elements (simplified)
  const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
  let match;
  let yOffset = 0;

  while ((match = tagRegex.exec(bodyContent)) !== null) {
    const tag = match[1]!;
    const attrs = match[2]!;
    const inner = match[3]!;

    // Skip non-visual elements
    if (["script", "style", "link", "meta", "head", "title"].includes(tag)) continue;

    const element = parseElement(tag, attrs, inner, 0, yOffset, viewport.width);
    elements.push(element);
    yOffset += element.boundingBox.height;
  }

  return { elements, viewport };
}

function parseElement(
  tag: string,
  attrString: string,
  inner: string,
  x: number,
  y: number,
  parentWidth: number
): ExtractedElement {
  const classList = extractClasses(attrString);
  const attributes = extractAttributes(attrString);

  // Rough estimate of height
  const textContent = inner.replace(/<[^>]*>/g, "").trim();
  const estimatedHeight = tag.match(/^h[1-6]$/) ? 48 : textContent ? 32 : 100;

  // Parse children
  const children: ExtractedElement[] = [];
  const childRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
  let childMatch;
  let childY = 0;

  while ((childMatch = childRegex.exec(inner)) !== null) {
    const childTag = childMatch[1]!;
    if (["script", "style", "link", "meta"].includes(childTag)) continue;

    const child = parseElement(
      childTag,
      childMatch[2]!,
      childMatch[3]!,
      0,
      childY,
      parentWidth
    );
    children.push(child);
    childY += child.boundingBox.height;
  }

  const totalHeight = children.length > 0
    ? children.reduce((sum, c) => sum + c.boundingBox.height, 0)
    : estimatedHeight;

  return {
    tag,
    classList,
    textContent,
    childrenCount: children.length,
    computedStyles: inferStylesFromClasses(classList),
    boundingBox: { x, y, width: parentWidth, height: totalHeight },
    children,
    attributes,
  };
}

function extractClasses(attrString: string): string[] {
  const match = attrString.match(/class\s*=\s*"([^"]*)"/);
  return match ? match[1]!.split(/\s+/).filter(Boolean) : [];
}

function extractAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /(\w[\w-]*)(?:\s*=\s*"([^"]*)")?/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    if (match[1] && match[2] !== undefined) {
      attrs[match[1]] = match[2];
    }
  }
  return attrs;
}

function inferStylesFromClasses(
  classList: string[]
): Record<string, string> {
  const styles: Record<string, string> = {};

  for (const cls of classList) {
    if (cls === "flex") styles["display"] = "flex";
    if (cls === "grid") styles["display"] = "grid";
    if (cls === "hidden") styles["display"] = "none";
    if (cls === "block") styles["display"] = "block";
    if (cls === "flex-col") styles["flex-direction"] = "column";
    if (cls === "flex-row") styles["flex-direction"] = "row";
    if (cls === "items-center") styles["align-items"] = "center";
    if (cls === "items-start") styles["align-items"] = "flex-start";
    if (cls === "justify-center") styles["justify-content"] = "center";
    if (cls === "justify-between") styles["justify-content"] = "space-between";
    if (cls === "flex-wrap") styles["flex-wrap"] = "wrap";
    if (cls === "absolute") styles["position"] = "absolute";
    if (cls === "relative") styles["position"] = "relative";
    if (cls === "fixed") styles["position"] = "fixed";
    if (cls === "overflow-hidden") styles["overflow"] = "hidden";

    const gapMatch = cls.match(/^gap-(\d+)$/);
    if (gapMatch) styles["gap"] = `${parseInt(gapMatch[1]!) * 4}px`;

    const paddingMatch = cls.match(/^p-(\d+)$/);
    if (paddingMatch) {
      const val = `${parseInt(paddingMatch[1]!) * 4}px`;
      styles["padding-top"] = val;
      styles["padding-right"] = val;
      styles["padding-bottom"] = val;
      styles["padding-left"] = val;
    }
  }

  return styles;
}
