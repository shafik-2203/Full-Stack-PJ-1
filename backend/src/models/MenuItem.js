import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Appetizers",
        "Main Course",
        "Desserts",
        "Beverages",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snacks",
        "Pizza",
        "Burgers",
        "Pasta",
        "Rice",
        "Noodles",
        "Salads",
        "Soups",
        "Sushi Rolls",
        "Tacos",
        "Bowls",
        "Curries",
        "Power Bowls",
      ],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isSpicy: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: String,
      default: "15-20 mins",
    },
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    allergens: [String],
    tags: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index for performance
menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ rating: -1 });

export default mongoose.model("MenuItem", menuItemSchema);
