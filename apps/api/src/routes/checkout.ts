import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PlanType, PaymentMethod, PaymentStatus } from "@t2f/shared-types";
import { authenticate, requireAdmin, type AuthRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads", "screenshots");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".png", ".jpg", ".jpeg", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

const PLAN_PRICES: Record<string, Record<string, number>> = {
  [PlanType.PRO]: { monthly: 29, annual: 199 },
  [PlanType.ENTERPRISE]: { monthly: 99, annual: 799 },
};

const checkoutSchema = z.object({
  plan: z.enum([PlanType.PRO, PlanType.ENTERPRISE]),
  billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
});

// ── POST /api/checkout/stripe ────────────────────────
router.post("/stripe", authenticate, validate(checkoutSchema), async (req: AuthRequest, res) => {
  try {
    const { plan, billingCycle } = req.body as z.infer<typeof checkoutSchema>;
    const amount = PLAN_PRICES[plan]?.[billingCycle] ?? 29;

    // Create payment record
    const payment = await Payment.create({
      userId: req.user!._id,
      userEmail: req.user!.email,
      plan,
      billingCycle,
      amount,
      paymentMethod: PaymentMethod.STRIPE,
      status: PaymentStatus.PENDING,
    });

    // In production, create a real Stripe checkout session here
    // For now, return a placeholder
    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        sessionId: `cs_test_${payment._id}`,
        url: `/success?payment_id=${payment._id}`,
        amount,
      },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Checkout failed", statusCode: 500 });
  }
});

// ── POST /api/checkout/screenshot ────────────────────
router.post("/screenshot", authenticate, upload.single("screenshot"), async (req: AuthRequest, res) => {
  try {
    const plan = req.body.plan as PlanType;
    const billingCycle = (req.body.billingCycle as string) || "monthly";

    if (!plan || ![PlanType.PRO, PlanType.ENTERPRISE].includes(plan)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid plan selected", statusCode: 400 });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Bad Request", message: "Screenshot file is required", statusCode: 400 });
      return;
    }

    const amount = PLAN_PRICES[plan]?.[billingCycle] ?? 29;

    const payment = await Payment.create({
      userId: req.user!._id,
      userEmail: req.user!.email,
      plan,
      billingCycle,
      amount,
      paymentMethod: PaymentMethod.SCREENSHOT,
      status: PaymentStatus.PENDING,
      screenshotUrl: `/uploads/screenshots/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        message: "Payment screenshot submitted for verification. You'll be notified once verified by admin.",
        status: PaymentStatus.PENDING,
      },
    });
  } catch (error) {
    console.error("Screenshot payment error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Payment submission failed", statusCode: 500 });
  }
});

// ── GET /api/checkout/payments (Admin) ───────────────
router.get("/payments", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(50, parseInt(req.query.pageSize as string) || 20);
    const status = req.query.status as string | undefined;
    const skip = (page - 1) * pageSize;

    const filter: Record<string, unknown> = {};
    if (status && Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      filter.status = status;
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Payment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { payments, total, page, pageSize },
    });
  } catch (error) {
    console.error("Admin payments list error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch payments", statusCode: 500 });
  }
});

// ── PUT /api/checkout/payments/:id/verify (Admin) ────
router.put("/payments/:id/verify", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, adminNote } = req.body as {
      status: PaymentStatus;
      adminNote?: string;
    };

    if (![PaymentStatus.VERIFIED, PaymentStatus.REJECTED].includes(status)) {
      res.status(400).json({ error: "Bad Request", message: "Status must be verified or rejected", statusCode: 400 });
      return;
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      res.status(404).json({ error: "Not Found", message: "Payment not found", statusCode: 404 });
      return;
    }

    payment.status = status;
    payment.adminNote = adminNote;
    payment.verifiedBy = req.user!._id as any;
    payment.verifiedAt = new Date();
    await payment.save();

    // If verified, upgrade user plan
    if (status === PaymentStatus.VERIFIED) {
      await User.findByIdAndUpdate(payment.userId, {
        $set: { plan: payment.plan },
      });
    }

    res.json({
      success: true,
      data: { payment, message: `Payment ${status}` },
    });
  } catch (error) {
    console.error("Admin verify error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Verification failed", statusCode: 500 });
  }
});

export default router;
