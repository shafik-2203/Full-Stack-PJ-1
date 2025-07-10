import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-delete expired pending signups after 24 hours
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("PendingSignup", pendingSignupSchema);
