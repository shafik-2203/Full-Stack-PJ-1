import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

let otpStore = {}; // store OTPs in-memory

router.post("/send", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP failed", error: err });
  }
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const isValid = otpStore[email] == otp;
  res.status(isValid ? 200 : 400).json({ success: isValid });
});

export default router;
