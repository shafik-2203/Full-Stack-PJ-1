
// Admin user credentials and permissions
const ADMIN_USERS = [
  {
    email: "mohamedshafik2526@gmail.com",
    password: "Shafik1212@",
    role: "super_admin",
  },
];

// Check if user is admin
export function isAdminUser(email: string, password?: string): boolean {
  const adminUser = ADMIN_USERS.find((admin) => admin.email === email);
  if (!adminUser) {
    // Check if user is in admin_permissions table
    try {
      const stmt = db.prepare(`
        SELECT * FROM admin_permissions
        WHERE email = ? AND is_active = 1
      `);
      const result = stmt.get(email);
      return !!result;
    } catch (error) {
      return false;
    }
  }

  if (password) {
    return adminUser.password === password;
  }

  return true;
}

// Middleware to check admin authentication
export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Admin ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required",
    });
  }

  try {
    const credentials = authHeader.substring(6); // Remove 'Admin '
    const [email, password] = Buffer.from(credentials, "base64")
      .toString()
      .split(":");

    if (!isAdminUser(email, password)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.adminUser = {
      email,
      role: email === "mohamedshafik2526@gmail.com" ? "super_admin" : "admin",
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  }
}

// Initialize admin permissions table
export function initializeAdminPermissions() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_permissions (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        granted_by TEXT NOT NULL,
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        department TEXT NOT NULL,
        employee_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_by TEXT,
        approved_at DATETIME
      )
    `);
  } catch (error) {
    console.error("Error creating admin tables:", error);
  }
}