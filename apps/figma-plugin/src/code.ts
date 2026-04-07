/**
 * Tailwind2Figma — Figma Plugin Main Thread
 *
 * Receives IR JSON from the UI iframe and creates corresponding
 * Figma nodes with Auto Layout, styles, and design tokens.
 */

// ── Types ───────────────────────────────────────────────

interface DesignNode {
  type: "FRAME" | "TEXT" | "RECTANGLE" | "IMAGE" | "VECTOR" | "GROUP";
  name?: string;
  layout?: {
    mode: "FLEX" | "GRID" | "NONE";
    direction?: "HORIZONTAL" | "VERTICAL";
    gap?: number;
    padding?: { top: number; right: number; bottom: number; left: number };
    justifyContent?: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
    alignItems?: "MIN" | "CENTER" | "MAX" | "STRETCH";
    wrap?: boolean;
  };
  position?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    positionType?: "RELATIVE" | "ABSOLUTE";
  };
  style?: {
    fills?: Array<{ type: "SOLID" | "IMAGE"; color?: string; imageRef?: string; opacity?: number }>;
    strokes?: Array<{ color: string; weight: number }>;
    borderRadius?: number | { tl: number; tr: number; br: number; bl: number };
    opacity?: number;
    shadow?: Array<{ x: number; y: number; blur: number; spread: number; color: string }>;
  };
  content?: {
    text?: string;
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
    textAlign?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
    lineHeight?: number;
    letterSpacing?: number;
    color?: string;
  };
  children?: DesignNode[];
}

interface T2F_IR {
  version: string;
  meta: { source: string; viewport: { width: number; height: number }; generatedAt: string };
  tokens: {
    colors?: Record<string, { value: string }>;
    spacing?: Record<string, number>;
    typography?: Record<string, { fontSize: number; fontWeight: number; fontFamily: string }>;
  };
  nodes: DesignNode[];
}

// ── Helpers ─────────────────────────────────────────────

function hexToRgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r, g, b };
}

function applyFills(node: GeometryMixin, fills: DesignNode["style"]["fills"]) {
  if (!fills || fills.length === 0) return;

  const paints: Paint[] = [];
  for (const fill of fills) {
    if (fill.type === "SOLID" && fill.color) {
      paints.push({
        type: "SOLID",
        color: hexToRgb(fill.color),
        opacity: fill.opacity ?? 1,
      });
    }
  }
  if (paints.length > 0) {
    node.fills = paints;
  }
}

function applyBorderRadius(node: RectangleCornerMixin, radius: DesignNode["style"]["borderRadius"]) {
  if (typeof radius === "number") {
    node.cornerRadius = radius;
  } else if (radius) {
    node.topLeftRadius = radius.tl;
    node.topRightRadius = radius.tr;
    node.bottomRightRadius = radius.br;
    node.bottomLeftRadius = radius.bl;
  }
}

// ── Node Creation ───────────────────────────────────────

