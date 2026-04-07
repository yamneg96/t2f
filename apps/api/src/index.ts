import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import convertRoutes from "./routes/convert.js";
import historyRoutes from "./routes/history.js";
import settingsRoutes from "./routes/settings.js";
import checkoutRoutes from "./routes/checkout.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  // ── Middleware ────────────────────────────────────
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(morgan("dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded screenshots
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "..", "uploads"))
  );

  // ── Routes ───────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/convert", convertRoutes);
  app.use("/api/history", historyRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/checkout", checkoutRoutes);

  // ── Error Handler ────────────────────────────────
  app.use(errorHandler);

  // ── Start Server ─────────────────────────────────
  app.listen(env.PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║   🚀 T2F API Server                              ║
║   Port: ${String(env.PORT).padEnd(41)}║
║   Env:  ${env.NODE_ENV.padEnd(41)}║
║   DB:   Connected                                ║
╚═══════════════════════════════════════════════════╝
    `);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
