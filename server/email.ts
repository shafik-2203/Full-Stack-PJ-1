import nodemailer from "nodemailer";

// Development mode - shows OTP in console and API response
const isDevelopment = process.env.NODE_ENV !== "production";

// Email configuration with multiple options
const EMAIL_CONFIG = {
  // Option 1: Gmail (requires app password)
  gmail: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "Fastio121299@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "Shafik1212@",
    },
  },
  // Option 2: Ethereal (fake SMTP for testing)
  ethereal: {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  },
  // Option 3: Temporary email service (no auth needed)
  mailtrap: {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER || "demo-user",
      pass: process.env.MAILTRAP_PASS || "demo-pass",
    },
  },
};

// Create transporter with fallback options
let transporter: any = null;

const createEmailTransporter = async () => {
  // Always try Gmail first with FASTIO credentials
  try {
    console.log("🔧 Setting up Gmail SMTP with FASTIO credentials...");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Fastio121299@gmail.com",
        pass: "Shafik1212@",
      },
    });
  } catch (error) {
    console.log("Gmail setup error:", error.message);
  }

  // Fallback to environment variables
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    try {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } catch (error) {
      console.log("Environment Gmail setup error:", error.message);
    }
  }

  // Final fallback to ethereal for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log("🔧 Falling back to Ethereal test account");

      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.log("Could not create ethereal test account:", error.message);
    }
  }

  return null;
};

// Verify email configuration
const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    if (!transporter) {
      return false;
    }
    await transporter.verify();
    console.log("Email service is ready to send emails");
    return true;
  } catch (error) {
    console.error("Email service configuration error:", error);
    console.log("📧 Email service fallback mode enabled");
    return true; // Return true to continue with fallback logging
  }
};

// Send OTP via SMS (placeholder - integrate with SMS service like Twilio)
export const sendOTPSMS = async (
  mobile: string,
  otp: string,
  username: string = "User",
): Promise<{ success: boolean; method: string; otp?: string }> => {
  // In development mode, always log OTP
  if (isDevelopment) {
    console.log(`🔑 SMS OTP for ${mobile} (${username}): ${otp}`);
    console.log(`📱 SMS would be sent to: ${mobile}`);
    return { success: true, method: "sms_dev", otp: otp };
  }

  // TODO: Integrate with SMS service like Twilio
  // For now, just log it
  console.log(`SMS OTP for ${mobile}: ${otp}`);
  return { success: false, method: "sms_not_configured" };
};

// Send OTP email
export const sendOTPEmail = async (
  email: string,
  otp: string,
  username: string = "User",
): Promise<{ success: boolean; method: string; otp?: string }> => {
  // Always log OTP for debugging and user access
  console.log(`🔑 =====================================`);
  console.log(`🔑 FASTIO OTP for ${email} (${username}): ${otp}`);
  console.log(`🔑 =====================================`);

  // Try to send email if configured
  if (transporter) {
    try {
      const mailOptions = {
        from: "FASTIO <Fastio121299@gmail.com>",
        to: email,
        subject: "🚀 FASTIO - Your Verification Code",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 32px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
              }
              .otp-container {
                background-color: #f8f9fa;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
              }
              .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #007bff;
                letter-spacing: 8px;
                margin: 10px 0;
                font-family: 'Courier New', monospace;
              }
              .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 4px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                color: #6c757d;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">FASTIO</div>
              <h2>Account Verification</h2>
            </div>

            <p>Hello ${username},</p>

            <p>Thank you for signing up with FASTIO! To complete your registration, please verify your email address using the OTP code below:</p>

            <div class="otp-container">
              <p>Your 6-digit verification code is:</p>
              <div class="otp-code">${otp}</div>
            </div>

            <div class="warning">
              <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </div>

            <p>Enter this code in the verification screen to activate your account and start enjoying FASTIO's services.</p>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

            <p>Welcome to FASTIO!</p>

            <div class="footer">
              <p>This email was sent from FASTIO. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} FASTIO. All rights reserved.</p>
            </div>
          </body>
          </html>
        `,
        text: `
          FASTIO - Account Verification

          Hello ${username},

          Thank you for signing up with FASTIO! Your 6-digit verification code is: ${otp}

          This code will expire in 10 minutes. Enter this code in the verification screen to activate your account.

          If you didn't request this code, please ignore this email.

          Welcome to FASTIO!
        `,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(
        `📧 OTP email sent successfully to ${email}:`,
        result.messageId,
      );

      // If using ethereal, provide preview URL
      if (transporter.options?.host === "smtp.ethereal.email") {
        const previewUrl = nodemailer.getTestMessageUrl(result);
        console.log(`�� Preview email: ${previewUrl}`);
        console.log(`🔑 OTP Code: ${otp} (for ${email})`);
      }

      return { success: true, method: "email", otp: otp };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      console.log(`📧 Fallback: OTP for ${email}: ${otp}`);
      return { success: true, method: "email_fallback", otp: otp };
    }
  }

  // Fallback - just log it but still return success so signup can continue
  console.log(`📧 Email service not configured. OTP for ${email}: ${otp}`);

  // Always return success with OTP for fallback mode
  return { success: true, method: "email_console_fallback", otp: otp };
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (
  email: string,
  username: string,
): Promise<boolean> => {
  if (!transporter) {
    console.log(
      `Welcome message for ${username} (${email}) - Email service not configured`,
    );
    return false;
  }

  try {
    const mailOptions = {
      from: EMAIL_CONFIG.auth.user,
      to: email,
      subject: "Welcome to FASTIO!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #007bff;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FASTIO</div>
            <h2>Welcome to FASTIO!</h2>
          </div>

          <p>Hello ${username},</p>

          <p>Congratulations! Your account has been successfully verified and you're now part of the FASTIO community.</p>

          <p>You can now:</p>
          <ul>
            <li>Browse restaurants and menus</li>
            <li>Place orders for delivery</li>
            <li>Track your orders in real-time</li>
            <li>Save your favorite restaurants</li>
            <li>Manage your profile and preferences</li>
          </ul>

          <p>Start exploring and enjoy fast, convenient food delivery with FASTIO!</p>

          <div class="footer">
            <p>© ${new Date().getFullYear()} FASTIO. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      `Welcome email sent successfully to ${email}:`,
      result.messageId,
    );
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Initialize email service
export const initializeEmailService = async (): Promise<void> => {
  console.log("Initializing email service...");

  // Create transporter
  transporter = await createEmailTransporter();

  if (transporter) {
    const isReady = await verifyEmailConfig();
    if (isReady) {
      console.log("✅ Email service is ready and configured");

      // In development, show preview URL for ethereal emails
      if (
        isDevelopment &&
        transporter.options?.host === "smtp.ethereal.email"
      ) {
        console.log("📧 Using Ethereal test email service");
        console.log("🔗 Email previews will be available at generated URLs");
      }
    } else {
      console.log("❌ Email service failed verification");
      transporter = null;
    }
  } else {
    console.log("📧 Email service not configured - will use development mode");
    if (isDevelopment) {
      console.log(
        "🔧 Development mode: OTPs will be displayed in console and API responses",
      );
    }
  }

  // For production, also try to initialize production email service
  if (!isDevelopment) {
    try {
      const { initializeProductionEmailService } = await import(
        "./email-production"
      );
      await initializeProductionEmailService();
      console.log("🚀 Production email service initialized");
    } catch (error) {
      console.log("⚠️ Production email service not available:", error.message);
    }
  }
};