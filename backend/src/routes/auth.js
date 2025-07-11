import express from "express";
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateOTP,
  validatePassword,
  validatePhone,
  validateEmail,
} from "../utils/auth.js";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/email.js";
import User from "../models/User.js";
import PendingSignup from "../models/PendingSignup.js";

const router = express.Router();

// ✅ Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;

    if (!username || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    if (!validatePhone(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }, { mobile }],
      isVerified: true,
    });

    if (existingUser) {
      let field = "user";
      if (existingUser.email === email.toLowerCase()) field = "email";
      else if (existingUser.username === username) field = "username";
      else if (existingUser.mobile === mobile) field = "mobile";
      return res.status(400).json({
        success: false,
        message: `Account with this ${field} already exists`,
      });
    }

    await PendingSignup.deleteOne({ email: email.toLowerCase() });

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await hashPassword(password);

    const pendingSignup = new PendingSignup({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      otpCode,
      otpExpiresAt,
    });

    await pendingSignup.save();
    const emailResult = await sendOTPEmail(email, otpCode, username);

    res.status(200).json({
      success: true,
      message: emailResult.message,
      pendingSignup: true,
      email: email.toLowerCase(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ✅ OTP Verification
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const pending = await PendingSignup.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Signup session not found",
      });
    }

    if (Date.now() > pending.otpExpiresAt) {
      await PendingSignup.deleteOne({ email: email.toLowerCase() });
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please sign up again.",
      });
    }

    if (pending.otpCode !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

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
    await sendWelcomeEmail(user.email, user.username);

    res.json({
      success: true,
      message: "Account verified successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
