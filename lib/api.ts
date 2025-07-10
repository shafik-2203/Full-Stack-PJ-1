import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiClient = {
  login: async (data) => {
    try {
      const res = await api.post("/api/auth/login", data);
      return res.data;
    } catch (error) {
      console.error("🔴 Login error:", error);
      throw error;
    }
  },

  signup: async (data) => {
    try {
      const res = await api.post("/api/auth/signup", data);
      return res.data;
    } catch (error) {
      console.error("🔴 Signup error:", error);
      throw error;
    }
  },

  sendOtp: async (email) => {
    const res = await api.post("/api/otp/send", { email });
    return res.data;
  },

  verifyOtp: async (data) => {
    const res = await api.post("/api/otp/verify", data);
    return res.data;
  },

  getRestaurants: async () => {
    const res = await api.get("/api/restaurants");
    return res.data;
  },

  getMenuByRestaurant: async (restaurantId) => {
    const res = await api.get(`/api/restaurants/${restaurantId}/menu`);
    return res.data;
  },

  getOrders: async (token) => {
    const res = await api.get("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  placeOrder: async (data, token) => {
    const res = await api.post("/api/orders", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },

  setToken: (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
};

export default apiClient;