async function createFigmaNode(
  designNode: DesignNode,
  parent: FrameNode | PageNode | GroupNode
): Promise<SceneNode | null> {
  let figmaNode: SceneNode | null = null;

  switch (designNode.type) {
    case "FRAME":
    case "GROUP": {
      const frame = figma.createFrame();
      frame.name = designNode.name || "Frame";

      // Auto Layout
      if (designNode.layout && designNode.layout.mode === "FLEX") {
        frame.layoutMode = designNode.layout.direction === "HORIZONTAL" ? "HORIZONTAL" : "VERTICAL";
        if (designNode.layout.gap != null) frame.itemSpacing = designNode.layout.gap;
        if (designNode.layout.padding) {
          frame.paddingTop = designNode.layout.padding.top;
          frame.paddingRight = designNode.layout.padding.right;
          frame.paddingBottom = designNode.layout.padding.bottom;
          frame.paddingLeft = designNode.layout.padding.left;
        }
        if (designNode.layout.justifyContent) {
          frame.primaryAxisAlignItems = designNode.layout.justifyContent;
        }
        if (designNode.layout.alignItems) {
          frame.counterAxisAlignItems = designNode.layout.alignItems === "STRETCH"
            ? "STRETCH"
            : designNode.layout.alignItems;
        }
        if (designNode.layout.wrap) {
          frame.layoutWrap = "WRAP";
        }
      } else {
        frame.layoutMode = "NONE";
      }

      // Sizing
      if (designNode.position?.width) frame.resize(designNode.position.width, designNode.position.height || 100);
      if (designNode.position?.positionType === "ABSOLUTE" && designNode.position.x != null) {
        frame.x = designNode.position.x;
        frame.y = designNode.position.y || 0;
      }

      // Style
      if (designNode.style) {
        applyFills(frame, designNode.style.fills);
        applyBorderRadius(frame, designNode.style.borderRadius);
        if (designNode.style.opacity != null) frame.opacity = designNode.style.opacity;
      }

      parent.appendChild(frame);

      // Recurse for children
      if (designNode.children) {
        for (const child of designNode.children) {
          await createFigmaNode(child, frame);
        }
      }

      figmaNode = frame;
      break;
    }

    case "TEXT": {
      const text = figma.createText();
      text.name = designNode.name || "Text";

      // Load font
      const fontFamily = designNode.content?.fontFamily || "Inter";
      const fontStyle = (designNode.content?.fontWeight || 400) >= 700 ? "Bold" : "Regular";
      try {
        await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
      } catch {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      }

      text.characters = designNode.content?.text || "";
      if (designNode.content?.fontSize) text.fontSize = designNode.content.fontSize;
      if (designNode.content?.textAlign) {
        const alignMap: Record<string, TextNode["textAlignHorizontal"]> = {
          LEFT: "LEFT", CENTER: "CENTER", RIGHT: "RIGHT", JUSTIFIED: "JUSTIFIED",
        };
        text.textAlignHorizontal = alignMap[designNode.content.textAlign] || "LEFT";
      }
      if (designNode.content?.lineHeight) {
        text.lineHeight = { value: designNode.content.lineHeight, unit: "PIXELS" };
      }

      // Text color
      if (designNode.content?.color) {
        text.fills = [{ type: "SOLID", color: hexToRgb(designNode.content.color) }];
      } else if (designNode.style?.fills) {
        applyFills(text, designNode.style.fills);
      }

      // Position
      if (designNode.position?.x != null) text.x = designNode.position.x;
      if (designNode.position?.y != null) text.y = designNode.position.y;

      parent.appendChild(text);
      figmaNode = text;
      break;
    }

    case "RECTANGLE": {
      const rect = figma.createRectangle();
      rect.name = designNode.name || "Rectangle";

      if (designNode.position?.width) rect.resize(designNode.position.width, designNode.position.height || 100);
      if (designNode.position?.x != null) rect.x = designNode.position.x;
      if (designNode.position?.y != null) rect.y = designNode.position.y;

      if (designNode.style) {
        applyFills(rect, designNode.style.fills);
        applyBorderRadius(rect, designNode.style.borderRadius);
        if (designNode.style.opacity != null) rect.opacity = designNode.style.opacity;
        if (designNode.style.strokes) {
          rect.strokes = designNode.style.strokes.map((s) => ({
            type: "SOLID" as const,
            color: hexToRgb(s.color),
          }));
          if (designNode.style.strokes[0]) {
            rect.strokeWeight = designNode.style.strokes[0].weight;
          }
        }
      }

      parent.appendChild(rect);
      figmaNode = rect;
      break;
    }

    case "IMAGE": {
      const imageRect = figma.createRectangle();
      imageRect.name = designNode.name || "Image";
      if (designNode.position?.width) imageRect.resize(designNode.position.width, designNode.position.height || 100);
      if (designNode.position?.x != null) imageRect.x = designNode.position.x;
      if (designNode.position?.y != null) imageRect.y = designNode.position.y;

      // If there's an image reference, try to load it
      const imageRef = designNode.style?.fills?.find((f) => f.type === "IMAGE")?.imageRef;
      if (imageRef) {
        try {
          const image = figma.createImage(new Uint8Array()); // Placeholder — real impl fetches from asset registry
          imageRect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: image.hash }];
        } catch {
          imageRect.fills = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
        }
      }

      parent.appendChild(imageRect);
      figmaNode = imageRect;
      break;
    }

    case "VECTOR": {
      // Placeholder: create a rectangle as vector fallback
      const vecRect = figma.createRectangle();
      vecRect.name = designNode.name || "Vector";
      if (designNode.position?.width) vecRect.resize(designNode.position.width, designNode.position.height || 100);
      parent.appendChild(vecRect);
      figmaNode = vecRect;
      break;
    }
  }

  return figmaNode;
}

// ── Token Creation ──────────────────────────────────────

function createColorStyles(tokens: T2F_IR["tokens"]) {
  if (!tokens.colors) return;

  for (const [name, token] of Object.entries(tokens.colors)) {
    const style = figma.createPaintStyle();
    style.name = `T2F/${name}`;
    style.paints = [{ type: "SOLID", color: hexToRgb(token.value) }];
  }
}

// ── Main Entry ──────────────────────────────────────────

figma.showUI(__html__, { width: 480, height: 560 });

figma.ui.onmessage = async (msg: { type: string; ir?: T2F_IR }) => {
  if (msg.type === "import-ir" && msg.ir) {
    const ir = msg.ir;

    figma.notify("⏳ Generating Figma design from IR...", { timeout: 3000 });

    // Create color styles from tokens
    createColorStyles(ir.tokens);

    // Create root frame
    const rootFrame = figma.createFrame();
    rootFrame.name = "T2F Import";
    rootFrame.layoutMode = "VERTICAL";
    rootFrame.resize(ir.meta.viewport.width, ir.meta.viewport.height);
    rootFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];

    // Build node tree
    for (const node of ir.nodes) {
      await createFigmaNode(node, rootFrame);
    }

    // Focus on result
    figma.currentPage.appendChild(rootFrame);
    figma.currentPage.selection = [rootFrame];
    figma.viewport.scrollAndZoomIntoView([rootFrame]);

    figma.notify("✅ Design imported successfully!", { timeout: 3000 });
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
