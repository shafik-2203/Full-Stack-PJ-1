
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ success: true, restaurants });
  } catch (err) {
    console.error("❌ Error fetching restaurants:", err);
    res.status(500).json({ success: false, message: "Error fetching restaurants" });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const menuItems = await MenuItem.find({ restaurant: restaurantId });
    res.status(200).json({ success: true, menuItems });
  } catch (err) {
    console.error("❌ Error fetching menu items:", err);
    res.status(500).json({ success: false, message: "Error fetching menu items" });
  }
};
