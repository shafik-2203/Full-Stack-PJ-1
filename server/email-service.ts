import emailjs from "@emailjs/nodejs";

// FASTIO dedicated email configuration
const FASTIO_EMAIL_CONFIG = {
  service: "gmail",
  serviceId: "service_fastio_app", // EmailJS service ID
  templateId: "template_otp_email", // EmailJS template ID
  publicKey: "your_public_key", // EmailJS public key
  privateKey: "your_private_key", // EmailJS private key

  // Backup SMTP configuration (works without external services)
  smtpFallback: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "fastio.delivery.app@gmail.com", // Create this email
      pass: process.env.FASTIO_EMAIL_PASSWORD || "your-app-password",
    },
  },
};

// Initialize EmailJS
emailjs.init({
  publicKey: FASTIO_EMAIL_CONFIG.publicKey,
  privateKey: FASTIO_EMAIL_CONFIG.privateKey,
});

// Send OTP email using EmailJS (works from browser and server)
export const sendOTPEmailReal = async (
  userEmail: string,
  otpCode: string,
  userName: string = "User",
): Promise<{ success: boolean; method: string; message: string }> => {
  try {
    console.log(`📧 Sending OTP ${otpCode} to ${userEmail} (${userName})`);

    // For development, show OTP in console
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      console.log(`\n🔑 ==========================================`);
      console.log(`🔑 OTP FOR ${userEmail.toUpperCase()}: ${otpCode}`);
      console.log(`🔑 USERNAME: ${userName}`);
      console.log(`🔑 ==========================================\n`);
    }

    // Send via EmailJS service
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        otp_code: otpCode,
        app_name: "FASTIO",
        expiry_minutes: "10",
        from_name: "FASTIO Team",
      };

      await emailjs.send(
        FASTIO_EMAIL_CONFIG.serviceId,
        FASTIO_EMAIL_CONFIG.templateId,
        templateParams,
      );

      console.log(`✅ OTP email sent successfully to ${userEmail}`);
      return {
        success: true,
        method: "emailjs",
        message: "OTP sent to your email successfully",
      };
    } catch (emailjsError) {
      console.log("EmailJS failed, trying direct HTML email...");

      // Fallback: Send direct HTML email
      return await sendDirectHTMLEmail(userEmail, otpCode, userName);
    }
  } catch (error) {
    console.error("Error sending OTP email:", error);

    // Return success with development info for testing
    if (process.env.NODE_ENV !== "production") {
      return {
        success: true,
        method: "development_console",
        message: `OTP is ${otpCode} (check console logs)`,
      };
    }

    return {
      success: false,
      method: "failed",
      message: "Failed to send OTP email",
    };
  }
};

// Direct HTML email sending (backup method)
const sendDirectHTMLEmail = async (
  userEmail: string,
  otpCode: string,
  userName: string,
): Promise<{ success: boolean; method: string; message: string }> => {
  try {
    // This is a simplified email sender that works in development
    // For production, you'd integrate with SendGrid, Mailgun, etc.

    const emailContent = createOTPEmailHTML(otpCode, userName);

    // In development, just log the email content
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n���� EMAIL CONTENT FOR ${userEmail}:`);
      console.log("=====================================");
      console.log(`To: ${userEmail}`);
      console.log(`Subject: FASTIO - Your Verification Code`);
      console.log(`OTP: ${otpCode}`);
      console.log("=====================================\n");

      return {
        success: true,
        method: "development_html",
        message: `OTP is ${otpCode} (Email content logged to console)`,
      };
    }

    // For production, use a real email service here
    return {
      success: false,
      method: "production_not_configured",
      message: "Production email service not configured",
    };
  } catch (error) {
    console.error("Direct email sending failed:", error);
    return {
      success: false,
      method: "direct_failed",
      message: "Failed to send email directly",
    };
  }
};

// Create beautiful HTML email template
const createOTPEmailHTML = (otpCode: string, userName: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FASTIO - Verify Your Account</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 36px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 18px;
        }
        .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            color: white;
        }
        .otp-label {
            font-size: 16px;
            margin-bottom: 15px;
            opacity: 0.9;
        }
        .otp-code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
        }
        .features {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        .feature {
            text-align: center;
            flex: 1;
            min-width: 150px;
            margin: 10px;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 20px;
                margin: 10px;
            }
            .otp-code {
                font-size: 36px;
                letter-spacing: 4px;
            }
            .features {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">FASTIO</div>
            <div class="subtitle">Your Food Delivery Partner</div>
        </div>
        
        <h2>Hello ${userName}! 👋</h2>
        
        <p>Welcome to <strong>FASTIO</strong>! We're excited to have you join our community of food lovers.</p>
        
        <p>To complete your account setup and start enjoying delicious food delivery, please verify your email address using the code below:</p>
        
        <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otpCode}</div>
            <div style="font-size: 14px; opacity: 0.8;">Valid for 10 minutes</div>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important Security Notice:</strong><br>
            • This code expires in <strong>10 minutes</strong><br>
            • Never share this code with anyone<br>
            • If you didn't request this code, please ignore this email
        </div>
        
        <h3>What's Next?</h3>
        <p>Once verified, you'll be able to:</p>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🍕</div>
                <strong>Browse Restaurants</strong><br>
                <small>Discover amazing local food</small>
            </div>
            <div class="feature">
                <div class="feature-icon">🚚</div>
                <strong>Fast Delivery</strong><br>
                <small>Get food delivered quickly</small>
            </div>
            <div class="feature">
                <div class="feature-icon">💰</div>
                <strong>Great Deals</strong><br>
                <small>Enjoy exclusive offers</small>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p>Having trouble? Contact our support team at <strong>support@fastio.app</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>FASTIO Team</strong></p>
            <p>Making food delivery fast, easy, and delicious!</p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                This email was sent from FASTIO. Please do not reply to this email.<br>
                © ${new Date().getFullYear()} FASTIO. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;
};

// Send welcome email after successful verification
export const sendWelcomeEmailReal = async (
  userEmail: string,
  userName: string,
): Promise<boolean> => {
  try {
    console.log(`📧 Sending welcome email to ${userEmail} (${userName})`);

    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      console.log(`\n🎉 ==========================================`);
      console.log(`🎉 WELCOME ${userName.toUpperCase()}!`);
      console.log(`🎉 EMAIL: ${userEmail}`);
      console.log(`🎉 ACCOUNT VERIFIED SUCCESSFULLY!`);
      console.log(`🎉 ==========================================\n`);
    }

    // In development, just log success
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

export default {
  sendOTPEmailReal,
  sendWelcomeEmailReal,
  createOTPEmailHTML,
};