import { db } from "./database";
import { hashPassword, comparePassword, generateToken } from "./auth";

export async function resetAuthForUser(email: string) {
  try {
    console.log(`🔧 Resetting auth for ${email}`);

    // Clear any existing accounts
    const deleteResult = db
      .prepare("DELETE FROM users WHERE email = ?")
      .run(email);
    console.log(`🗑️ Deleted ${deleteResult.changes} existing accounts`);

    // Create fresh account with known credentials
    const userId = `user-${Date.now()}`;
    const username = email.split("@")[0]; // Use email prefix as username
    const password = "password123";
    const passwordHash = await hashPassword(password);

    // Insert new user
    const insertResult = db
      .prepare(
        `
      INSERT INTO users (id, username, email, password_hash, mobile, is_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        userId,
        username,
        email,
        passwordHash,
        "1234567890",
        1, // Already verified
        new Date().toISOString(),
      );

    console.log(`✅ Created fresh account for ${email}`);

    // Test the login
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;
    const passwordTest = await comparePassword(password, user.password_hash);

    return {
      success: true,
      message: "Account reset successfully",
      credentials: {
        email: email,
        username: username,
        password: password,
      },
      passwordTest: passwordTest ? "✅ VALID" : "❌ INVALID",
    };
  } catch (error) {
    console.error("Reset auth error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function quickLogin(email: string, password: string) {
  try {
    // Find user
    const user = db
      .prepare(
        `
      SELECT id, username, email, mobile, password_hash, is_verified, created_at
      FROM users
      WHERE email = ? OR username = ?
    `,
      )
      .get(email, email) as any;

    if (!user) {
      return {
        success: false,
        message: "User not found",
        action: "reset_needed",
      };
    }

    // Check password
    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return {
        success: false,
        message: "Invalid password",
        hint: "Try 'password123'",
        action: "reset_needed",
      };
    }

    // Generate token
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      isVerified: user.is_verified,
      createdAt: user.created_at,
    };

    const token = generateToken(userResponse);

    return {
      success: true,
      message: "Login successful",
      user: userResponse,
      token: token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      action: "reset_needed",
    };
  }
}
