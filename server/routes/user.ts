
// Password validation function
const validatePassword = (
  password: string,
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (@$!%*?&)",
    };
  }
  return { isValid: true, message: "" };
};

// Phone number validation function
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

// Update user profile
export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { username, email, mobile } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as AuthResponse);
    }

    // Validation
    if (!username || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as AuthResponse);
    }

    // Phone number validation
    if (!validatePhoneNumber(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number (10-15 digits)",
      } as AuthResponse);
    }

    // Check if email, username, or phone is already taken by another user
    const existingUser = db
      .prepare(
        "SELECT id FROM users WHERE (LOWER(email) = LOWER(?) OR username = ? OR mobile = ?) AND id != ?",
      )
      .get(email, username, mobile, userId) as any;

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email, username, or phone number is already taken by another account",
      } as AuthResponse);
    }

    // Update user profile
    const updateStmt = db.prepare(`
      UPDATE users 
      SET username = ?, email = ?, mobile = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(username, email, mobile, userId);

    // Get updated user
    const updatedUser = db
      .prepare(
        "SELECT id, username, email, mobile, is_verified, created_at FROM users WHERE id = ?",
      )
      .get(userId) as any;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isVerified: updatedUser.is_verified,
        createdAt: updatedUser.created_at,
      },
    } as AuthResponse);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};

// Change user password
export const handleChangePassword: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      } as AuthResponse);
    }

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      } as AuthResponse);
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      } as AuthResponse);
    }

    // Get current user
    const user = db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(userId) as any;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password_hash,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      } as AuthResponse);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    const updateStmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(newPasswordHash, userId);

    res.json({
      success: true,
      message: "Password changed successfully",
    } as AuthResponse);
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as AuthResponse);
  }
};