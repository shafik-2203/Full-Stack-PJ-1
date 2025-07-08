
// Middleware to ensure only registered users can login
export const enforceRegistration: RequestHandler = (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  // Check if user exists in database
  const user = db
    .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
    .get(username, username);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Account not found. Please sign up first.",
      requiresSignup: true,
    });
  }

  next();
};

// Check if user needs verification
export const checkVerificationStatus: RequestHandler = (req, res, next) => {
  const { username } = req.body;

  const user = db
    .prepare(
      "SELECT is_verified, email FROM users WHERE username = ? OR email = ?",
    )
    .get(username, username) as any;

  if (user && !user.is_verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your account. Check your email for OTP.",
      requiresVerification: true,
      email: user.email,
    });
  }

  next();
};