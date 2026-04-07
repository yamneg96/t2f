import { Router } from "express";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { Conversion } from "../models/Conversion.js";

const router = Router();

// ── GET /api/history ─────────────────────────────────
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 12));
    const skip = (page - 1) * pageSize;

    const [records, total] = await Promise.all([
      Conversion.find({ userId: req.user!._id })
        .select("-html -ir")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Conversion.countDocuments({ userId: req.user!._id }),
    ]);

    res.json({
      success: true,
      data: {
        records: records.map((r) => ({
          id: r._id,
          source: r.source,
          sourceLabel: r.sourceLabel,
          status: r.status,
          latencyMs: r.latencyMs,
          nodeCount: r.nodeCount,
          createdAt: r.createdAt.toISOString(),
        })),
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error("History list error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch history", statusCode: 500 });
  }
});

// ── GET /api/history/:id ─────────────────────────────
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const conversion = await Conversion.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    }).lean();

    if (!conversion) {
      res.status(404).json({ error: "Not Found", message: "Conversion not found", statusCode: 404 });
      return;
    }

    res.json({
      success: true,
      data: {
        record: {
          id: conversion._id,
          source: conversion.source,
          sourceLabel: conversion.sourceLabel,
          status: conversion.status,
          latencyMs: conversion.latencyMs,
          nodeCount: conversion.nodeCount,
          createdAt: conversion.createdAt.toISOString(),
        },
        ir: conversion.ir,
        html: conversion.html,
      },
    });
  } catch (error) {
    console.error("History detail error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch conversion", statusCode: 500 });
  }
});

export default router;
