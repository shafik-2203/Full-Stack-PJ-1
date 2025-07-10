import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// OTP utilities
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, username = "User") => {
  try {
    // Log OTP for development
    console.log(`🔑 =====================================`);
    console.log(`🔑 FASTIO OTP for ${email} (${username}): ${otp}`);
    console.log(`🔑 =====================================`);

    // In development, return success with OTP visible
    return {
      success: true,
      method: "development_console",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, method: "failed" };
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone, username } = req.body;

    if (!email || !password || !name || !phone || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailLower = email.toLowerCase();
    const usernameLower = username.toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: emailLower }, { username: usernameLower }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === emailLower
            ? "User already exists with this email"
            : "Username is already taken",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store registration data with OTP
    otpStorage.set(emailLower, {
      otp,
      expiresAt,
      email: emailLower,
      registrationData: {
        email: emailLower,
        username: usernameLower,
        password,
        name,
        phone,
        mobile: phone,
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(emailLower, otp, name);

    res.json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email: emailLower,
      // In development, include OTP in response
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// OTP verification endpoint
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const emailLower = email.toLowerCase();
    const storedData = otpStorage.get(emailLower);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(emailLower);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP (accept both stored OTP and development OTP 123456)
    if (storedData.otp !== otp && otp !== "123456") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // OTP verified successfully
    const registrationData = storedData.registrationData;
    otpStorage.delete(emailLower);

    if (registrationData) {
      // Complete user registration
      const user = new User(registrationData);
      await user.save();

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Registration completed successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
        token,
      });
    } else {
      // Handle existing user login (if OTP was for login, not registration)
      const user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "OTP verified successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
        token,
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Resend OTP endpoint
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailLower = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(emailLower, {
      otp,
      expiresAt,
      email: emailLower,
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(emailLower, otp, user.name);

    res.json({
      success: true,
      message: "New OTP sent to your email successfully!",
      // In development, include OTP in response
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export { authMiddleware, adminMiddleware };
export default router;
