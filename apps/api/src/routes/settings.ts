import { Router } from "express";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

// ── GET /api/settings ────────────────────────────────
router.get("/", authenticate, async (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: req.user!.settings,
  });
});

// ── PUT /api/settings ────────────────────────────────
router.put("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const allowedFields = [
      "tailwindConfig",
      "figmaApiKey",
      "preserveMargins",
      "experimentalAutoLayout",
      "mapDesignTokens",
      "autoLayoutStrict",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[`settings.${field}`] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("settings");

    res.json({
      success: true,
      data: user?.settings,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to update settings", statusCode: 500 });
  }
});

export default router;
