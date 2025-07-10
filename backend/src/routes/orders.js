import express from "express";
import { authenticate } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// Create new order
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
    } = req.body;

    // Validation
    if (!restaurantId || !items || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant, items, delivery address, and payment method are required",
      });
    }

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Verify restaurant exists and is active
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or inactive",
      });
    }

    // Verify menu items and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findOne({
        _id: item.menuItemId,
        restaurant: restaurantId,
        isAvailable: true,
      });

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found or unavailable: ${item.menuItemId}`,
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions,
      });
    }

    // Calculate pricing
    const deliveryFee = restaurant.deliveryFee;
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + deliveryFee + tax;

    // Check minimum order
    if (subtotal < restaurant.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${restaurant.minimumOrder}`,
      });
    }

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date();
    const deliveryTimeMinutes =
      parseInt(restaurant.deliveryTime.match(/\d+/)[0]) + 10;
    estimatedDeliveryTime.setMinutes(
      estimatedDeliveryTime.getMinutes() + deliveryTimeMinutes,
    );

    // Create order
    const order = new Order({
      user: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        tax,
        total,
      },
      deliveryAddress,
      paymentMethod,
      estimatedDeliveryTime,
      notes: specialInstructions,
    });

    await order.save();

    // Populate order details
    await order.populate([
      {
        path: "restaurant",
        select: "name image category deliveryTime",
      },
      {
        path: "items.menuItem",
        select: "name price image category",
      },
    ]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user orders
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = { user: req.user.id };

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate([
        {
          path: "restaurant",
          select: "name image category deliveryTime",
        },
        {
          path: "items.menuItem",
          select: "name price image category",
        },
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get single order
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate([
      {
        path: "restaurant",
        select: "name image category contact location",
      },
      {
        path: "items.menuItem",
        select: "name price image category description",
      },
    ]);

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
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Cancel order
router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Can only cancel if order is pending or confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Rate and review order
router.post("/:id/review", authenticate, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "delivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not delivered",
      });
    }

    if (order.rating) {
      return res.status(400).json({
        success: false,
        message: "Order already rated",
      });
    }

    order.rating = rating;
    order.review = review;
    await order.save();

    res.json({
      success: true,
      message: "Review submitted successfully",
      data: order,
    });
  } catch (error) {
    console.error("Review order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
