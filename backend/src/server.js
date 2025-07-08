import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose"; // MongoDB connection
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import otpRoutes from "./routes/otp.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the server if MongoDB connection fails
  }
};

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(helmet());
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
    "https://fsd-project1-frontend.netlify.app/",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🍽️ FASTIO API Server is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      restaurants: "/api/restaurants",
      users: "/api/user",
      orders: "/api/orders",
    },
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

// OTP routes
app.use("/api/otp", otpRoutes);

// Seed database with sample data
const seedDatabase = async () => {
  try {
    const Restaurant = (await import("./models/Restaurant.js")).default;
    const MenuItem = (await import("./models/MenuItem.js")).default;

    // Check if data exists
    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database with sample data...");

    // Create sample restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizza Palace",
        description: "Authentic Italian pizzas made with fresh ingredients",
        category: "Italian",
        rating: 4.5,
        deliveryTime: "25-35 min",
        deliveryFee: 49,
        minimumOrder: 199,
        location: {
          address: "123 Food Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
        },
        contact: {
          phone: "+91 9876543210",
          email: "info@pizzapalace.com",
        },
        timings: {
          open: "10:00",
          close: "23:00",
        },
        features: ["Pure Veg", "Home Delivery", "Card Payment"],
      },
      {
        name: "Burger Hub",
        description: "Gourmet burgers and crispy fries",
        category: "American",
        rating: 4.2,
        deliveryTime: "20-30 min",
        deliveryFee: 29,
        minimumOrder: 149,
        location: {
          address: "456 Fast Lane",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
        },
        contact: {
          phone: "+91 9876543211",
          email: "info@burgerhub.com",
        },
        timings: {
          open: "11:00",
          close: "24:00",
        },
        features: ["Home Delivery", "Takeaway", "Cash Payment"],
      },
      {
        name: "Sushi Express",
        description: "Fresh sushi and Japanese cuisine",
        category: "Japanese",
        rating: 4.7,
        deliveryTime: "30-40 min",
        deliveryFee: 59,
        minimumOrder: 299,
        location: {
          address: "789 Sushi Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400003",
        },
        contact: {
          phone: "+91 9876543212",
          email: "info@sushiexpress.com",
        },
        timings: {
          open: "12:00",
          close: "22:00",
        },
        features: ["Home Delivery", "Card Payment"],
      },
    ]);

    // Create sample menu items
    const menuItems = [
      // Pizza Palace items
      {
        name: "Margherita Pizza",
        description: "Classic tomato, mozzarella, and basil",
        price: 299,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        isVeg: true,
      },
      {
        name: "Pepperoni Pizza",
        description: "Pepperoni with mozzarella cheese",
        price: 399,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        isVeg: false,
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine with caesar dressing",
        price: 199,
        category: "Salad",
        restaurant: restaurants[0]._id,
        isVeg: true,
      },

      // Burger Hub items
      {
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, onion",
        price: 249,
        category: "Burger",
        restaurant: restaurants[1]._id,
        isVeg: false,
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken breast with avocado",
        price: 279,
        category: "Burger",
        restaurant: restaurants[1]._id,
        isVeg: false,
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 99,
        category: "Snacks",
        restaurant: restaurants[1]._id,
        isVeg: true,
      },

      // Sushi Express items
      {
        name: "California Roll",
        description: "Crab, avocado, cucumber",
        price: 399,
        category: "Sushi",
        restaurant: restaurants[2]._id,
        isVeg: false,
      },
      {
        name: "Salmon Sashimi",
        description: "Fresh salmon slices",
        price: 599,
        category: "Sashimi",
        restaurant: restaurants[2]._id,
        isVeg: false,
      },
      {
        name: "Miso Soup",
        description: "Traditional soybean soup",
        price: 149,
        category: "Soup",
        restaurant: restaurants[2]._id,
        isVeg: true,
      },
    ];

    await MenuItem.insertMany(menuItems);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Database seeding error:", error);
  }
};

// Seed database after connection
setTimeout(seedDatabase, 2000);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FASTIO API Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API docs: http://localhost:${PORT}/api`);
});

export default app;
