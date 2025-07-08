import nodemailer from "nodemailer";

// Create Gmail transporter with your credentials
const createGmailTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: "mohamedshafik2526@gmail.com",
      pass: "ywotjxnnkdmghkba",
    },
  });
};

// Create OTP email HTML template
const createOTPEmailHTML = (otpCode: string, userName: string) => {
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

// Send OTP email with timeout
export const sendProductionOTPEmail = async (
  userEmail: string,
  otpCode: string,
  userName: string,
) => {
  try {
    console.log(`📧 Sending OTP ${otpCode} to ${userEmail} (${userName})`);

    // Try Gmail first with your credentials (with timeout)
    try {
      const transporter = createGmailTransporter();

      const mailOptions = {
        from: {
          name: "FASTIO Team",
          address: "mohamedshafik2526@gmail.com",
        },
        to: userEmail,
        subject: "🍽️ FASTIO - Verify Your Email Address",
        html: createOTPEmailHTML(otpCode, userName),
        text: `Hi ${userName}! Your FASTIO verification code is: ${otpCode}. This code expires in 10 minutes.`,
      };

      // Add timeout to prevent hanging
      const emailPromise = transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 5000),
      );

      const result = await Promise.race([emailPromise, timeoutPromise]);
      console.log(`✅ Gmail OTP sent successfully to ${userEmail}`);

      return {
        success: true,
        message:
          "OTP sent to your email successfully! Please check your inbox.",
        method: "gmail",
      };
    } catch (gmailError) {
      console.error("Gmail SMTP error:", gmailError);

      // Log OTP to console for development
      console.log(`🔑 ==========================================`);
      console.log(`🔑 FASTIO OTP FOR ${userEmail.toUpperCase()}: ${otpCode}`);
      console.log(`🔑 USERNAME: ${userName}`);
      console.log(`🔑 ==========================================`);

      return {
        success: true,
        message: `Email service unavailable. Your OTP is: ${otpCode} (Check server logs)`,
        method: "console",
      };
    }
  } catch (error) {
    console.error("Email sending error:", error);

    // Final fallback - always return success in development with clear OTP
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      return {
        success: true,
        message: `OTP is ${otpCode} (Check console logs - Email services not configured)`,
        method: "development_console",
        otp: otpCode,
      };
    }

    return {
      success: false,
      message: "Failed to send OTP email. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};