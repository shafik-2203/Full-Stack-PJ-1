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

// Temporary storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock users database
const mockUsers = new Map([
  [
    "fastio121299@gmail.com",
    {
      id: "admin-1",
      email: "fastio121299@gmail.com",
      name: "FastIO Admin",
      phone: "+91-9876543210",
      password: "fastio1212",
      isAdmin: true,
      isActive: true,
      isVerified: true,
      totalOrders: 0,
      totalSpent: 0,
    },
  ],
  [
    "mohamedshafik2526@gmail.com",
    {
      id: "user-1",
      email: "mohamedshafik2526@gmail.com",
      name: "Mohamed Shafik",
      phone: "+91-9876543211",
      password: "Shafik1212@",
      isAdmin: false,
      isActive: true,
      isVerified: true,
      totalOrders: 5,
      totalSpent: 2450,
    },
  ],
]);

// Mock auth routes
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = mockUsers.get(email?.toLowerCase());

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      },
      token: `token-${user.id}-${Date.now()}`,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// Mock signup route
app.post("/api/auth/signup", (req, res) => {
  const { email, password, username, mobile } = req.body;

  if (!email || !password || !username || !mobile) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const emailLower = email.toLowerCase();

  if (mockUsers.has(emailLower)) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP
  otpStorage.set(emailLower, {
    otp,
    expiry: otpExpiry,
    userData: {
      email: emailLower,
      username,
      password,
      mobile,
    },
  });

  // Log OTP for development
  console.log(`🔑 OTP for ${email}: ${otp}`);
  console.log(`🔑 Valid until: ${new Date(otpExpiry).toLocaleTimeString()}`);

  res.json({
    success: true,
    message: "OTP sent to your email. Please verify to complete registration.",
    email: emailLower,
    // In development, include OTP in response
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// Mock OTP verification route
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const emailLower = email.toLowerCase();
  const storedData = otpStorage.get(emailLower);

  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired. Please request a new one.",
    });
  }

  if (Date.now() > storedData.expiry) {
    otpStorage.delete(emailLower);
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP. Please try again.",
    });
  }

  // Create user account
  const userId = `user-${Date.now()}`;
  const newUser = {
    id: userId,
    email: emailLower,
    name: storedData.userData.username,
    phone: storedData.userData.mobile,
    password: storedData.userData.password,
    isAdmin: false,
    isActive: true,
    isVerified: true,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  };

  mockUsers.set(emailLower, newUser);
  otpStorage.delete(emailLower);

  const { password: _, ...userWithoutPassword } = newUser;

  res.json({
    success: true,
    message: "Account verified successfully. You are now logged in!",
    user: userWithoutPassword,
    token: `token-${userId}-${Date.now()}`,
  });
});

// Mock resend OTP route
app.post("/api/auth/resend-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const emailLower = email.toLowerCase();
  const storedData = otpStorage.get(emailLower);

  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: "No pending signup found for this email",
    });
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Update stored data
  storedData.otp = otp;
  storedData.expiry = otpExpiry;
  otpStorage.set(emailLower, storedData);

  // Log OTP for development
  console.log(`🔑 Resent OTP for ${email}: ${otp}`);

  res.json({
    success: true,
    message: "New OTP sent to your email",
    // In development, include OTP in response
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// Mock forgot password route
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const emailLower = email.toLowerCase();
  const user = mockUsers.get(emailLower);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email address",
    });
  }

  // Generate OTP for password reset
  const otp = generateOTP();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store password reset OTP
  otpStorage.set(`reset-${emailLower}`, {
    otp,
    expiry: otpExpiry,
    email: emailLower,
    type: "password-reset",
  });

  // Log OTP for development
  console.log(`🔑 Password reset OTP for ${email}: ${otp}`);

  res.json({
    success: true,
    message: "Password reset OTP sent to your email",
    // In development, include OTP in response
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// Mock verify forgot password OTP and reset password
app.post("/api/auth/reset-password", (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  const emailLower = email.toLowerCase();
  const resetKey = `reset-${emailLower}`;
  const storedData = otpStorage.get(resetKey);

  if (!storedData) {
    return res.status(400).json({
      success: false,
      message: "Password reset OTP not found or expired",
    });
  }

  if (Date.now() > storedData.expiry) {
    otpStorage.delete(resetKey);
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new password reset.",
    });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP. Please try again.",
    });
  }

  // Update user password
  const user = mockUsers.get(emailLower);
  if (user) {
    user.password = newPassword;
    mockUsers.set(emailLower, user);
  }

  otpStorage.delete(resetKey);

  res.json({
    success: true,
    message:
      "Password reset successfully. You can now login with your new password.",
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
