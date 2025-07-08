import { User } from "lucide-react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CartItem, Restaurant, Order, ApiClient, OrderStatus, RestaurantStatus } from "@/lib/types";
import { apiClient, type User } from "../lib/api";

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
      // Try MongoDB backend first
      try {
        const response = await apiClient.login({
          email: username.includes("@") ? username : "",
          password,
        });

        if (response.success && response.user) {
          const userResponse = {
            id: response.user.id,
            username: response.user.name,
            email: response.user.email,
            isVerified: true,
            role: response.user.isAdmin ? "admin" : "user",
          };

          setUser(userResponse);
          apiClient.setToken(response.token || "");
          localStorage.setItem("fastio_user", JSON.stringify(userResponse));
          localStorage.setItem("fastio_token", response.token || "");
          return;
        }
      } catch (mongoError) {
        console.log(
          "MongoDB login failed, falling back to local auth:",
          mongoError,
        );
      }

      // Fallback to local authentication
      const localUsers = [
        {
          id: "admin_1",
          username: "FastioAdmin",
          email: "fastio121299@gmail.com",
          password: "fastio1212",
          role: "admin",
          isVerified: true,
        },
        {
          id: "user_1",
          username: "Mohamed Shafik",
          email: "mohamedshafik2526@gmail.com",
          password: "Shafik1212@",
          role: "user",
          isVerified: true,
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = localUsers.find(
        (u) =>
          (u.email === username || u.username === username) &&
          u.password === password,
      );

      if (user) {
        const userResponse = {
          id: user.id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        };

        const token = `token_${user.id}_${Date.now()}`;

        setUser(userResponse);
        apiClient.setToken(token);
        localStorage.setItem("fastio_user", JSON.stringify(userResponse));
        localStorage.setItem("fastio_token", token);
      } else {
        throw new Error("Invalid email/username or password");
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
      // Local signup simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store the email for OTP verification
      localStorage.setItem("fastio_pending_email", userData.email);
      localStorage.setItem("fastio_pending_user", JSON.stringify(userData));

      // Simulate successful signup

      // Don't set user yet - they need to verify OTP first
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      // Local OTP verification - accept any 6-digit OTP
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit OTP");
      }

      // Get the pending user data
      const pendingUserData = localStorage.getItem("fastio_pending_user");
      if (!pendingUserData) {
        throw new Error("No pending signup found. Please signup again.");
      }

      const userData = JSON.parse(pendingUserData);
      const newUser = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        isVerified: true,
        role: "user",
      };

      const token = `token_${newUser.id}_${Date.now()}`;

      setUser(newUser);
      apiClient.setToken(token);
      localStorage.setItem("fastio_user", JSON.stringify(newUser));
      localStorage.setItem("fastio_token", token);

      // Clear pending data
      localStorage.removeItem("fastio_pending_email");
      localStorage.removeItem("fastio_pending_user");
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
