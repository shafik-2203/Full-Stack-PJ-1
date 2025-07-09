import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  username?: string;
  name?: string;
  email: string;
  mobile?: string;
  phone?: string;
  isVerified?: boolean;
  role?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  totalOrders?: number;
  totalSpent?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // For demo purposes, we'll simulate API calls
      fetchUser();
    } else {
      // Check if there's a stored token from localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        // For demo purposes, auto-login with demo user
        const demoLogin = localStorage.getItem("auto_demo_login");
        if (!demoLogin) {
          localStorage.setItem("auto_demo_login", "true");
          login("demo@fastio.com", "demo123");
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      // Simulate API call for demo
      const mockUser = {
        id: "1",
        username: "demo_user",
        email: "demo@fastio.com",
        mobile: "555-123-4567",
        isVerified: true,
        totalOrders: 5,
        totalSpent: 127.5,
      };
      setUser(mockUser);
    } catch (error) {
      logout(); // if token is invalid
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Demo login - accept demo@fastio.com with any password
      if (email === "demo@fastio.com") {
        const mockToken = "demo_token_" + Date.now();
        localStorage.setItem("token", mockToken);
        setToken(mockToken);
        toast.success("Login successful");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => {
    try {
      // Simulate signup
      toast.success("Signup successful! Verify OTP.");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      // Simulate OTP verification
      toast.success("OTP Verified! You can now log in.");
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  const resendOTP = async (email: string) => {
    try {
      // Simulate resend OTP
      toast.success("OTP resent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        verifyOTP,
        resendOTP,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
