import express from "express";
import {
  hashPassword,
  comparePassword,
  validatePassword,
  validatePhone,
  validateEmail,
} from "../utils/auth.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, email, mobile, profile } = req.body;

    // Validation
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (mobile && !validatePhone(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Check for duplicates (excluding current user)
    if (email || username || mobile) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user.id },
        $or: [
          ...(email ? [{ email: email.toLowerCase() }] : []),
          ...(username ? [{ username }] : []),
          ...(mobile ? [{ mobile }] : []),
        ],
      });

      if (existingUser) {
        let conflictField = "";
        if (existingUser.email === email?.toLowerCase())
          conflictField = "email";
        else if (existingUser.username === username) conflictField = "username";
        else if (existingUser.mobile === mobile) conflictField = "phone number";

        return res.status(400).json({
          success: false,
          message: `This ${conflictField} is already taken`,
        });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();
    if (mobile) updateData.mobile = mobile;
    if (profile) updateData.profile = { ...req.user.profile, ...profile };

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Change password
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id);

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Hash new password
    const newHashedPassword = await hashPassword(newPassword);

    // Update password
    await User.findByIdAndUpdate(req.user.id, {
      password: newHashedPassword,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Add address
router.post("/addresses", authenticate, async (req, res) => {
  try {
    const { label, street, city, state, zipCode, isDefault } = req.body;

    if (!label || !street || !city || !state || !zipCode) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    const user = await User.findById(req.user.id);

    // If this is default, unset other defaults
    if (isDefault) {
      user.profile.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.profile.addresses.push({
      label,
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || user.profile.addresses.length === 0,
    });

    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      data: user.profile.addresses,
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user addresses
router.get("/addresses", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("profile.addresses");

    res.json({
      success: true,
      data: user.profile.addresses || [],
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
