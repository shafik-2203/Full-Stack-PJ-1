import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.CORS_ORIGIN, "https://your-frontend.netlify.app"]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
}

app.get("/", (req, res) => {
  res.json({
    message: "FastIO Food Delivery API",
    version: "1.0.0",
    status: "running",
  });
});

// Health check endpoint for deployment
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mock auth route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Check admin credentials
  if (email === "fastio121299@gmail.com" && password === "fastio1212") {
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: "admin-1",
        email: email,
        name: "FastIO Admin",
        phone: "+91-9876543210",
        isAdmin: true,
        isActive: true,
        lastLogin: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
      },
      token: "admin-token-123",
    });
  }

  // Check user credentials
  if (email === "mohamedshafik2526@gmail.com" && password === "Shafik1212@") {
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: "user-1",
        email: email,
        name: "Mohamed Shafik",
        phone: "+91-9876543211",
        isAdmin: false,
        isActive: true,
        lastLogin: new Date().toISOString(),
        totalOrders: 5,
        totalSpent: 2450,
      },
      token: "user-token-123",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// Mock admin dashboard stats
app.get("/api/admin/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: 2,
      totalRestaurants: 4,
      totalOrders: 3,
      totalRevenue: 1435.6,
      pendingSignups: 2,
      activeRestaurants: 3,
    },
  });
});

// Mock users endpoint
app.get("/api/admin/users", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "user-1",
        email: "mohamedshafik2526@gmail.com",
        name: "Mohamed Shafik",
        phone: "+91-9876543211",
        isAdmin: false,
        isActive: true,
        lastLogin: new Date().toISOString(),
        totalOrders: 5,
        totalSpent: 2450,
      },
    ],
  });
});

// Mock restaurants endpoint
app.get("/api/admin/restaurants", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "rest-1",
        name: "Pizza Palace",
        email: "pizza@example.com",
        phone: "+91-9876543212",
        address: {
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
        },
        cuisine: ["Italian", "American"],
        description: "Authentic Italian pizzas",
        image: "",
        rating: 4.5,
        totalReviews: 125,
        status: "Active",
        deliveryTime: { min: 25, max: 35 },
        deliveryFee: 40,
        minimumOrder: 200,
        totalOrders: 1250,
        totalRevenue: 125000,
        isVerified: true,
      },
    ],
  });
});

// Mock food items endpoint
app.get("/api/admin/food-items", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "food-1",
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes",
        price: 299,
        category: "Main Course",
        restaurant: { _id: "rest-1", name: "Pizza Palace" },
        image: "",
        ingredients: ["Tomatoes", "Mozzarella"],
        allergens: [],
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: "Mild",
        isAvailable: true,
        preparationTime: 20,
        rating: 4.6,
        totalOrders: 245,
        emoji: "🍕",
      },
    ],
  });
});

// Mock orders endpoint
app.get("/api/admin/orders", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "order-1",
        orderId: "ORD-001",
        user: {
          _id: "user-1",
          name: "Mohamed Shafik",
          email: "mohamedshafik2526@gmail.com",
        },
        restaurant: { _id: "rest-1", name: "Pizza Palace" },
        items: [],
        subtotal: 598,
        tax: 59.8,
        deliveryFee: 40,
        total: 697.8,
        status: "Delivered",
        paymentStatus: "Completed",
        paymentMethod: "UPI",
        deliveryAddress: {
          street: "123 User St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400005",
          phone: "+91-9876543211",
        },
        estimatedDeliveryTime: new Date().toISOString(),
        actualDeliveryTime: new Date().toISOString(),
        notes: "",
        rating: 5,
        review: "Excellent!",
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// Mock payments endpoint
app.get("/api/admin/payments", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "pay-1",
        transactionId: "TXN-001",
        order: { _id: "order-1", orderId: "ORD-001", total: 697.8 },
        user: {
          _id: "user-1",
          name: "Mohamed Shafik",
          email: "mohamedshafik2526@gmail.com",
        },
        amount: 697.8,
        method: "UPI",
        status: "Completed",
        gateway: "PhonePe",
        gatewayTransactionId: "PP123456789",
        currency: "INR",
        refundAmount: 0,
        refundReason: "",
        failureReason: "",
        processedAt: new Date().toISOString(),
        refundedAt: "",
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// Mock signup requests endpoint
app.get("/api/admin/signup-requests", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: "req-1",
        email: "john.doe@example.com",
        name: "John Doe",
        phone: "+91-9876543216",
        requestType: "User",
        status: "Pending",
        rejectionReason: "",
        processedBy: { _id: "", name: "", email: "" },
        processedAt: "",
        notes: "",
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// Mock update endpoints
app.put("/api/admin/users/:id", (req, res) => {
  res.json({ success: true, data: req.body });
});

app.put("/api/admin/restaurants/:id", (req, res) => {
  res.json({ success: true, data: req.body });
});

app.put("/api/admin/orders/:id", (req, res) => {
  res.json({ success: true, data: req.body });
});

app.put("/api/admin/signup-requests/:id", (req, res) => {
  res.json({ success: true, data: req.body });
});

// Serve React app in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// Graceful shutdown
let serverInstance = null;

process.on("SIGTERM", () => {
  console.log("🔄 SIGTERM received, shutting down gracefully");
  if (serverInstance) {
    serverInstance.close(() => {
      console.log("💀 Process terminated");
    });
  } else {
    process.exit(0);
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await connectDB();
    } else {
      // For development, try to connect but don't fail if MongoDB is not available
      try {
        await connectDB();
      } catch (dbError) {
        console.log(
          "⚠️ MongoDB not available in development mode - using mock data",
        );
      }
    }

    serverInstance = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📱 API Base URL: ${process.env.NODE_ENV === "production" ? "https://your-backend.onrender.com" : `http://localhost:${PORT}`}/api`,
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    return serverInstance;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
