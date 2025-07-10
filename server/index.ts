import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { initializeDatabase } from "./database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import adminDebugRoutes from "./routes/adminDebug.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables
dotenv.config();

export function createServer() {
  // Create Express app
  const app = express();

  // Initialize MongoDB
  console.log("🚀 Starting FASTIO Server...");
  initializeDatabase();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          frameAncestors: [
            "'self'",
            "https://*.netlify.app",
            "https://*.fly.dev",
            "http://localhost:*",
          ],
        },
      },
    }),
  );
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  });

  app.use("/api/", limiter);

  // CORS configuration
  const corsOptions = {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://fastio-food-delivery.netlify.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Body parsing middleware with error handling
  app.use(
    express.json({
      limit: "10mb",
      strict: true,
      type: "application/json",
    }),
  );
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // JSON parsing error handler
  app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      console.error("🔥 JSON parsing error:", err.message);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request body",
        error: "INVALID_JSON",
      });
    }
    next(err);
  });

  // Middleware to ensure proper JSON response headers
  app.use((req: any, res: any, next: any) => {
    const originalJson = res.json;
    res.json = function (body: any) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      return originalJson.call(this, body);
    };
    next();
  });

  // Serve static files (favicon, icons, etc.) only in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
  }

  // Favicon route to prevent 404 errors
  app.get("/favicon.ico", (req, res) => {
    res.status(204).end(); // No content response
  });

  // Health check route
  app.get("/health", (req, res) => {
    const { isDatabaseConnected } = require("./database.js");
    res.json({
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: isDatabaseConnected
        ? "MongoDB Connected"
        : "Offline Mode (In-Memory Data)",
      mode: isDatabaseConnected ? "production" : "development",
    });
  });

  // Test endpoint for debugging
  app.get("/api/test", (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({
      success: true,
      message: "API is working correctly!",
      timestamp: new Date().toISOString(),
    });
  });

  // Basic route
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "🍽️ FASTIO API Server is running!",
      version: "2.0.0",
      database: "MongoDB Atlas",
      endpoints: {
        auth: "/api/auth",
        restaurants: "/api/restaurants",
      },
    });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/restaurants", restaurantRoutes);
  app.use("/api/debug", adminDebugRoutes);
  app.use("/api/admin", adminDebugRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/orders", orderRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("🔥 Express Error:", err);

    // Ensure proper JSON response headers
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    // MongoDB validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // SyntaxError (likely JSON parsing error)
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request body",
      });
    }

    // Default error
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  return app;
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    console.log(`🚀 FASTIO API Server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API docs: http://localhost:${PORT}/`);
    console.log(`🗄️ Database: MongoDB Atlas`);
    console.log(`📧 Email: Gmail SMTP configured`);
  });
}

export default createServer;
