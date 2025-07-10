// testEmail.js (ES module version)
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendTestEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "shafik2203@gmail.com", // Replace or test with your email
      subject: "FASTIO Test Email",
      html: "<h1>This is a test email from your backend</h1>",
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};

sendTestEmail();
