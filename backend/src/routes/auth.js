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

/* ========================
   ✅ Signup - Send OTP
======================== */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;

    // Validation
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.isValid) {
      return res.status(400).json({ success: false, message: pwCheck.message });
    }
    if (!validatePhone(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    // Check for existing verified users
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }, { mobile }],
      isVerified: true,
    });

    if (existingUser) {
      let conflictField = "user";
      if (existingUser.email === email.toLowerCase()) conflictField = "email";
      else if (existingUser.username === username) conflictField = "username";
      else if (existingUser.mobile === mobile) conflictField = "mobile";

      return res.status(400).json({
        success: false,
        message: `Account with this ${conflictField} already exists`,
      });
    }

    // Remove any previous pending signup
    await PendingSignup.deleteOne({ email: email.toLowerCase() });

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const hashedPassword = await hashPassword(password);

    const pending = new PendingSignup({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      otpCode,
      otpExpiresAt,
    });

    await pending.save();
    const emailResult = await sendOTPEmail(email, otpCode, username);

    res.status(200).json({
      success: true,
      message: emailResult.message,
      pendingSignup: true,
      email: email.toLowerCase(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================
   ✅ OTP Verification
======================== */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP required" });
    }

    const pending = await PendingSignup.findOne({ email: email.toLowerCase() });
    if (!pending) {
      return res.status(404).json({ success: false, message: "Signup session not found" });
    }

    if (Date.now() > new Date(pending.otpExpiresAt).getTime()) {
      await PendingSignup.deleteOne({ email: email.toLowerCase() });
      return res.status(400).json({ success: false, message: "OTP expired. Please sign up again." });
    }

    if (pending.otpCode !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Create verified user
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

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================
   ✅ Login
======================== */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username/email and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: username.toLowerCase() }, { username }],
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your account" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
/* ========================
   ✅ Admin Login
======================== */
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found or unauthorized",
      });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = generateToken(admin);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
