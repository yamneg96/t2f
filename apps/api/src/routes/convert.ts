import { Router } from "express";
import { z } from "zod";
import { SourceType, ConversionStatus } from "@t2f/shared-types";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Conversion } from "../models/Conversion.js";
import { sanitizeHTML } from "../services/sanitizer.js";
import { renderAndExtract } from "../services/renderer.js";
import { buildIR } from "../services/irBuilder.js";

const router = Router();

const convertSchema = z.object({
  html: z.string().min(1, "HTML content is required"),
  source: z.nativeEnum(SourceType).default(SourceType.HTML),
  sourceLabel: z.string().optional(),
  viewport: z
    .object({
      width: z.number().min(320).max(3840).default(1440),
      height: z.number().min(240).max(2160).default(900),
    })
    .optional(),
});

// ── POST /api/convert ────────────────────────────────
router.post("/", authenticate, validate(convertSchema), async (req: AuthRequest, res) => {
  const startTime = Date.now();

  try {
    const { html, source, sourceLabel, viewport } = req.body as z.infer<typeof convertSchema>;
    const vp = viewport ?? { width: 1440, height: 900 };

    // Create pending conversion record
    const conversion = await Conversion.create({
      userId: req.user!._id,
      html,
      source,
      sourceLabel: sourceLabel ?? (source === SourceType.URL ? html : "Pasted HTML"),
      status: ConversionStatus.PROCESSING,
      viewport: vp,
    });

    // Sanitize
    const sanitized = sanitizeHTML(html);

    // Render and extract via worker (or fallback)
    const { elements } = await renderAndExtract(sanitized, vp);

    // Build IR
    const ir = buildIR(elements, source, vp);

    const latencyMs = Date.now() - startTime;

    // Update conversion with results
    conversion.ir = ir as unknown as Record<string, unknown>;
    conversion.status = ConversionStatus.SUCCESS;
    conversion.latencyMs = latencyMs;
    conversion.nodeCount = ir.meta.nodeCount ?? 0;
    conversion.warnings = [];

    // Collect warnings from all nodes
    const collectWarnings = (nodes: typeof ir.nodes) => {
      for (const node of nodes) {
        if (node.meta?.warnings) {
          conversion.warnings.push(...node.meta.warnings);
        }
        if (node.children) collectWarnings(node.children);
      }
    };
    collectWarnings(ir.nodes);

    await conversion.save();

    res.json({
      success: true,
      data: {
        id: conversion._id,
        status: conversion.status,
        ir,
        warnings: conversion.warnings,
        processingTimeMs: latencyMs,
        createdAt: conversion.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);

    res.status(500).json({
      error: "Conversion Failed",
      message: (error as Error).message,
      statusCode: 500,
    });
  }
});

export default router;
