import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  specialInstructions: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "Wallet", "Cash on Delivery"],
      required: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    notes: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId =
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

export default mongoose.model("Order", orderSchema);
