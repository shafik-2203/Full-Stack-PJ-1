import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "@shared/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    isVerified: user.isVerified,
  };

  console.log(`🔑 Generating token for user: ${user.email}`);
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  console.log(`🔑 Token generated successfully (length: ${token.length})`);
  return token;
}

export function verifyToken(token: string): any {
  try {
    console.log(`🔍 Verifying token (length: ${token.length})`);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`✅ Token verified for user: ${decoded.email}`);
    return decoded;
  } catch (error) {
    console.error(`❌ Token verification failed: ${error.message}`);
    console.error(`🔍 Token: ${token.substring(0, 50)}...`);
    return null;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware to authenticate requests
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(`🔐 Auth check for ${req.method} ${req.path}`);
  console.log(`🔐 Auth header: ${authHeader ? "Present" : "Missing"}`);

  if (!token) {
    console.log(`❌ No token provided`);
    return res.status(401).json({
      success: false,
      message: "Access token required",
      code: "NO_TOKEN",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log(`❌ Token verification failed`);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "INVALID_TOKEN",
    });
  }

  req.user = decoded;
  console.log(`✅ User authenticated: ${decoded.email}`);
  next();
}

// Optional authentication middleware (doesn't fail if no token)
export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}
