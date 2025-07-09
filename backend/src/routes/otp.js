import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();
let otpStore = {}; // In-memory OTP store

// Send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Optional: verify the transporter connection
    await transporter.verify();

    await transporter.sendMail({
      from: `"FastIO Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error });
  }
});

// Verify OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const isValid = otpStore[email] == otp;

  if (isValid) {
    delete otpStore[email]; // clear used OTP
    return res.status(200).json({ success: true, message: "OTP verified" });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
});

export default router;
