import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
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
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
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
      },
    ],
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "wallet"],
      required: true,
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      deliveryFee: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },
    deliveryPartner: {
      name: String,
      phone: String,
      vehicle: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index for performance
orderSchema.index({ user: 1 });
orderSchema.index({ restaurant: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `FASTIO${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
