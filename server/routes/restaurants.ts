import express from "express";
import {
  getRestaurants,
  searchRestaurants,
  getCategories,
  getRestaurant,
  getRestaurantMenu,
} from "./restaurantHandlers.js";

const router = express.Router();

// Restaurant routes
router.get("/", getRestaurants);
router.get("/search", searchRestaurants);
router.get("/categories", getCategories);
router.get("/:id", getRestaurant);
router.get("/:id/menu", getRestaurantMenu);

export default router;
