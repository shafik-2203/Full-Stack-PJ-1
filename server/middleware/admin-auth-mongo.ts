import jwt from "jsonwebtoken";

// Extend Request interface to include adminUser
declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware to check admin authentication via JWT
export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required",
    });
  }

  try {
    const token = authHeader.substring(7); // Remove 'Bearer '
    const jwtSecret =
      process.env.JWT_SECRET ||
      "fastio-super-secret-jwt-key-2024-production-ready";

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Check if user has admin role
    if (!decoded.role || !["admin", "super_admin"].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    req.adminUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
}

// Check if user is admin by email (for manual verification)
export async function isAdminUser(email: string): Promise<boolean> {
  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: { $in: ["admin", "super_admin"] },
    });
    return !!user;
  } catch (error) {
    console.error("Error checking admin user:", error);
    return false;
  }
}

// Middleware to check super admin authentication
export function requireSuperAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // First check if user is authenticated as admin
  requireAdminAuth(req, res, () => {
    // Then check if user is super admin
    if (req.adminUser?.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super admin privileges required.",
      });
    }
    next();
  });
}