import express from "express";
import { hashPassword, generateToken } from "../utils/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Development only route to create test users
router.post("/create-test-users", async (req, res) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Not allowed in production",
      });
    }

    // Clear existing test users
    await User.deleteMany({
      email: { $in: ["fastio121299@gmail.com", "mohamedshafik2526@gmail.com"] },
    });

    const adminPassword = await hashPassword("Fastio1212@");
    const userPassword = await hashPassword("Shafik1212@");

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "fastio121299@gmail.com",
      password: adminPassword,
      mobile: "9999999999",
      role: "admin",
      isVerified: true,
    });

    // Create regular user
    const user = await User.create({
      username: "mohamedshafik",
      email: "mohamedshafik2526@gmail.com",
      password: userPassword,
      mobile: "8888888888",
      role: "user",
      isVerified: true,
    });

    res.json({
      success: true,
      message: "Test users created successfully",
      users: [
        {
          email: admin.email,
          password: "Fastio1212@",
          role: admin.role,
        },
        {
          email: user.email,
          password: "Shafik1212@",
          role: user.role,
        },
      ],
    });
  } catch (error) {
    console.error("Create test users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create test users",
      error: error.message,
    });
  }
});

// Development route to verify OTP without email
router.post("/verify-test-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Not allowed in production",
      });
    }

    // Find pending signup
    const PendingSignup = (await import("../models/PendingSignup.js")).default;
    const pending = await PendingSignup.findOne({ email: email.toLowerCase() });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Signup session not found",
      });
    }

    // Create user without OTP verification
    const user = new User({
      username: pending.username,
      email: pending.email,
      password: pending.password,
      mobile: pending.mobile,
      isVerified: true,
    });

    await user.save();
    await PendingSignup.deleteOne({ email: email.toLowerCase() });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Account verified successfully (test mode)",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        role: user.role,
        isAdmin: user.role === "admin" || user.role === "super_admin",
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Test OTP verify error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
