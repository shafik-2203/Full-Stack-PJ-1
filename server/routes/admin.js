import express from "express";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import FoodItem from "../models/FoodItem.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import SignupRequest from "../models/SignupRequest.js";
import { authMiddleware, adminMiddleware } from "./auth.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", async (req, res) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue,
      pendingSignups,
      activeRestaurants,
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Restaurant.countDocuments(),
      Order.countDocuments(),
      Payment.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      SignupRequest.countDocuments({ status: "Pending" }),
      Restaurant.countDocuments({ status: "Active" }),
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: revenue,
        pendingSignups,
        activeRestaurants,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Users fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.error("Restaurants fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
});

router.post("/restaurants", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Restaurant creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
});

router.put("/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
  } catch (error) {
    console.error("Restaurant update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
    });
  }
});

router.get("/food-items", async (req, res) => {
  try {
    const foodItems = await FoodItem.find()
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: foodItems,
    });
  } catch (error) {
    console.error("Food items fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food items",
    });
  }
});

router.post("/food-items", async (req, res) => {
  try {
    const foodItem = new FoodItem(req.body);
    await foodItem.save();
    await foodItem.populate("restaurant", "name");

    res.status(201).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    console.error("Food item creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create food item",
    });
  }
});

router.put("/food-items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const foodItem = await FoodItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("restaurant", "name");

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    res.json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    console.error("Food item update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update food item",
    });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("items.foodItem", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("items.foodItem", "name");

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
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order", "orderId total")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Payments fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
});

router.get("/signup-requests", async (req, res) => {
  try {
    const signupRequests = await SignupRequest.find()
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: signupRequests,
    });
  } catch (error) {
    console.error("Signup requests fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch signup requests",
    });
  }
});

router.put("/signup-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const updateData = {
      status,
      processedBy: req.user._id,
      processedAt: new Date(),
    };

    if (status === "Rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const signupRequest = await SignupRequest.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("processedBy", "name email");

    if (!signupRequest) {
      return res.status(404).json({
        success: false,
        message: "Signup request not found",
      });
    }

    if (status === "Approved") {
      if (signupRequest.requestType === "User") {
        const user = new User({
          email: signupRequest.email,
          password: signupRequest.password,
          name: signupRequest.name,
          phone: signupRequest.phone,
        });
        await user.save();
      } else if (signupRequest.requestType === "Restaurant") {
        const restaurant = new Restaurant({
          name: signupRequest.restaurantInfo.name,
          email: signupRequest.email,
          phone: signupRequest.phone,
          cuisine: signupRequest.restaurantInfo.cuisine,
          address: signupRequest.restaurantInfo.address,
          description: signupRequest.restaurantInfo.description,
          status: "Active",
        });
        await restaurant.save();
      }
    }

    res.json({
      success: true,
      data: signupRequest,
    });
  } catch (error) {
    console.error("Signup request update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update signup request",
    });
  }
});

export default router;
