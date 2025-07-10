import { verifyToken } from "../utils/auth.js";
import User from "../models/User.js";

// Authenticate user middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format.",
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User not found.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please verify your email first.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    });
  }
};

// Admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "super_admin")
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Super admin authorization middleware
export const authorizeSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super admin privileges required.",
    });
  }
  next();
};

// Optional authentication middleware
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select("-password");
        if (user && user.isVerified) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
