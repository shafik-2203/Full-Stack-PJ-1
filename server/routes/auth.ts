import express from "express";
import {
  handleSignup,
  handleVerifyOTP,
  handleLogin,
  handleResendOTP,
  handleAdminLogin,
  handlePasswordResetRequest,
  handlePasswordReset,
} from "./authHandlers.js";

const router = express.Router();

// Auth routes
router.post("/signup", handleSignup);
router.post("/verify-otp", handleVerifyOTP);
router.post("/login", handleLogin);
router.post("/resend-otp", handleResendOTP);
router.post("/admin-login", handleAdminLogin);
router.post("/password-reset-request", handlePasswordResetRequest);
router.post("/password-reset", handlePasswordReset);

export default router;
