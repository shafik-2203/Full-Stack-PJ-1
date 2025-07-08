
export async function testLogin(username: string, password: string) {
  console.log(`🧪 Testing login: "${username}" with password: "${password}"`);

  // Find user
  const user = db
    .prepare(
      `
    SELECT id, username, email, mobile, password_hash, is_verified, created_at
    FROM users
    WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) OR username = ?
  `,
    )
    .get(username, username, username) as any;

  if (!user) {
    return {
      success: false,
      error: "User not found",
      searched: username,
    };
  }

  console.log(`👤 Found user: ${user.email} / ${user.username}`);

  // Test password
  const isValid = await comparePassword(password, user.password_hash);

  console.log(
    `🔐 Password test result: ${isValid ? "✅ VALID" : "❌ INVALID"}`,
  );

  return {
    success: isValid,
    user: {
      email: user.email,
      username: user.username,
      verified: user.is_verified,
    },
    passwordValid: isValid,
  };
}