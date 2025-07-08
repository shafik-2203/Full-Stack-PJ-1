import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "FastIO Food Delivery API",
    version: "1.0.0",
    status: "running",
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

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
});
