import express from "express";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Get all restaurants
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { category, rating, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = new RegExp(category, "i");
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Search restaurants
router.get("/search", optionalAuth, async (req, res) => {
  try {
    const { query, category, page = 1, limit = 20 } = req.query;

    let filter = { isActive: true };

    if (query) {
      filter.$or = [
        { name: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
        { category: new RegExp(query, "i") },
      ];
    }

    if (category) {
      filter.category = new RegExp(category, "i");
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get restaurant categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Restaurant.distinct("category", {
      isActive: true,
    });

    res.json({
      success: true,
      data: categories.sort(),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get single restaurant
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isActive: true,
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
    console.error("Get restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get restaurant menu
router.get("/:id/menu", optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;

    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    let filter = { restaurant: req.params.id, isAvailable: true };

    if (category) {
      filter.category = new RegExp(category, "i");
    }

    const menuItems = await MenuItem.find(filter)
      .sort({ category: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MenuItem.countDocuments(filter);

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        restaurant: restaurant.name,
        menu: groupedMenu,
        items: menuItems,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
