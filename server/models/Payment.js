import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["UPI", "Card", "Wallet", "Cash on Delivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded", "Cancelled"],
      default: "Pending",
    },
    gateway: {
      type: String,
      enum: ["Razorpay", "Stripe", "PayPal", "PhonePe", "GooglePay", "Paytm"],
    },
    gatewayTransactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    currency: {
      type: String,
      default: "INR",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    failureReason: String,
    processedAt: Date,
    refundedAt: Date,
  },
  {
    timestamps: true,
  },
);

paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId =
      "TXN-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);
