import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = () => {
      const token = localStorage.getItem("fastio_token");
      const userData = localStorage.getItem("fastio_user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          apiClient.setToken(token);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("fastio_token");
          localStorage.removeItem("fastio_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password });

      if (response.success && response.user && response.token) {
        setUser(response.user);
        apiClient.setToken(response.token);
        localStorage.setItem("fastio_user", JSON.stringify(response.user));
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => {
    try {
      const response = await apiClient.signup(userData);

      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }

      // Don't set user yet - they need to verify OTP first
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyOTP({ email, otp });

      if (response.success && response.user && response.token) {
        setUser(response.user);
        apiClient.setToken(response.token);
        localStorage.setItem("fastio_user", JSON.stringify(response.user));
      } else {
        throw new Error(response.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await apiClient.resendOTP(email);

      if (!response.success) {
        throw new Error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem("fastio_token");
    localStorage.removeItem("fastio_user");
    localStorage.removeItem("fastio_cart");
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    verifyOTP,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
