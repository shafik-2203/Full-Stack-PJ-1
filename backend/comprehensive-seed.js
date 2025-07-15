import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import models
import User from "./src/models/User.js";
import Restaurant from "./src/models/Restaurant.js";
import MenuItem from "./src/models/MenuItem.js";
import Order from "./src/models/Order.js";
import PendingSignup from "./src/models/PendingSignup.js";

// MongoDB Atlas connection
const MONGO_URI =
  "mongodb+srv://mohamedshafik2526:ShafikMongo12345@cluster1.djqnrpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB Atlas connection error:", error);
    process.exit(1);
  }
};

const seedComprehensiveData = async () => {
  try {
    console.log("🌱 Starting comprehensive database seeding...");

    // Clear all existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await PendingSignup.deleteMany({});
    console.log("✅ All collections cleared");

    // Hash passwords
    const adminPassword = await bcrypt.hash("Fastio1212@", 12);
    const userPassword = await bcrypt.hash("Shafik1212@", 12);
    const testPassword = await bcrypt.hash("Test123@", 12);

    // 1. CREATE USERS AND ADMINS
    console.log("👤 Creating users and admins...");

    const users = await User.insertMany([
      // Admin User
      {
        username: "admin",
        email: "fastio121299@gmail.com",
        password: adminPassword,
        mobile: "9999999999",
        role: "admin",
        isVerified: true,
        profile: {
          firstName: "FastIO",
          lastName: "Admin",
          addresses: [
            {
              label: "Home",
              street: "123 Admin Street",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400001",
              isDefault: true,
            },
          ],
        },
        preferences: {
          cuisine: ["All"],
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
      },

      // Main Test User
      {
        username: "mohamedshafik",
        email: "mohamedshafik2526@gmail.com",
        password: userPassword,
        mobile: "8888888888",
        role: "user",
        isVerified: true,
        profile: {
          firstName: "Mohamed",
          lastName: "Shafik",
          addresses: [
            {
              label: "Home",
              street: "456 User Colony",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400002",
              isDefault: true,
            },
            {
              label: "Office",
              street: "789 Business Park",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400003",
              isDefault: false,
            },
          ],
        },
        preferences: {
          cuisine: ["Italian", "Indian", "Chinese"],
          dietaryRestrictions: [],
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
        },
      },

      // Additional Test Users
      {
        username: "testuser1",
        email: "testuser1@gmail.com",
        password: testPassword,
        mobile: "7777777777",
        role: "user",
        isVerified: true,
        profile: {
          firstName: "Test",
          lastName: "User One",
          addresses: [
            {
              label: "Home",
              street: "101 Test Street",
              city: "Delhi",
              state: "Delhi",
              zipCode: "110001",
              isDefault: true,
            },
          ],
        },
        preferences: {
          cuisine: ["American", "Mexican"],
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
      },

      {
        username: "testuser2",
        email: "testuser2@gmail.com",
        password: testPassword,
        mobile: "6666666666",
        role: "user",
        isVerified: true,
        profile: {
          firstName: "Test",
          lastName: "User Two",
          addresses: [
            {
              label: "Home",
              street: "202 Sample Avenue",
              city: "Bangalore",
              state: "Karnataka",
              zipCode: "560001",
              isDefault: true,
            },
          ],
        },
        preferences: {
          cuisine: ["Japanese", "Thai"],
          notifications: {
            email: false,
            sms: true,
            push: true,
          },
        },
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // 2. CREATE RESTAURANTS
    console.log("🏪 Creating restaurants...");

    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizza Palace",
        description:
          "Authentic Italian pizzas made with fresh ingredients and traditional recipes",
        category: "Italian",
        rating: 4.5,
        deliveryTime: "25-35 min",
        deliveryFee: 49,
        minimumOrder: 199,
        isActive: true,
        location: {
          address: "123 Pizza Street, Little Italy",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
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
        images: {
          logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
          ],
        },
      },

      {
        name: "Burger Junction",
        description:
          "Gourmet burgers made with premium ingredients and artisanal buns",
        category: "American",
        rating: 4.2,
        deliveryTime: "20-30 min",
        deliveryFee: 29,
        minimumOrder: 149,
        isActive: true,
        location: {
          address: "456 Burger Lane, Food Court",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
        },
        contact: {
          phone: "+91 9876543211",
          email: "hello@burgerjunction.com",
        },
        timings: {
          open: "11:00",
          close: "24:00",
        },
        features: ["Home Delivery", "Takeaway", "Cash Payment", "Card Payment"],
        images: {
          logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
          ],
        },
      },

      {
        name: "Sushi Express",
        description:
          "Fresh sushi and authentic Japanese cuisine prepared by expert chefs",
        category: "Japanese",
        rating: 4.7,
        deliveryTime: "30-40 min",
        deliveryFee: 59,
        minimumOrder: 299,
        isActive: true,
        location: {
          address: "789 Sushi Street, Japan Town",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400003",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
        },
        contact: {
          phone: "+91 9876543212",
          email: "orders@sushiexpress.com",
        },
        timings: {
          open: "12:00",
          close: "22:00",
        },
        features: ["Home Delivery", "Card Payment"],
        images: {
          logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1606850196854-d13cdec95358?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop",
          ],
        },
      },

      {
        name: "Spice Garden",
        description:
          "Traditional Indian cuisine with authentic spices and regional specialties",
        category: "Indian",
        rating: 4.6,
        deliveryTime: "35-45 min",
        deliveryFee: 39,
        minimumOrder: 249,
        isActive: true,
        location: {
          address: "321 Spice Market, Heritage Lane",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400004",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
        },
        contact: {
          phone: "+91 9876543213",
          email: "contact@spicegarden.com",
        },
        timings: {
          open: "11:30",
          close: "23:30",
        },
        features: ["Pure Veg", "Home Delivery", "Card Payment", "Cash Payment"],
        images: {
          logo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop",
          ],
        },
      },

      {
        name: "Taco Fiesta",
        description:
          "Authentic Mexican street food with fresh ingredients and bold flavors",
        category: "Mexican",
        rating: 4.3,
        deliveryTime: "15-25 min",
        deliveryFee: 35,
        minimumOrder: 179,
        isActive: true,
        location: {
          address: "654 Fiesta Boulevard",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400005",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
        },
        contact: {
          phone: "+91 9876543214",
          email: "hola@tacofiesta.com",
        },
        timings: {
          open: "12:00",
          close: "23:00",
        },
        features: ["Home Delivery", "Takeaway", "Card Payment"],
        images: {
          logo: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
          ],
        },
      },

      {
        name: "Thai Garden",
        description:
          "Authentic Thai cuisine with traditional recipes and fresh herbs",
        category: "Thai",
        rating: 4.4,
        deliveryTime: "25-40 min",
        deliveryFee: 45,
        minimumOrder: 229,
        isActive: true,
        location: {
          address: "987 Thai Street, Asian Quarter",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400006",
          coordinates: {
            latitude: 19.076,
            longitude: 72.8777,
          },
        },
        contact: {
          phone: "+91 9876543215",
          email: "info@thaigarden.com",
        },
        timings: {
          open: "12:00",
          close: "22:30",
        },
        features: ["Pure Veg", "Home Delivery", "Card Payment"],
        images: {
          logo: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=100&h=100&fit=crop&crop=center",
          banner:
            "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=400&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop",
          ],
        },
      },
    ]);

    console.log(`✅ Created ${restaurants.length} restaurants`);

    // 3. CREATE MENU ITEMS
    console.log("🍕 Creating menu items...");

    const menuItems = await MenuItem.insertMany([
      // Pizza Palace Menu Items
      {
        name: "Margherita Pizza",
        description:
          "Classic Italian pizza with fresh tomatoes, mozzarella cheese, and fresh basil leaves",
        price: 299,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 20,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 280,
          protein: 12,
          carbs: 35,
          fat: 8,
        },
        ingredients: [
          "Pizza Dough",
          "Tomato Sauce",
          "Mozzarella",
          "Fresh Basil",
          "Olive Oil",
        ],
        allergens: ["Gluten", "Dairy"],
      },

      {
        name: "Pepperoni Pizza",
        description:
          "Delicious pepperoni slices with mozzarella cheese on our signature pizza base",
        price: 399,
        category: "Pizza",
        restaurant: restaurants[0]._id,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 22,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 320,
          protein: 16,
          carbs: 35,
          fat: 12,
        },
        ingredients: [
          "Pizza Dough",
          "Tomato Sauce",
          "Mozzarella",
          "Pepperoni",
          "Italian Herbs",
        ],
        allergens: ["Gluten", "Dairy"],
      },

      {
        name: "Caesar Salad",
        description:
          "Fresh romaine lettuce with parmesan cheese, croutons and our special caesar dressing",
        price: 199,
        category: "Salads",
        restaurant: restaurants[0]._id,
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 180,
          protein: 8,
          carbs: 12,
          fat: 14,
        },
        ingredients: [
          "Romaine Lettuce",
          "Parmesan",
          "Croutons",
          "Caesar Dressing",
        ],
        allergens: ["Dairy", "Eggs"],
      },

      // Burger Junction Menu Items
      {
        name: "Classic Cheeseburger",
        description:
          "Juicy beef patty with cheddar cheese, lettuce, tomato, onions and our special sauce",
        price: 249,
        category: "Burgers",
        restaurant: restaurants[1]._id,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 520,
          protein: 28,
          carbs: 45,
          fat: 25,
        },
        ingredients: [
          "Beef Patty",
          "Cheddar Cheese",
          "Lettuce",
          "Tomato",
          "Onions",
          "Burger Bun",
        ],
        allergens: ["Gluten", "Dairy"],
      },

      {
        name: "Veggie Burger",
        description:
          "Plant-based patty with fresh vegetables, avocado and herb mayo in whole wheat bun",
        price: 229,
        category: "Burgers",
        restaurant: restaurants[1]._id,
        image:
          "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 12,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 380,
          protein: 18,
          carbs: 45,
          fat: 15,
        },
        ingredients: [
          "Veggie Patty",
          "Avocado",
          "Lettuce",
          "Tomato",
          "Herb Mayo",
          "Whole Wheat Bun",
        ],
        allergens: ["Gluten"],
      },

      {
        name: "French Fries",
        description:
          "Crispy golden potato fries seasoned with our special spice mix",
        price: 99,
        category: "Snacks",
        restaurant: restaurants[1]._id,
        image:
          "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 8,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 365,
          protein: 4,
          carbs: 63,
          fat: 17,
        },
        ingredients: ["Potatoes", "Vegetable Oil", "Salt", "Special Seasoning"],
        allergens: [],
      },

      // Sushi Express Menu Items
      {
        name: "California Roll",
        description:
          "Fresh crab meat, avocado, and cucumber wrapped in seasoned rice and nori",
        price: 399,
        category: "Sushi Rolls",
        restaurant: restaurants[2]._id,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 255,
          protein: 9,
          carbs: 38,
          fat: 7,
        },
        ingredients: [
          "Sushi Rice",
          "Nori",
          "Crab Meat",
          "Avocado",
          "Cucumber",
          "Mayo",
        ],
        allergens: ["Shellfish", "Eggs"],
      },

      {
        name: "Salmon Sashimi",
        description:
          "Fresh Atlantic salmon sliced thin and served with wasabi and pickled ginger",
        price: 599,
        category: "Sashimi",
        restaurant: restaurants[2]._id,
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 10,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 208,
          protein: 22,
          carbs: 0,
          fat: 12,
        },
        ingredients: ["Fresh Salmon", "Wasabi", "Pickled Ginger", "Soy Sauce"],
        allergens: ["Fish"],
      },

      {
        name: "Miso Soup",
        description:
          "Traditional Japanese soup with miso paste, tofu, seaweed and scallions",
        price: 149,
        category: "Soups",
        restaurant: restaurants[2]._id,
        image:
          "https://images.unsplash.com/photo-1606850196854-d13cdec95358?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 8,
        spiceLevel: "Mild",
        nutritionInfo: {
          calories: 84,
          protein: 6,
          carbs: 8,
          fat: 3,
        },
        ingredients: ["Miso Paste", "Tofu", "Seaweed", "Scallions", "Dashi"],
        allergens: ["Soy"],
      },

      // Spice Garden Menu Items
      {
        name: "Butter Chicken",
        description:
          "Tender chicken pieces in creamy tomato-based curry with aromatic spices",
        price: 349,
        category: "Main Course",
        restaurant: restaurants[3]._id,
        image:
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 25,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 438,
          protein: 30,
          carbs: 12,
          fat: 28,
        },
        ingredients: [
          "Chicken",
          "Tomatoes",
          "Cream",
          "Butter",
          "Indian Spices",
          "Onions",
        ],
        allergens: ["Dairy"],
      },

      {
        name: "Chicken Biryani",
        description:
          "Aromatic basmati rice cooked with marinated chicken and traditional spices",
        price: 299,
        category: "Rice",
        restaurant: restaurants[3]._id,
        image:
          "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 35,
        spiceLevel: "High",
        nutritionInfo: {
          calories: 520,
          protein: 25,
          carbs: 65,
          fat: 18,
        },
        ingredients: [
          "Basmati Rice",
          "Chicken",
          "Yogurt",
          "Biryani Spices",
          "Fried Onions",
          "Saffron",
        ],
        allergens: ["Dairy"],
      },

      {
        name: "Paneer Tikka",
        description:
          "Grilled cottage cheese cubes marinated in yogurt and spices",
        price: 279,
        category: "Starters",
        restaurant: restaurants[3]._id,
        image:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 20,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 312,
          protein: 18,
          carbs: 8,
          fat: 22,
        },
        ingredients: [
          "Paneer",
          "Yogurt",
          "Bell Peppers",
          "Onions",
          "Tikka Spices",
        ],
        allergens: ["Dairy"],
      },

      // Taco Fiesta Menu Items
      {
        name: "Chicken Tacos",
        description:
          "Grilled chicken with fresh salsa, lettuce and cheese in soft tortillas (3 pieces)",
        price: 199,
        category: "Tacos",
        restaurant: restaurants[4]._id,
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 12,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 420,
          protein: 28,
          carbs: 36,
          fat: 18,
        },
        ingredients: [
          "Grilled Chicken",
          "Soft Tortillas",
          "Fresh Salsa",
          "Lettuce",
          "Cheese",
          "Lime",
        ],
        allergens: ["Gluten", "Dairy"],
      },

      {
        name: "Veggie Burrito Bowl",
        description:
          "Black beans, rice, guacamole, salsa, cheese and fresh vegetables in a bowl",
        price: 219,
        category: "Bowls",
        restaurant: restaurants[4]._id,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 10,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 485,
          protein: 18,
          carbs: 72,
          fat: 16,
        },
        ingredients: [
          "Black Beans",
          "Rice",
          "Guacamole",
          "Salsa",
          "Cheese",
          "Bell Peppers",
          "Corn",
        ],
        allergens: ["Dairy"],
      },

      // Thai Garden Menu Items
      {
        name: "Pad Thai",
        description:
          "Stir-fried rice noodles with shrimp, bean sprouts, eggs and tamarind sauce",
        price: 259,
        category: "Noodles",
        restaurant: restaurants[5]._id,
        image:
          "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop",
        isVeg: false,
        isAvailable: true,
        preparationTime: 18,
        spiceLevel: "Medium",
        nutritionInfo: {
          calories: 445,
          protein: 20,
          carbs: 58,
          fat: 16,
        },
        ingredients: [
          "Rice Noodles",
          "Shrimp",
          "Bean Sprouts",
          "Eggs",
          "Tamarind",
          "Peanuts",
        ],
        allergens: ["Shellfish", "Eggs", "Peanuts"],
      },

      {
        name: "Green Curry",
        description:
          "Creamy coconut curry with vegetables and choice of protein",
        price: 289,
        category: "Curries",
        restaurant: restaurants[5]._id,
        image:
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop",
        isVeg: true,
        isAvailable: true,
        preparationTime: 22,
        spiceLevel: "High",
        nutritionInfo: {
          calories: 368,
          protein: 8,
          carbs: 18,
          fat: 28,
        },
        ingredients: [
          "Green Curry Paste",
          "Coconut Milk",
          "Mixed Vegetables",
          "Thai Basil",
          "Fish Sauce",
        ],
        allergens: ["Fish"],
      },
    ]);

    console.log(`✅ Created ${menuItems.length} menu items`);

    // 4. CREATE SAMPLE ORDERS
    console.log("📦 Creating sample orders...");

    const orders = await Order.insertMany([
      {
        user: users[1]._id, // Mohamed Shafik
        restaurant: restaurants[0]._id, // Pizza Palace
        orderNumber: "ORD001",
        status: "delivered",
        paymentMethod: "card",
        paymentStatus: "completed",
        deliveryAddress: {
          street: "456 User Colony",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
        },
        items: [
          {
            menuItem: menuItems[0]._id, // Margherita Pizza
            quantity: 2,
            price: 299,
          },
          {
            menuItem: menuItems[2]._id, // Caesar Salad
            quantity: 1,
            price: 199,
          },
        ],
        pricing: {
          subtotal: 797,
          tax: 79.7,
          deliveryFee: 49,
          total: 925.7,
        },
        estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actualDeliveryTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        rating: 5,
        review: "Excellent pizza! Fresh ingredients and quick delivery.",
      },

      {
        user: users[1]._id, // Mohamed Shafik
        restaurant: restaurants[1]._id, // Burger Junction
        orderNumber: "ORD002",
        status: "preparing",
        paymentMethod: "upi",
        paymentStatus: "completed",
        deliveryAddress: {
          street: "456 User Colony",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
        },
        items: [
          {
            menuItem: menuItems[3]._id, // Classic Cheeseburger
            quantity: 1,
            price: 249,
          },
          {
            menuItem: menuItems[5]._id, // French Fries
            quantity: 1,
            price: 99,
          },
        ],
        pricing: {
          subtotal: 348,
          tax: 34.8,
          deliveryFee: 29,
          total: 411.8,
        },
        estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
      },

      {
        user: users[2]._id, // Test User 1
        restaurant: restaurants[2]._id, // Sushi Express
        orderNumber: "ORD003",
        status: "out_for_delivery",
        paymentMethod: "cash",
        paymentStatus: "pending",
        deliveryAddress: {
          street: "101 Test Street",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
        },
        items: [
          {
            menuItem: menuItems[6]._id, // California Roll
            quantity: 2,
            price: 399,
          },
          {
            menuItem: menuItems[8]._id, // Miso Soup
            quantity: 1,
            price: 149,
          },
        ],
        pricing: {
          subtotal: 947,
          tax: 94.7,
          deliveryFee: 59,
          total: 1100.7,
        },
        estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      },

      {
        user: users[3]._id, // Test User 2
        restaurant: restaurants[3]._id, // Spice Garden
        orderNumber: "ORD004",
        status: "confirmed",
        paymentMethod: "wallet",
        paymentStatus: "completed",
        deliveryAddress: {
          street: "202 Sample Avenue",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560001",
        },
        items: [
          {
            menuItem: menuItems[9]._id, // Butter Chicken
            quantity: 1,
            price: 349,
          },
          {
            menuItem: menuItems[10]._id, // Chicken Biryani
            quantity: 1,
            price: 299,
          },
        ],
        pricing: {
          subtotal: 648,
          tax: 64.8,
          deliveryFee: 39,
          total: 751.8,
        },
        estimatedDeliveryTime: new Date(Date.now() + 40 * 60 * 1000), // 40 minutes from now
      },

      {
        user: users[1]._id, // Mohamed Shafik
        restaurant: restaurants[4]._id, // Taco Fiesta
        orderNumber: "ORD005",
        status: "cancelled",
        paymentMethod: "card",
        paymentStatus: "refunded",
        deliveryAddress: {
          street: "456 User Colony",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
        },
        items: [
          {
            menuItem: menuItems[12]._id, // Chicken Tacos
            quantity: 2,
            price: 199,
          },
        ],
        pricing: {
          subtotal: 398,
          tax: 39.8,
          deliveryFee: 35,
          total: 472.8,
        },
        cancelReason: "Customer requested cancellation",
        cancelledAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    ]);

    console.log(`✅ Created ${orders.length} sample orders`);

    // 5. CREATE PENDING SIGNUPS
    console.log("✉️  Creating pending signups...");

    const pendingSignups = await PendingSignup.insertMany([
      {
        username: "newuser1",
        email: "newuser1@example.com",
        password: await bcrypt.hash("NewUser123@", 12),
        mobile: "5555555555",
        otpCode: "123456",
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      },

      {
        username: "newuser2",
        email: "newuser2@example.com",
        password: await bcrypt.hash("NewUser456@", 12),
        mobile: "4444444444",
        otpCode: "789012",
        otpExpiresAt: new Date(Date.now() + 8 * 60 * 1000), // 8 minutes from now
      },

      {
        username: "testrestaurant",
        email: "restaurant@example.com",
        password: await bcrypt.hash("Restaurant123@", 12),
        mobile: "3333333333",
        otpCode: "345678",
        otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      },
    ]);

    console.log(`✅ Created ${pendingSignups.length} pending signups`);

    // Summary
    console.log("\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`👤 Users created: ${users.length}`);
    console.log(`🏪 Restaurants created: ${restaurants.length}`);
    console.log(`🍕 Menu items created: ${menuItems.length}`);
    console.log(`📦 Orders created: ${orders.length}`);
    console.log(`✉️  Pending signups created: ${pendingSignups.length}`);
    console.log("=".repeat(50));

    console.log("\n🔑 LOGIN CREDENTIALS:");
    console.log("Admin: fastio121299@gmail.com / Fastio1212@");
    console.log("User: mohamedshafik2526@gmail.com / Shafik1212@");
    console.log("Test Users: testuser1@gmail.com / Test123@");
    console.log("           testuser2@gmail.com / Test123@");

    console.log("\n🏪 RESTAURANTS WITH MENU ITEMS:");
    restaurants.forEach((restaurant, index) => {
      console.log(
        `${index + 1}. ${restaurant.name} (${restaurant.category}) - ${restaurant.rating}⭐`,
      );
    });

    console.log("\n✅ All data has been seeded to MongoDB Atlas successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedComprehensiveData();
};

runSeed();
