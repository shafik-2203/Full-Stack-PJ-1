import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Indian",
        "Chinese",
        "Italian",
        "Mexican",
        "Thai",
        "American",
        "Japanese",
        "Mediterranean",
        "Fast Food",
        "Desserts",
        "Beverages",
      ],
    },
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
    deliveryTime: {
      type: String,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    contact: {
      phone: String,
      email: String,
    },
    timings: {
      open: String,
      close: String,
      isOpen24x7: { type: Boolean, default: false },
    },
    features: [
      {
        type: String,
        enum: [
          "Pure Veg",
          "Home Delivery",
          "Takeaway",
          "Card Payment",
          "Cash Payment",
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index for performance
restaurantSchema.index({ category: 1 });
restaurantSchema.index({ rating: -1 });
restaurantSchema.index({ isActive: 1 });

export default mongoose.model("Restaurant", restaurantSchema);
