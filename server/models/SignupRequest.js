import mongoose from "mongoose";

const signupRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      enum: ["User", "Restaurant"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    restaurantInfo: {
      name: String,
      cuisine: [String],
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
      description: String,
    },
    rejectionReason: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("SignupRequest", signupRequestSchema);
