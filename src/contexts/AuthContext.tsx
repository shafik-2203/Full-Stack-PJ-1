
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
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await apiClient.get("/api/users/me");
      setUser(res.data);
    } catch (error) {
      logout(); // if token is invalid
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await apiClient.post("/api/auth/login", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      setToken(token);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => {
    try {
      await apiClient.post("/api/auth/signup", userData);
      toast.success("Signup successful! Verify OTP.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      await apiClient.post("/api/auth/verify-otp", { email, otp });
      toast.success("OTP Verified! You can now log in.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await apiClient.post("/api/auth/resend-otp", { email });
      toast.success("OTP resent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
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
