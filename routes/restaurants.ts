import express from "express";
import {
  getRestaurants,
  searchRestaurants,
  getCategories,
  getRestaurant,
  getRestaurantMenu,
} from "./restaurantHandlers.ts";

const router = express.Router();

// Restaurant routes
router.get("/", getRestaurants);
router.get("/search", searchRestaurants);
router.get("/categories", getCategories);
router.get("/:id", getRestaurant);
router.get("/:id/menu", getRestaurantMenu);

export default router;
