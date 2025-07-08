import { RequestHandler } from "express";
import { Restaurant, MenuItem } from "../database.js";
import { ApiResponse } from "@shared/api";

// Get all restaurants
export const getRestaurants: RequestHandler = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    let transformedRestaurants = [];

    try {
      const filter: any = { is_active: true };

      if (category) {
        filter.category = new RegExp(category as string, "i");
      }

      const restaurants = await Restaurant.find(filter)
        .sort({ rating: -1, createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Restaurant.countDocuments(filter);

      // Transform MongoDB documents to match expected format
      transformedRestaurants = restaurants.map((restaurant) => ({
        id: restaurant._id.toString(),
        name: restaurant.name,
        description: restaurant.description,
        image: restaurant.image_url || "",
        category: restaurant.category,
        rating: restaurant.rating,
        deliveryTime: restaurant.delivery_time,
        deliveryFee: restaurant.delivery_fee,
        minimumOrder: restaurant.minimum_order,
        isActive: restaurant.is_active,
      }));
    } catch (dbError) {
      console.log("🔄 Database unavailable, using fallback restaurant data");

      // Fallback restaurant data
      const fallbackRestaurants = [
        {
          id: "restaurant_1",
          name: "Pizza Palace",
          description: "Authentic Italian pizzas made with fresh ingredients",
          image: "",
          category: "Italian",
          rating: 4.5,
          deliveryTime: "25-35 min",
          deliveryFee: 2.99,
          minimumOrder: 15.0,
          isActive: true,
        },
        {
          id: "restaurant_2",
          name: "Burger Hub",
          description: "Gourmet burgers and crispy fries",
          image: "",
          category: "American",
          rating: 4.2,
          deliveryTime: "20-30 min",
          deliveryFee: 1.99,
          minimumOrder: 12.0,
          isActive: true,
        },
        {
          id: "restaurant_3",
          name: "Sushi Express",
          description: "Fresh sushi and Japanese cuisine",
          image: "",
          category: "Japanese",
          rating: 4.7,
          deliveryTime: "30-40 min",
          deliveryFee: 3.99,
          minimumOrder: 20.0,
          isActive: true,
        },
        {
          id: "restaurant_4",
          name: "Taco Fiesta",
          description: "Authentic Mexican tacos and burritos",
          image: "",
          category: "Mexican",
          rating: 4.3,
          deliveryTime: "15-25 min",
          deliveryFee: 2.49,
          minimumOrder: 10.0,
          isActive: true,
        },
        {
          id: "restaurant_5",
          name: "Indian Spice",
          description: "Traditional Indian curries and biryanis",
          image: "",
          category: "Indian",
          rating: 4.6,
          deliveryTime: "30-45 min",
          deliveryFee: 3.49,
          minimumOrder: 18.0,
          isActive: true,
        },
      ];

      // Apply category filter if specified
      transformedRestaurants = fallbackRestaurants.filter((restaurant) => {
        if (
          category &&
          !restaurant.category
            .toLowerCase()
            .includes((category as string).toLowerCase())
        ) {
          return false;
        }
        return true;
      });
    }

    res.json({
      success: true,
      data: transformedRestaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: transformedRestaurants.length,
        pages: Math.ceil(transformedRestaurants.length / Number(limit)),
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Search restaurants
export const searchRestaurants: RequestHandler = async (req, res) => {
  try {
    const { query, category, page = 1, limit = 20 } = req.query;

    let filter: any = { is_active: true };

    if (query) {
      filter.$or = [
        { name: new RegExp(query as string, "i") },
        { description: new RegExp(query as string, "i") },
        { category: new RegExp(query as string, "i") },
      ];
    }

    if (category) {
      filter.category = new RegExp(category as string, "i");
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Restaurant.countDocuments(filter);

    // Transform MongoDB documents to match expected format
    const transformedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant._id.toString(),
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image_url || "",
      category: restaurant.category,
      rating: restaurant.rating,
      deliveryTime: restaurant.delivery_time,
      deliveryFee: restaurant.delivery_fee,
      minimumOrder: restaurant.minimum_order,
      isActive: restaurant.is_active,
    }));

    res.json({
      success: true,
      data: transformedRestaurants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Search restaurants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Get restaurant categories
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await Restaurant.distinct("category", {
      is_active: true,
    });

    res.json({
      success: true,
      data: categories.sort(),
    } as ApiResponse);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Get single restaurant
export const getRestaurant: RequestHandler = async (req, res) => {
  try {
    let transformedRestaurant = null;

    try {
      const restaurant = await Restaurant.findOne({
        _id: req.params.id,
        is_active: true,
      });

      if (restaurant) {
        transformedRestaurant = {
          id: restaurant._id.toString(),
          name: restaurant.name,
          description: restaurant.description,
          image: restaurant.image_url || "",
          category: restaurant.category,
          rating: restaurant.rating,
          deliveryTime: restaurant.delivery_time,
          deliveryFee: restaurant.delivery_fee,
          minimumOrder: restaurant.minimum_order,
          isActive: restaurant.is_active,
        };
      }
    } catch (dbError) {
      console.log("🔄 Database unavailable, using fallback restaurant data");

      // Fallback restaurant data
      const fallbackRestaurants = {
        restaurant_1: {
          id: "restaurant_1",
          name: "Pizza Palace",
          description: "Authentic Italian pizzas made with fresh ingredients",
          image: "",
          category: "Italian",
          rating: 4.5,
          deliveryTime: "25-35 min",
          deliveryFee: 2.99,
          minimumOrder: 15.0,
          isActive: true,
        },
        restaurant_2: {
          id: "restaurant_2",
          name: "Burger Hub",
          description: "Gourmet burgers and crispy fries",
          image: "",
          category: "American",
          rating: 4.2,
          deliveryTime: "20-30 min",
          deliveryFee: 1.99,
          minimumOrder: 12.0,
          isActive: true,
        },
        restaurant_3: {
          id: "restaurant_3",
          name: "Sushi Express",
          description: "Fresh sushi and Japanese cuisine",
          image: "",
          category: "Japanese",
          rating: 4.7,
          deliveryTime: "30-40 min",
          deliveryFee: 3.99,
          minimumOrder: 20.0,
          isActive: true,
        },
      };

      transformedRestaurant =
        fallbackRestaurants[req.params.id as keyof typeof fallbackRestaurants];
    }

    if (!transformedRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: transformedRestaurant,
    } as ApiResponse);
  } catch (error) {
    console.error("Get restaurant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};

// Get restaurant menu
export const getRestaurantMenu: RequestHandler = async (req, res) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const restaurantId = req.params.id;

    let transformedMenuItems = [];

    try {
      const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        is_active: true,
      });

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        } as ApiResponse);
      }

      let filter: any = { restaurant_id: restaurantId, is_available: true };

      if (category) {
        filter.category = new RegExp(category as string, "i");
      }

      const menuItems = await MenuItem.find(filter)
        .sort({ category: 1, name: 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await MenuItem.countDocuments(filter);

      // Transform MongoDB documents to match expected format
      transformedMenuItems = menuItems.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image_url || "",
        category: item.category,
        restaurantId: item.restaurant_id.toString(),
        isAvailable: item.is_available,
      }));
    } catch (dbError) {
      console.log("🔄 Database unavailable, using fallback menu data");

      // Fallback menu data
      const fallbackMenuItems = {
        restaurant_1: [
          {
            id: "menu_1",
            name: "Margherita Pizza",
            description: "Classic tomato, mozzarella, and basil",
            price: 14.99,
            image: "",
            category: "Pizza",
            restaurantId: "restaurant_1",
            isAvailable: true,
          },
          {
            id: "menu_2",
            name: "Pepperoni Pizza",
            description: "Pepperoni with mozzarella cheese",
            price: 16.99,
            image: "",
            category: "Pizza",
            restaurantId: "restaurant_1",
            isAvailable: true,
          },
          {
            id: "menu_3",
            name: "Caesar Salad",
            description: "Fresh romaine lettuce with Caesar dressing",
            price: 9.99,
            image: "",
            category: "Salad",
            restaurantId: "restaurant_1",
            isAvailable: true,
          },
        ],
        restaurant_2: [
          {
            id: "menu_4",
            name: "Classic Burger",
            description: "Beef patty with lettuce, tomato, onion",
            price: 12.99,
            image: "",
            category: "Burger",
            restaurantId: "restaurant_2",
            isAvailable: true,
          },
          {
            id: "menu_5",
            name: "French Fries",
            description: "Crispy golden fries",
            price: 4.99,
            image: "",
            category: "Sides",
            restaurantId: "restaurant_2",
            isAvailable: true,
          },
          {
            id: "menu_6",
            name: "Chicken Wings",
            description: "Spicy buffalo wings",
            price: 8.99,
            image: "",
            category: "Appetizer",
            restaurantId: "restaurant_2",
            isAvailable: true,
          },
        ],
        restaurant_3: [
          {
            id: "menu_7",
            name: "California Roll",
            description: "Crab, avocado, cucumber",
            price: 8.99,
            image: "",
            category: "Sushi",
            restaurantId: "restaurant_3",
            isAvailable: true,
          },
          {
            id: "menu_8",
            name: "Salmon Sashimi",
            description: "Fresh salmon slices",
            price: 15.99,
            image: "",
            category: "Sashimi",
            restaurantId: "restaurant_3",
            isAvailable: true,
          },
          {
            id: "menu_9",
            name: "Miso Soup",
            description: "Traditional Japanese soup",
            price: 3.99,
            image: "",
            category: "Soup",
            restaurantId: "restaurant_3",
            isAvailable: true,
          },
        ],
      };

      const allItems =
        fallbackMenuItems[restaurantId as keyof typeof fallbackMenuItems] || [];

      // Apply category filter if specified
      transformedMenuItems = allItems.filter((item) => {
        if (
          category &&
          !item.category
            .toLowerCase()
            .includes((category as string).toLowerCase())
        ) {
          return false;
        }
        return true;
      });
    }

    // Group by category
    const groupedMenu = transformedMenuItems.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: transformedMenuItems,
      groupedData: groupedMenu,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: transformedMenuItems.length,
        pages: Math.ceil(transformedMenuItems.length / Number(limit)),
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Get restaurant menu error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ApiResponse);
  }
};
