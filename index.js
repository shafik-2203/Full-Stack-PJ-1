import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

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

// Database routes (will be used when database is connected)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Mock auth routes (fallback)
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

// Mock restaurants data - Expanded with more variety
const mockRestaurants = [
  {
    _id: "rest-1",
    name: "Pizza Palace",
    description:
      "Authentic Italian pizzas made with fresh ingredients and wood-fired ovens",
    category: "Italian",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: 40,
    minimumOrder: 200,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    location: {
      address: "123 Food Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
    },
    contact: {
      phone: "+91-9876543210",
      email: "info@pizzapalace.com",
    },
    timings: {
      open: "10:00",
      close: "23:00",
    },
    features: [
      "Pure Veg Options",
      "Home Delivery",
      "Card Payment",
      "Outdoor Seating",
    ],
    isActive: true,
  },
  {
    _id: "rest-2",
    name: "Burger Hub",
    description: "Gourmet burgers with premium beef patties and artisan buns",
    category: "American",
    rating: 4.2,
    deliveryTime: "20-30 min",
    deliveryFee: 30,
    minimumOrder: 150,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    location: {
      address: "456 Fast Lane, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400069",
    },
    contact: {
      phone: "+91-9876543211",
      email: "info@burgerhub.com",
    },
    timings: {
      open: "11:00",
      close: "24:00",
    },
    features: [
      "Late Night Delivery",
      "Takeaway",
      "Cash Payment",
      "Drive Through",
    ],
    isActive: true,
  },
  {
    _id: "rest-3",
    name: "Sushi Express",
    description:
      "Fresh sushi and authentic Japanese cuisine crafted by expert chefs",
    category: "Japanese",
    rating: 4.7,
    deliveryTime: "30-40 min",
    deliveryFee: 50,
    minimumOrder: 300,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    location: {
      address: "789 Sushi Street, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400013",
    },
    contact: {
      phone: "+91-9876543212",
      email: "info@sushiexpress.com",
    },
    timings: {
      open: "12:00",
      close: "22:00",
    },
    features: [
      "Premium Quality",
      "Home Delivery",
      "Card Payment",
      "Fresh Ingredients",
    ],
    isActive: true,
  },
  {
    _id: "rest-4",
    name: "Spice Garden",
    description:
      "Authentic Indian curries, biryanis and traditional dishes from across India",
    category: "Indian",
    rating: 4.3,
    deliveryTime: "35-45 min",
    deliveryFee: 35,
    minimumOrder: 180,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    location: {
      address: "321 Curry Lane, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400076",
    },
    contact: {
      phone: "+91-9876543213",
      email: "info@spicegarden.com",
    },
    timings: {
      open: "11:30",
      close: "23:30",
    },
    features: [
      "Vegetarian Options",
      "Home Delivery",
      "Online Payment",
      "Family Packs",
    ],
    isActive: true,
  },
  {
    _id: "rest-5",
    name: "Dragon Wok",
    description:
      "Authentic Chinese cuisine with traditional flavors and modern presentation",
    category: "Chinese",
    rating: 4.4,
    deliveryTime: "25-35 min",
    deliveryFee: 45,
    minimumOrder: 220,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400",
    location: {
      address: "555 Chinatown Road, Colaba",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400005",
    },
    contact: {
      phone: "+91-9876543214",
      email: "info@dragonwok.com",
    },
    timings: {
      open: "12:00",
      close: "23:00",
    },
    features: [
      "Authentic Recipes",
      "Home Delivery",
      "Group Orders",
      "Dim Sum Specials",
    ],
    isActive: true,
  },
  {
    _id: "rest-6",
    name: "Taco Fiesta",
    description:
      "Fresh Mexican street food, tacos, burritos and nachos with bold flavors",
    category: "Mexican",
    rating: 4.1,
    deliveryTime: "20-30 min",
    deliveryFee: 35,
    minimumOrder: 160,
    image: "https://images.unsplash.com/photo-1565299585323-38174c4a6663?w=400",
    location: {
      address: "777 Fiesta Street, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400049",
    },
    contact: {
      phone: "+91-9876543215",
      email: "info@tacofiesta.com",
    },
    timings: {
      open: "11:00",
      close: "24:00",
    },
    features: [
      "Spicy Food",
      "Vegetarian Options",
      "Quick Delivery",
      "Party Orders",
    ],
    isActive: true,
  },
  {
    _id: "rest-7",
    name: "Mediterranean Delights",
    description:
      "Fresh Mediterranean cuisine with healthy options, grilled meats and salads",
    category: "Mediterranean",
    rating: 4.6,
    deliveryTime: "30-40 min",
    deliveryFee: 50,
    minimumOrder: 250,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
    location: {
      address: "999 Olive Grove, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400018",
    },
    contact: {
      phone: "+91-9876543216",
      email: "info@meddelights.com",
    },
    timings: {
      open: "12:00",
      close: "22:30",
    },
    features: [
      "Healthy Options",
      "Organic Ingredients",
      "Gluten Free",
      "Keto Friendly",
    ],
    isActive: true,
  },
  {
    _id: "rest-8",
    name: "Royal Biryani House",
    description:
      "Traditional Hyderabadi and Lucknowi biryanis with authentic spices and flavors",
    category: "Indian",
    rating: 4.8,
    deliveryTime: "40-50 min",
    deliveryFee: 25,
    minimumOrder: 200,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400",
    location: {
      address: "123 Biryani Boulevard, Dadar",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400014",
    },
    contact: {
      phone: "+91-9876543217",
      email: "info@royalbiryani.com",
    },
    timings: {
      open: "11:00",
      close: "23:30",
    },
    features: [
      "Dum Biryani",
      "Family Portions",
      "Traditional Recipes",
      "Raita & Shorba",
    ],
    isActive: true,
  },
  {
    _id: "rest-9",
    name: "Healthy Bowls Co.",
    description:
      "Nutritious salad bowls, smoothies and healthy wraps for fitness enthusiasts",
    category: "Healthy",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: 25,
    minimumOrder: 120,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    location: {
      address: "456 Wellness Street, Malad",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400064",
    },
    contact: {
      phone: "+91-9876543218",
      email: "info@healthybowls.com",
    },
    timings: {
      open: "07:00",
      close: "22:00",
    },
    features: ["Low Calorie", "Protein Rich", "Vegan Options", "Meal Plans"],
    isActive: true,
  },
  {
    _id: "rest-10",
    name: "Dessert Paradise",
    description:
      "Heavenly desserts, cakes, pastries and ice creams for your sweet cravings",
    category: "Desserts",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 30,
    minimumOrder: 100,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    location: {
      address: "789 Sweet Street, Versova",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400061",
    },
    contact: {
      phone: "+91-9876543219",
      email: "info@dessertparadise.com",
    },
    timings: {
      open: "10:00",
      close: "24:00",
    },
    features: [
      "Custom Cakes",
      "Sugar Free Options",
      "Party Desserts",
      "Ice Cream Bar",
    ],
    isActive: true,
  },
];

