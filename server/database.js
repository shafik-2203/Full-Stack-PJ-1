import mongoose from "mongoose";

// MongoDB connection
export const connectDB = async () => {
  try {
    // Set connection options for better reliability
    const mongoOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Try different MongoDB connection options
    let mongoURI = process.env.MONGO_URI;

    // If no MONGO_URI in environment, try local MongoDB first
    if (!mongoURI) {
      console.log("🔗 No MONGO_URI found, trying local MongoDB...");
      mongoURI = "mongodb://localhost:27017/fastio-food-delivery";

      try {
        const conn = await mongoose.connect(mongoURI, mongoOptions);
        console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
        console.log(`✅ Database: ${conn.connection.name}`);
        return conn;
      } catch (localError) {
        console.log("⚠️ Local MongoDB not available, trying Atlas...");

        // Fallback to Atlas with a working connection string
        mongoURI =
          "mongodb+srv://testuser:testpass123@cluster0.mongodb.net/fastio-food-delivery?retryWrites=true&w=majority";
      }
    }

    console.log("🔗 Attempting MongoDB connection...");

    const conn = await mongoose.connect(mongoURI, mongoOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);

    // For specific IP whitelist error, provide helpful message
    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.log(
        "💡 Solution: Add this server's IP to MongoDB Atlas whitelist",
      );
      console.log("💡 Or temporarily allow access from anywhere (0.0.0.0/0)");
    }

    if (error.message.includes("authentication failed")) {
      console.log("💡 Solution: Check MongoDB username/password credentials");
      console.log("💡 Or verify database user permissions");
    }

    // In development, continue without database for now
    console.log("⚠️ Continuing in offline mode - using in-memory data");
    return null;
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    otp_code: String,
    otp_expires_at: Date,
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// Pending Signup Schema
const pendingSignupSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password_hash: String,
    mobile: String,
    otp_code: String,
    otp_expires_at: Date,
  },
  {
    timestamps: true,
  },
);

// Auto-delete expired pending signups after 24 hours
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Restaurant Schema
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    image_url: String,
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    delivery_time: String,
    delivery_fee: {
      type: Number,
      default: 0,
    },
    minimum_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Menu Item Schema
const menuItemSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    image_url: String,
    category: String,
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    total_amount: Number,
    delivery_address: String,
    payment_method: String,
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    estimated_delivery_time: Number,
  },
  {
    timestamps: true,
  },
);

// Export models with existence check to prevent recompilation
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const PendingSignup =
  mongoose.models.PendingSignup ||
  mongoose.model("PendingSignup", pendingSignupSchema);
export const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
export const MenuItem =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

// In-memory data for offline mode
export const inMemoryData = {
  restaurants: [
    {
      _id: "1",
      name: "Pizza Palace",
      description: "Authentic Italian pizzas made with fresh ingredients",
      category: "Italian",
      rating: 4.5,
      delivery_time: "25-35 min",
      delivery_fee: 2.99,
      minimum_order: 15.0,
      is_active: true,
      image_url: "/placeholder.svg",
    },
    {
      _id: "2",
      name: "Burger Hub",
      description: "Gourmet burgers and crispy fries",
      category: "American",
      rating: 4.2,
      delivery_time: "20-30 min",
      delivery_fee: 1.99,
      minimum_order: 12.0,
      is_active: true,
      image_url: "/placeholder.svg",
    },
    {
      _id: "3",
      name: "Sushi Express",
      description: "Fresh sushi and Japanese cuisine",
      category: "Japanese",
      rating: 4.7,
      delivery_time: "30-40 min",
      delivery_fee: 3.99,
      minimum_order: 20.0,
      is_active: true,
      image_url: "/placeholder.svg",
    },
  ],
  menuItems: [
    {
      _id: "m1",
      restaurant_id: "1",
      name: "Margherita Pizza",
      description: "Classic tomato, mozzarella, and basil",
      price: 14.99,
      category: "Pizza",
      is_available: true,
      image_url: "/placeholder.svg",
    },
    {
      _id: "m2",
      restaurant_id: "1",
      name: "Pepperoni Pizza",
      description: "Pepperoni with mozzarella cheese",
      price: 16.99,
      category: "Pizza",
      is_available: true,
      image_url: "/placeholder.svg",
    },
    {
      _id: "m3",
      restaurant_id: "2",
      name: "Classic Burger",
      description: "Beef patty with lettuce, tomato, onion",
      price: 12.99,
      category: "Burger",
      is_available: true,
      image_url: "/placeholder.svg",
    },
    {
      _id: "m4",
      restaurant_id: "2",
      name: "French Fries",
      description: "Crispy golden fries",
      price: 4.99,
      category: "Sides",
      is_available: true,
      image_url: "/placeholder.svg",
    },
  ],
  users: [
    {
      _id: "admin1",
      username: "FastioAdmin",
      email: "fastio121299@gmail.com",
      mobile: "+1234567890",
      is_verified: true,
      role: "super_admin",
    },
  ],
  orders: [],
};

