import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      addresses: [
        {
          label: String,
          street: String,
          city: String,
          state: String,
          zipCode: String,
          isDefault: { type: Boolean, default: false },
        },
      ],
    },
    preferences: {
      cuisine: [String],
      dietaryRestrictions: [String],
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes are automatically created by unique: true constraint
// No need for duplicate indexes

export default mongoose.model("User", userSchema);