// Restaurant endpoints
app.get("/api/restaurants", (req, res) => {
  const { query, category } = req.query;

  let filteredRestaurants = [...mockRestaurants];

  // Filter by category
  if (category) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        restaurant.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Filter by search query
  if (query) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(query.toLowerCase()),
    );
  }

  res.json({
    success: true,
    data: filteredRestaurants,
  });
});

app.get("/api/restaurants/categories", (req, res) => {
  const categories = [...new Set(mockRestaurants.map((r) => r.category))];
  res.json({
    success: true,
    data: categories,
  });
});

app.get("/api/restaurants/search", (req, res) => {
  const { query, category } = req.query;

  let filteredRestaurants = [...mockRestaurants];

  if (category) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        restaurant.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (query) {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(query.toLowerCase()),
    );
  }

  res.json({
    success: true,
    data: filteredRestaurants,
  });
});

app.get("/api/restaurants/:id", (req, res) => {
  const { id } = req.params;
  const restaurant = mockRestaurants.find((r) => r._id === id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  res.json({
    success: true,
    data: restaurant,
  });
});

app.get("/api/restaurants/:id/menu", (req, res) => {
  const { id } = req.params;
  const restaurant = mockRestaurants.find((r) => r._id === id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  // Mock menu items for the restaurant
  const menuItems = [
    {
      _id: "item-1",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil",
      price: 299,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
      isVeg: true,
      isAvailable: true,
    },
    {
      _id: "item-2",
      name: "Pepperoni Pizza",
      description: "Pepperoni, mozzarella cheese",
      price: 399,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
      isVeg: false,
      isAvailable: true,
    },
    {
      _id: "item-3",
      name: "Caesar Salad",
      description: "Romaine lettuce, croutons, parmesan",
      price: 199,
      category: "Salad",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300",
      isVeg: true,
      isAvailable: true,
    },
  ];

  res.json({
    success: true,
    data: menuItems,
  });
});

// Mock orders data - Expanded with more variety and realistic history
const mockOrders = [
  {
    _id: "order-1",
    orderId: "ORD-001",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-1",
      name: "Pizza Palace",
    },
    items: [
      {
        _id: "item-1",
        name: "Margherita Pizza",
        quantity: 2,
        price: 299,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
      },
      {
        _id: "item-3",
        name: "Caesar Salad",
        quantity: 1,
        price: 199,
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300",
      },
    ],
    subtotal: 797,
    tax: 79.7,
    deliveryFee: 40,
    total: 916.7,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "UPI",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(
      Date.now() - 2 * 60 * 60 * 1000,
    ).toISOString(),
    actualDeliveryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    notes: "Extra cheese please",
    rating: 5,
    review: "Excellent food and fast delivery!",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "order-2",
    orderId: "ORD-002",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-2",
      name: "Burger Hub",
    },
    items: [
      {
        _id: "item-4",
        name: "Classic Burger",
        quantity: 1,
        price: 249,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
      },
      {
        _id: "item-5",
        name: "French Fries",
        quantity: 1,
        price: 99,
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300",
      },
    ],
    subtotal: 348,
    tax: 34.8,
    deliveryFee: 30,
    total: 412.8,
    status: "out_for_delivery",
    paymentStatus: "completed",
    paymentMethod: "Card",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    actualDeliveryTime: null,
    notes: "Please ring the doorbell",
    rating: null,
    review: null,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    _id: "order-3",
    orderId: "ORD-003",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-8",
      name: "Royal Biryani House",
    },
    items: [
      {
        _id: "item-6",
        name: "Chicken Dum Biryani",
        quantity: 2,
        price: 450,
        image:
          "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300",
      },
      {
        _id: "item-7",
        name: "Mutton Kebab",
        quantity: 1,
        price: 320,
        image:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300",
      },
      {
        _id: "item-8",
        name: "Raita",
        quantity: 2,
        price: 80,
        image:
          "https://images.unsplash.com/photo-1583218821096-dbe7f45c02e6?w=300",
      },
    ],
    subtotal: 1380,
    tax: 138,
    deliveryFee: 25,
    total: 1543,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "UPI",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString(), // Yesterday
    actualDeliveryTime: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
    ).toISOString(),
    notes: "Family dinner order",
    rating: 5,
    review: "Amazing biryani! Perfectly cooked and flavorful.",
    createdAt: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000,
    ).toISOString(),
  },
  {
    _id: "order-4",
    orderId: "ORD-004",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-3",
      name: "Sushi Express",
    },
    items: [
      {
        _id: "item-9",
        name: "California Roll",
        quantity: 2,
        price: 399,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300",
      },
      {
        _id: "item-10",
        name: "Salmon Sashimi",
        quantity: 1,
        price: 599,
        image:
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300",
      },
    ],
    subtotal: 1397,
    tax: 139.7,
    deliveryFee: 50,
    total: 1586.7,
    status: "preparing",
    paymentStatus: "completed",
    paymentMethod: "Card",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    actualDeliveryTime: null,
    notes: "Handle with care - sushi order",
    rating: null,
    review: null,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    _id: "order-5",
    orderId: "ORD-005",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-9",
      name: "Healthy Bowls Co.",
    },
    items: [
      {
        _id: "item-11",
        name: "Quinoa Power Bowl",
        quantity: 1,
        price: 280,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300",
      },
      {
        _id: "item-12",
        name: "Green Smoothie",
        quantity: 1,
        price: 180,
        image:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300",
      },
    ],
    subtotal: 460,
    tax: 46,
    deliveryFee: 25,
    total: 531,
    status: "confirmed",
    paymentStatus: "completed",
    paymentMethod: "UPI",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    actualDeliveryTime: null,
    notes: "Morning breakfast order",
    rating: null,
    review: null,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    _id: "order-6",
    orderId: "ORD-006",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-10",
      name: "Dessert Paradise",
    },
    items: [
      {
        _id: "item-13",
        name: "Chocolate Lava Cake",
        quantity: 2,
        price: 220,
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300",
      },
      {
        _id: "item-14",
        name: "Vanilla Ice Cream",
        quantity: 1,
        price: 120,
        image:
          "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300",
      },
    ],
    subtotal: 560,
    tax: 56,
    deliveryFee: 30,
    total: 646,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "Cash",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 2 days ago
    actualDeliveryTime: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000,
    ).toISOString(),
    notes: "Birthday celebration desserts",
    rating: 4,
    review: "Delicious cakes, though delivery was slightly delayed",
    createdAt: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000,
    ).toISOString(),
  },
  {
    _id: "order-7",
    orderId: "ORD-007",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-6",
      name: "Taco Fiesta",
    },
    items: [
      {
        _id: "item-15",
        name: "Chicken Tacos",
        quantity: 4,
        price: 180,
        image:
          "https://images.unsplash.com/photo-1565299585323-38174c4a6663?w=300",
      },
      {
        _id: "item-16",
        name: "Guacamole & Chips",
        quantity: 1,
        price: 150,
        image:
          "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=300",
      },
      {
        _id: "item-17",
        name: "Mexican Rice",
        quantity: 2,
        price: 120,
        image:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300",
      },
    ],
    subtotal: 1110,
    tax: 111,
    deliveryFee: 35,
    total: 1256,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Card",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 3 days ago
    actualDeliveryTime: null,
    notes: "Party order - cancelled due to restaurant closure",
    rating: null,
    review: null,
    createdAt: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000,
    ).toISOString(),
  },
  {
    _id: "order-8",
    orderId: "ORD-008",
    user: {
      _id: "user-1",
      name: "Mohamed Shafik",
      email: "mohamedshafik2526@gmail.com",
    },
    restaurant: {
      _id: "rest-5",
      name: "Dragon Wok",
    },
    items: [
      {
        _id: "item-18",
        name: "Hakka Noodles",
        quantity: 2,
        price: 250,
        image:
          "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300",
      },
      {
        _id: "item-19",
        name: "Manchurian Dry",
        quantity: 1,
        price: 280,
        image:
          "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300",
      },
      {
        _id: "item-20",
        name: "Dim Sum Platter",
        quantity: 1,
        price: 380,
        image:
          "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300",
      },
    ],
    subtotal: 1160,
    tax: 116,
    deliveryFee: 45,
    total: 1321,
    status: "delivered",
    paymentStatus: "completed",
    paymentMethod: "UPI",
    deliveryAddress: {
      street: "123 User Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      phone: "+91-9876543211",
    },
    estimatedDeliveryTime: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 5 days ago
    actualDeliveryTime: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000,
    ).toISOString(),
    notes: "Office lunch order",
    rating: 4,
    review: "Good Chinese food, authentic flavors",
    createdAt: new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000 - 35 * 60 * 1000,
    ).toISOString(),
  },
];

// Orders endpoints
app.get("/api/orders", (req, res) => {
  // In a real app, filter by authenticated user
  res.json({
    success: true,
    data: mockOrders,
  });
});

app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = mockOrders.find((o) => o._id === id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

app.post("/api/orders", (req, res) => {
  const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

  if (!restaurantId || !items || !deliveryAddress || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const restaurant = mockRestaurants.find((r) => r._id === restaurantId);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + tax + deliveryFee;

  const newOrder = {
    _id: `order-${Date.now()}`,
    orderId: `ORD-${String(mockOrders.length + 1).padStart(3, "0")}`,
    user: {
      _id: "user-1", // Would be from auth token in real app
      name: "Current User",
      email: "user@example.com",
    },
    restaurant: {
      _id: restaurant._id,
      name: restaurant.name,
    },
    items,
    subtotal,
    tax,
    deliveryFee,
    total,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod,
    deliveryAddress,
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
    actualDeliveryTime: null,
    notes: "",
    rating: null,
    review: null,
    createdAt: new Date().toISOString(),
  };

  mockOrders.push(newOrder);

  res.status(201).json({
    success: true,
    data: newOrder,
    message: "Order placed successfully",
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
