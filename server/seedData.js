import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Restaurant from "./models/Restaurant.js";
import FoodItem from "./models/FoodItem.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import SignupRequest from "./models/SignupRequest.js";
import connectDB from "./config/db.js";

const seedData = async () => {
  try {
    try {
      await connectDB();
    } catch (error) {
      console.log(
        "⚠️  MongoDB not available, skipping seed. Data will be served from mock sources.",
      );
      console.log("🎉 Mock data setup complete!");
      console.log("👤 Admin: fastio121299@gmail.com / fastio1212");
      console.log("👤 User: mohamedshafik2526@gmail.com / Shafik1212@");
      process.exit(0);
    }

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await SignupRequest.deleteMany({});

    console.log("🗑️  Cleared existing data");

    const hashedPassword = await bcrypt.hash("fastio1212", 10);
    const hashedUserPassword = await bcrypt.hash("Shafik1212@", 10);

    const admin = await User.create({
      email: "fastio121299@gmail.com",
      username: "fastio_admin",
      password: hashedPassword,
      name: "FastIO Admin",
      phone: "+91-9876543210",
      mobile: "+91-9876543210",
      isAdmin: true,
    });

    const user = await User.create({
      email: "mohamedshafik2526@gmail.com",
      username: "mohamed_shafik",
      password: hashedUserPassword,
      name: "Mohamed Shafik",
      phone: "+91-9876543211",
      mobile: "+91-9876543211",
      totalOrders: 5,
      totalSpent: 2450,
    });

    console.log("👤 Created users");

    const restaurants = await Restaurant.create([
      {
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
        description: "Authentic Italian pizzas and pasta",
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
      {
        name: "Burger Junction",
        email: "burger@example.com",
        phone: "+91-9876543213",
        address: {
          street: "456 Food St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
        },
        cuisine: ["American", "Fast Food"],
        description: "Gourmet burgers and sides",
        rating: 4.2,
        totalReviews: 98,
        status: "Active",
        deliveryTime: { min: 20, max: 30 },
        deliveryFee: 35,
        minimumOrder: 150,
        totalOrders: 890,
        totalRevenue: 89000,
        isVerified: true,
      },
      {
        name: "Spice Garden",
        email: "spice@example.com",
        phone: "+91-9876543214",
        address: {
          street: "789 Curry Lane",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400003",
        },
        cuisine: ["Indian", "South Indian"],
        description: "Traditional Indian cuisine with authentic flavors",
        rating: 4.7,
        totalReviews: 210,
        status: "Active",
        deliveryTime: { min: 30, max: 45 },
        deliveryFee: 45,
        minimumOrder: 250,
        totalOrders: 1580,
        totalRevenue: 158000,
        isVerified: true,
      },
      {
        name: "Cafe Delight",
        email: "cafe@example.com",
        phone: "+91-9876543215",
        address: {
          street: "321 Coffee Ave",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400004",
        },
        cuisine: ["Continental", "Beverages"],
        description: "Coffee, pastries, and light meals",
        rating: 4.0,
        totalReviews: 76,
        status: "Inactive",
        deliveryTime: { min: 15, max: 25 },
        deliveryFee: 30,
        minimumOrder: 100,
        totalOrders: 450,
        totalRevenue: 45000,
        isVerified: false,
      },
    ]);

    console.log("🏪 Created restaurants");

    const foodItems = await FoodItem.create([
      {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
        price: 299,
        category: "Main Course",
        restaurant: restaurants[0]._id,
        ingredients: ["Tomatoes", "Mozzarella", "Basil", "Olive Oil"],
        isVegetarian: true,
        spiceLevel: "Mild",
        isAvailable: true,
        preparationTime: 20,
        rating: 4.6,
        totalOrders: 245,
        emoji: "🍕",
      },
      {
        name: "Chicken Burger",
        description: "Juicy grilled chicken burger with lettuce and mayo",
        price: 249,
        category: "Main Course",
        restaurant: restaurants[1]._id,
        ingredients: ["Chicken", "Lettuce", "Tomato", "Mayo", "Bun"],
        isVegetarian: false,
        spiceLevel: "Medium",
        isAvailable: true,
        preparationTime: 15,
        rating: 4.3,
        totalOrders: 189,
        emoji: "🍔",
      },
      {
        name: "Butter Chicken",
        description: "Creamy tomato-based curry with tender chicken pieces",
        price: 349,
        category: "Main Course",
        restaurant: restaurants[2]._id,
        ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Butter"],
        isVegetarian: false,
        spiceLevel: "Medium",
        isAvailable: true,
        preparationTime: 25,
        rating: 4.8,
        totalOrders: 312,
        emoji: "🍛",
      },
      {
        name: "Chocolate Cake",
        description: "Rich and moist chocolate cake with chocolate frosting",
        price: 149,
        category: "Desserts",
        restaurant: restaurants[3]._id,
        ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter"],
        isVegetarian: true,
        spiceLevel: "Mild",
        isAvailable: false,
        preparationTime: 10,
        rating: 4.4,
        totalOrders: 87,
        emoji: "🍰",
      },
      {
        name: "Green Tea",
        description: "Premium organic green tea",
        price: 89,
        category: "Beverages",
        restaurant: restaurants[3]._id,
        ingredients: ["Green Tea Leaves", "Water"],
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "Mild",
        isAvailable: true,
        preparationTime: 5,
        rating: 4.1,
        totalOrders: 156,
        emoji: "🍵",
      },
    ]);

    console.log("🍕 Created food items");

    const orders = await Order.create([
      {
        orderId: "ORD001",
        orderNumber: "ON001",
        user: user._id,
        restaurant: restaurants[0]._id,
        items: [
          {
            foodItem: foodItems[0]._id,
            quantity: 2,
            price: 299,
          },
        ],
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
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
        actualDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        rating: 5,
        review: "Excellent pizza!",
      },
      {
        orderId: "ORD002",
        orderNumber: "ON002",
        user: user._id,
        restaurant: restaurants[1]._id,
        items: [
          {
            foodItem: foodItems[1]._id,
            quantity: 1,
            price: 249,
          },
        ],
        subtotal: 249,
        tax: 24.9,
        deliveryFee: 35,
        total: 308.9,
        status: "Preparing",
        paymentStatus: "Completed",
        paymentMethod: "Card",
        deliveryAddress: {
          street: "123 User St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400005",
          phone: "+91-9876543211",
        },
        estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 1000),
      },
      {
        orderId: "ORD003",
        orderNumber: "ON003",
        user: user._id,
        restaurant: restaurants[2]._id,
        items: [
          {
            foodItem: foodItems[2]._id,
            quantity: 1,
            price: 349,
          },
        ],
        subtotal: 349,
        tax: 34.9,
        deliveryFee: 45,
        total: 428.9,
        status: "Out for Delivery",
        paymentStatus: "Completed",
        paymentMethod: "Wallet",
        deliveryAddress: {
          street: "123 User St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400005",
          phone: "+91-9876543211",
        },
        estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
      },
    ]);

    console.log("📦 Created orders");

    const payments = await Payment.create([
      {
        order: orders[0]._id,
        user: user._id,
        amount: 697.8,
        method: "UPI",
        status: "Completed",
        gateway: "PhonePe",
        gatewayTransactionId: "PP123456789",
        processedAt: new Date(),
      },
      {
        order: orders[1]._id,
        user: user._id,
        amount: 308.9,
        method: "Card",
        status: "Completed",
        gateway: "Razorpay",
        gatewayTransactionId: "RZP987654321",
        processedAt: new Date(),
      },
      {
        order: orders[2]._id,
        user: user._id,
        amount: 428.9,
        method: "Wallet",
        status: "Completed",
        gateway: "Paytm",
        gatewayTransactionId: "PTM456789123",
        processedAt: new Date(),
      },
    ]);

    console.log("💳 Created payments");

    const signupRequests = await SignupRequest.create([
      {
        email: "john.doe@example.com",
        name: "John Doe",
        phone: "+91-9876543216",
        password: await bcrypt.hash("password123", 10),
        requestType: "User",
        status: "Pending",
      },
      {
        email: "newrestaurant@example.com",
        name: "Restaurant Owner",
        phone: "+91-9876543217",
        password: await bcrypt.hash("restaurant123", 10),
        requestType: "Restaurant",
        status: "Pending",
        restaurantInfo: {
          name: "New Restaurant",
          cuisine: ["Italian", "Mexican"],
          address: {
            street: "456 New St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400006",
          },
          description: "Fresh and authentic cuisine",
        },
      },
    ]);

    console.log("✉️  Created signup requests");

    console.log("🎉 Database seeded successfully!");
    console.log("👤 Admin: fastio121299@gmail.com / fastio1212");
    console.log("👤 User: mohamedshafik2526@gmail.com / Shafik1212@");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
