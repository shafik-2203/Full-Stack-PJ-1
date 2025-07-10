// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// ✅ Debugging .env loading
console.log("🧪 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🧪 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

// Routes
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import orderRoutes from "./routes/orders.js";
import otpRoutes from "./routes/otp.js";
import userRoutes from "./routes/users.js";

// Initialize app
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Health check route
app.get("/health", async (req, res) => {
  try {
    const dbConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
      success: true,
      status: "healthy",
      database: dbConnected ? "MongoDB Connected" : "Database Offline",
      mode: process.env.NODE_ENV || "development",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: "error",
      message: "Health check failed",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

export function createServer() {
  return app;
}
