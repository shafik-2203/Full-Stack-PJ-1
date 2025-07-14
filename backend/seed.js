import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "./src/models/MenuItem.js";
import Restaurant from "./src/models/Restaurant.js";
import User from "./src/models/User.js";
import Order from "./src/models/Order.js";
import PendingSignup from "./src/models/PendingSignup.js";
import { hashPassword } from "./src/utils/auth.js";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(
      "mongodb+srv://mohamedshafik2526:ShafikMongo12345@cluster1.djqnrpm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("✅ Connected to MongoDB");
    await MenuItem.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await PendingSignup.deleteMany({});

    const restaurants = [];
    const r0 = await Restaurant.create({
      name: "Pizza Palace",
      description: "Authentic Italian pizzas with fresh ingredients",
      category: "Italian",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=300&fit=crop",
      deliveryFee: 2.99,
      deliveryTime: "25-35",
    });
    restaurants.push(r0);
    await MenuItem.create({
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, and basil",
      price: 16.99,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop",
      restaurant: r0._id,
    });
    await MenuItem.create({
      name: "Pepperoni Pizza",
      description: "Classic pepperoni with mozzarella cheese",
      price: 18.99,
      category: "Pizza",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop",
      restaurant: r0._id,
    });
    const r1 = await Restaurant.create({
      name: "Burger Junction",
      description: "Juicy burgers and crispy fries",
      category: "American",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
      deliveryFee: 1.99,
      deliveryTime: "20-30",
    });
    restaurants.push(r1);
    await MenuItem.create({
      name: "Classic Cheeseburger",
      description:
        "Beef patty with cheddar cheese, lettuce, tomato, and pickles",
      price: 14.99,
      category: "Burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
      restaurant: r1._id,
    });
    await MenuItem.create({
      name: "Veggie Burger",
      description: "Plant-based patty with avocado, lettuce, and vegan mayo",
      price: 16.99,
      category: "Burgers",
      image:
        "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop",
      restaurant: r1._id,
    });
    const r2 = await Restaurant.create({
      name: "Sushi Zen",
      description: "Fresh sushi and Japanese delicacies",
      category: "Japanese",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop",
      deliveryFee: 3.99,
      deliveryTime: "30-45",
    });
    restaurants.push(r2);
    await MenuItem.create({
      name: "California Roll",
      description: "Crab, avocado, and cucumber wrapped in nori and rice",
      price: 12.99,
      category: "Sushi Rolls",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
      restaurant: r2._id,
    });
    await MenuItem.create({
      name: "Miso Soup",
      description: "Traditional Japanese soup with tofu and seaweed",
      price: 4.99,
      category: "Soups",
      image:
        "https://images.unsplash.com/photo-1606850196854-d13cdec95358?w=300&h=200&fit=crop",
      restaurant: r2._id,
    });
    const r3 = await Restaurant.create({
      name: "Taco Fiesta",
      description: "Authentic Mexican tacos and burritos",
      category: "Mexican",
      image:
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=300&fit=crop",
      deliveryFee: 2.49,
      deliveryTime: "15-25",
    });
    restaurants.push(r3);
    await MenuItem.create({
      name: "Carnitas Tacos",
      description: "Slow-cooked pork with onions, cilantro, and lime (3 tacos)",
      price: 11.99,
      category: "Tacos",
      image:
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop",
      restaurant: r3._id,
    });
    await MenuItem.create({
      name: "Veggie Burrito Bowl",
      description: "Black beans, rice, guacamole, salsa, and vegetables",
      price: 12.99,
      category: "Bowls",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
      restaurant: r3._id,
    });
    const r4 = await Restaurant.create({
      name: "Thai Garden",
      description: "Spicy and flavorful Thai cuisine",
      category: "Thai",
      image:
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop",
      deliveryFee: 3.49,
      deliveryTime: "25-40",
    });
    restaurants.push(r4);
    await MenuItem.create({
      name: "Pad Thai",
      description:
        "Stir-fried rice noodles with shrimp, bean sprouts, and peanuts",
      price: 15.99,
      category: "Noodles",
      image:
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop",
      restaurant: r4._id,
    });
    await MenuItem.create({
      name: "Green Curry",
      description: "Coconut curry with vegetables and choice of protein",
      price: 17.99,
      category: "Curries",
      image:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop",
      restaurant: r4._id,
    });
    const r5 = await Restaurant.create({
      name: "Healthy Bowls",
      description: "Fresh, healthy bowls and salads",
      category: "Healthy",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop",
      deliveryFee: 2.99,
      deliveryTime: "20-30",
    });
    restaurants.push(r5);
    await MenuItem.create({
      name: "Quinoa Power Bowl",
      description:
        "Quinoa with roasted vegetables, avocado, and tahini dressing",
      price: 14.99,
      category: "Power Bowls",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
      restaurant: r5._id,
    });
    await MenuItem.create({
      name: "Grilled Chicken Salad",
      description:
        "Mixed greens with grilled chicken, cherry tomatoes, and balsamic",
      price: 16.99,
      category: "Salads",
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
      restaurant: r5._id,
    });
    const admin = await User.create({
      username: "admin",
      email: "fastio121299@gmail.com",
      password: "Shafik1212@",
      mobile: "9999999999",
      role: "admin",
    });
    const user = await User.create({
      username: "mohamedshafik",
      email: "mohamedshafik2526@gmail.com",
      password: "Shafik1212@",
      mobile: "8888888888",
      role: "user",
    });
    await PendingSignup.create({
      username: "pendinguser",
      email: "pendinguser@example.com",
      mobile: "7777777777",
      password: "Shafik1234@", // or hashed if your model expects hashed passwords
      otpCode: "123456",
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });
    await Order.create({
      user: user._id,
      restaurant: r0._id, // assuming r0 is Pizza Palace
      orderNumber: "ORD1001",
      status: "confirmed", // ✅ enum-safe lowercase
      paymentMethod: "cash", // or "online" or whatever your schema allows
      deliveryAddress: {
        street: "123 Main Street",
        city: "Food City",
        state: "FoodState",
        zipCode: "123456",
      },
      pricing: {
        subtotal: 33.98,
        tax: 2.0,
        deliveryFee: 2.99,
        total: 38.97,
      },
      items: [
        {
          menuItem: (await MenuItem.findOne({ name: "Margherita Pizza" }))._id,
          quantity: 2,
          price: 16.99,
        },
      ],
    });

    console.log("✅ Seed completed.");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seedData();
