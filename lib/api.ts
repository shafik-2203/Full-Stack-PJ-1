import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Network error occurred");
    }
  },

  signup: async (data) => {
    try {
      const res = await api.post("/api/auth/signup", data);
      return res.data;
    } catch (error) {
      console.error("🔴 Signup error:", error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Signup failed");
      }
      throw new Error("Network error occurred");
    }
  },

  sendOtp: async (email) => {
    try {
      const res = await api.post("/api/otp/send", { email });
      return res.data;
    } catch (error) {
      console.error("🔴 OTP send error:", error);
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to send OTP");
      }
      throw new Error("Network error occurred");
    }
  },

  verifyOtp: async (data) => {
    try {
      const res = await api.post("/api/auth/verify-otp", data);
      return res.data;
    } catch (error) {
      console.error("🔴 OTP verify error:", error);
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "OTP verification failed",
        );
      }
      throw new Error("Network error occurred");
    }
  },

  getRestaurants: async (params = {}) => {
    try {
      const res = await api.get("/api/restaurants", { params });
      return res.data;
    } catch (error) {
      console.error("🔴 Get restaurants error:", error);
      throw new Error("Failed to fetch restaurants");
    }
  },

  getRestaurant: async (id) => {
    try {
      const res = await api.get(`/api/restaurants/${id}`);
      return res.data;
    } catch (error) {
      console.error("🔴 Get restaurant error:", error);
      throw new Error("Failed to fetch restaurant details");
    }
  },

  getCategories: async () => {
    try {
      const res = await api.get("/api/restaurants/categories");
      return res.data;
    } catch (error) {
      console.error("🔴 Get categories error:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  searchRestaurants: async (query, params = {}) => {
    try {
      const res = await api.get("/api/restaurants/search", {
        params: { query, ...params },
      });
      return res.data;
    } catch (error) {
      console.error("🔴 Search restaurants error:", error);
      throw new Error("Failed to search restaurants");
    }
  },

  getMenuByRestaurant: async (restaurantId) => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}/menu`);
      return res.data;
    } catch (error) {
      console.error("🔴 Get menu error:", error);
      throw new Error("Failed to fetch menu");
    }
  },

  getMenuItems: async (restaurantId, params = {}) => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}/menu`, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error("🔴 Get menu items error:", error);
      throw new Error("Failed to fetch menu items");
    }
  },

  getOrders: async (token) => {
    try {
      const res = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("🔴 Get orders error:", error);
      throw new Error("Failed to fetch orders");
    }
  },

  placeOrder: async (data, token) => {
    try {
      const res = await api.post("/api/orders", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("🔴 Place order error:", error);
      throw new Error("Failed to place order");
    }
  },

  setToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },
};

export default apiClient;
