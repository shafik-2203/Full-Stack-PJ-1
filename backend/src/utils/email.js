import nodemailer from "nodemailer";

// ✅ Corrected createTransporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// 📧 Create OTP email HTML
const createOTPEmailHTML = (otpCode, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FASTIO - Email Verification</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .header-text { color: white; font-size: 18px; margin: 0; }
        .content { padding: 40px 30px; text-align: center; }
        .otp-box { background-color: #ff6b35; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 10px; margin: 30px 0; letter-spacing: 8px; }
        .message { font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #666; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🍽️ FASTIO</div>
          <p class="header-text">Lightning-fast food delivery</p>
        </div>
        <div class="content">
          <h2>Hi ${userName}! 👋</h2>
          <p class="message">
            Welcome to FASTIO! We're excited to have you join our community of food lovers.
            Please use the verification code below to complete your account setup.
          </p>
          <div class="otp-box">${otpCode}</div>
          <div class="warning">
            ⚠️ This code will expire in 10 minutes. Please verify your account soon!
          </div>
          <p class="message">
            If you didn't create an account with FASTIO, please ignore this email.
            Your account will not be activated without verification.
          </p>
        </div>
        <div class="footer">
          <p>© 2024 FASTIO. All rights reserved.</p>
          <p>Get your favorite food delivered in minutes! 🚀</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ✅ Send OTP Email
export const sendOTPEmail = async (email, otpCode, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "FASTIO Team",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "🍽️ FASTIO - Verify Your Email Address",
      html: createOTPEmailHTML(otpCode, userName),
      text: `Hi ${userName}! Your FASTIO verification code is: ${otpCode}. This code expires in 10 minutes.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);

    return {
      success: true,
      message: "OTP sent to your email successfully! Please check your inbox.",
      method: "email",
    };
  } catch (error) {
    console.error("Email sending error:", error);

    // If in development, show OTP in logs
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔑 FASTIO OTP FOR ${email.toUpperCase()}: ${otpCode}`);
      return {
        success: true,
        message: `Email service unavailable. Your OTP is: ${otpCode}`,
        method: "console",
        otp: otpCode,
      };
    }

    return {
      success: false,
      message: "Failed to send OTP email. Please try again.",
      error: error.message,
    };
  }
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "FASTIO Team",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "🎉 Welcome to FASTIO - Let's Get Started!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 40px; text-align: center; color: white;">
            <h1>🍽️ Welcome to FASTIO!</h1>
            <p>Hi ${userName}! 👋</p>
          </div>
          <div style="padding: 40px; text-align: center;">
            <h2>Your account is ready! 🎉</h2>
            <p>Start exploring amazing restaurants and get your favorite food delivered in minutes.</p>
            <div style="margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/restaurants" style="background-color: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Browse Restaurants</a>
            </div>
          </div>
        </div>
      `,
      text: `Welcome to FASTIO, ${userName}! Your account is ready. Start exploring restaurants and order your favorite food.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error: error.message };
  }
};
