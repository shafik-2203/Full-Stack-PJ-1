import axios from "axios";

// Base API instance
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://fullstack-pj1-bd.onrender.com";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Core API client methods
export const apiClient = {
  // 🔐 Login
  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  },

  // 📝 Signup
  signup: async ({
    username,
    email,
    password,
    mobile,
  }: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }) => {
    const res = await api.post("/api/auth/signup", {
      username,
      email,
      password,
      mobile,
    });
    return res.data;
  },

  // 🔐 Verify OTP
  verifyOTP: async ({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }) => {
    const res = await api.post("/api/auth/verify-otp", { email, otp });
    return res.data;
  },

  // 🔐 Forgot password request (send OTP)
  forgotPassword: async ({ email }: { email: string }) => {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
  },

  // 🔐 Reset password
  resetPassword: async ({
    email,
    otp,
    newPassword,
  }: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const res = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  },

  // 🙋‍♂️ Get Profile (protected)
  getProfile: async () => {
    const res = await api.get("/api/user/profile");
    return res.data;
  },

  // ✍️ Update Profile (protected)
  updateProfile: async ({
    username,
    mobile,
  }: {
    username: string;
    mobile: string;
  }) => {
    const res = await api.put("/api/user/profile", {
      username,
      mobile,
    });
    return res.data;
  },

  // Token management
  setToken: (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  clearToken: () => {
    delete api.defaults.headers.common["Authorization"];
  },
};
