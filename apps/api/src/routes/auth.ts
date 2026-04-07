import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { UserRole, PlanType } from "@t2f/shared-types";
import { validate } from "../middleware/validate.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── POST /api/auth/signup ────────────────────────────
router.post("/signup", validate(signupSchema), async (req, res) => {
  try {
    const { fullName, email, password } = req.body as z.infer<typeof signupSchema>;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Conflict", message: "Email already registered", statusCode: 409 });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if this is the admin email
    const isAdmin = email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      plan: PlanType.HOBBY,
    });

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          plan: user.plan,
          createdAt: user.createdAt.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create account", statusCode: 500 });
  }
});

// ── POST /api/auth/login ─────────────────────────────
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials", statusCode: 401 });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid credentials", statusCode: 401 });
      return;
    }

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          plan: user.plan,
          createdAt: user.createdAt.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Login failed", statusCode: 500 });
  }
});

// ── GET /api/auth/me ─────────────────────────────────
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    success: true,
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      plan: user.plan,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

export default router;