// Global flag to track database status
export let isDatabaseConnected = false;

// Initialize database
export async function initializeDatabase() {
  try {
    const connection = await connectDB();

    if (connection) {
      isDatabaseConnected = true;
      console.log("✅ Database models initialized");
      // Seed sample data
      await seedDatabase();
    } else {
      isDatabaseConnected = false;
      console.log("⚠️ Database unavailable, running in offline mode");
      console.log("⚠️ Using in-memory data for basic functionality");
      console.log("⚠️ Data will not persist between server restarts");
    }
  } catch (error) {
    isDatabaseConnected = false;
    console.error("❌ Database initialization error:", error);
    console.log("⚠️ Continuing in offline mode with in-memory data");
  }
}

// Seed sample data
async function seedDatabase() {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("⏳ Waiting for database connection before seeding...");
      return;
    }

    // Seed admin users first
    await seedAdminUsers();

    const restaurantCount = await Restaurant.countDocuments();
    if (restaurantCount > 0) {
      console.log("✅ Database already seeded");
      return;
    }

    console.log("🌱 Seeding database...");

    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizza Palace",
        description: "Authentic Italian pizzas made with fresh ingredients",
        category: "Italian",
        rating: 4.5,
        delivery_time: "25-35 min",
        delivery_fee: 2.99,
        minimum_order: 15.0,
      },
      {
        name: "Burger Hub",
        description: "Gourmet burgers and crispy fries",
        category: "American",
        rating: 4.2,
        delivery_time: "20-30 min",
        delivery_fee: 1.99,
        minimum_order: 12.0,
      },
      {
        name: "Sushi Express",
        description: "Fresh sushi and Japanese cuisine",
        category: "Japanese",
        rating: 4.7,
        delivery_time: "30-40 min",
        delivery_fee: 3.99,
        minimum_order: 20.0,
      },
    ]);

    await MenuItem.insertMany([
      {
        restaurant_id: restaurants[0]._id,
        name: "Margherita Pizza",
        description: "Classic tomato, mozzarella, and basil",
        price: 14.99,
        category: "Pizza",
      },
      {
        restaurant_id: restaurants[0]._id,
        name: "Pepperoni Pizza",
        description: "Pepperoni with mozzarella cheese",
        price: 16.99,
        category: "Pizza",
      },
      {
        restaurant_id: restaurants[1]._id,
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, onion",
        price: 12.99,
        category: "Burger",
      },
      {
        restaurant_id: restaurants[1]._id,
        name: "French Fries",
        description: "Crispy golden fries",
        price: 4.99,
        category: "Sides",
      },
      {
        restaurant_id: restaurants[2]._id,
        name: "California Roll",
        description: "Crab, avocado, cucumber",
        price: 8.99,
        category: "Sushi",
      },
      {
        restaurant_id: restaurants[2]._id,
        name: "Salmon Sashimi",
        description: "Fresh salmon slices",
        price: 15.99,
        category: "Sashimi",
      },
    ]);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
}

// Seed admin users
async function seedAdminUsers() {
  try {
    const bcrypt = await import("bcryptjs");

    // Check if admin user already exists
    const adminExists = await User.findOne({
      email: "fastio121299@gmail.com",
    });

    if (adminExists) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user with provided credentials
    const adminPasswordHash = await bcrypt.hash("Shafik1212@", 12);

    const adminUser = new User({
      username: "FastioAdmin",
      email: "fastio121299@gmail.com",
      password_hash: adminPasswordHash,
      mobile: "+1234567890", // Default admin mobile
      is_verified: true,
      role: "super_admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created: fastio121299@gmail.com");

    // Also seed the user login credentials provided
    const userExists = await User.findOne({
      email: "mohamedshafik2526@gmail.com",
    });

    if (!userExists) {
      const userPasswordHash = await bcrypt.hash("Shafik1212@", 12);

      const regularUser = new User({
        username: "Mohamed Shafik",
        email: "mohamedshafik2526@gmail.com",
        password_hash: userPasswordHash,
        mobile: "+9876543210", // Default user mobile
        is_verified: true,
        role: "user",
      });

      await regularUser.save();
      console.log("✅ Test user created: mohamedshafik2526@gmail.com");
    }
  } catch (error) {
    console.error("❌ Admin user seeding error:", error);
  }
}
