import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Mock fallback data for when backend is empty
const mockRestaurants = [
  {
    _id: "mock1",
    name: "Pizza Palace",
    description: "Authentic Italian pizzas made with fresh ingredients",
    category: "Italian",
    rating: 4.5,
    deliveryTime: "25-35 min",
    deliveryFee: 49,
    minimumOrder: 199,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mock2",
    name: "Burger Hub",
    description: "Gourmet burgers and crispy fries",
    category: "American",
    rating: 4.2,
    deliveryTime: "20-30 min",
    deliveryFee: 29,
    minimumOrder: 149,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mock3",
    name: "Sushi Express",
    description: "Fresh sushi and Japanese cuisine",
    category: "Japanese",
    rating: 4.7,
    deliveryTime: "30-40 min",
    deliveryFee: 59,
    minimumOrder: 299,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "mock4",
    name: "Spice Garden",
    description: "Traditional Indian cuisine with authentic flavors",
    category: "Indian",
    rating: 4.6,
    deliveryTime: "35-45 min",
    deliveryFee: 39,
    minimumOrder: 249,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const mockMenuItems = {
  mock1: {
    success: true,
    data: {
      restaurant: "Pizza Palace",
      menu: {
        Pizza: [
          {
            _id: "menu1",
            name: "Margherita Pizza",
            description: "Classic tomato, mozzarella, and basil",
            price: 299,
            category: "Pizza",
            restaurant: "mock1",
            isAvailable: true,
          },
          {
            _id: "menu2",
            name: "Pepperoni Pizza",
            description: "Pepperoni with mozzarella cheese",
            price: 399,
            category: "Pizza",
            restaurant: "mock1",
            isAvailable: true,
          },
        ],
        Salads: [
          {
            _id: "menu3",
            name: "Caesar Salad",
            description: "Fresh romaine with caesar dressing",
            price: 199,
            category: "Salads",
            restaurant: "mock1",
            isAvailable: true,
          },
        ],
      },
      items: [
        {
          _id: "menu1",
          name: "Margherita Pizza",
          description: "Classic tomato, mozzarella, and basil",
          price: 299,
          category: "Pizza",
          restaurant: "mock1",
          isAvailable: true,
        },
        {
          _id: "menu2",
          name: "Pepperoni Pizza",
          description: "Pepperoni with mozzarella cheese",
          price: 399,
          category: "Pizza",
          restaurant: "mock1",
          isAvailable: true,
        },
        {
          _id: "menu3",
          name: "Caesar Salad",
          description: "Fresh romaine with caesar dressing",
          price: 199,
          category: "Salads",
          restaurant: "mock1",
          isAvailable: true,
        },
      ],
    },
  },
  mock2: {
    success: true,
    data: {
      restaurant: "Burger Hub",
      menu: {
        Burgers: [
          {
            _id: "menu4",
            name: "Classic Burger",
            description: "Beef patty with lettuce, tomato, onion",
            price: 249,
            category: "Burgers",
            restaurant: "mock2",
            isAvailable: true,
          },
          {
            _id: "menu5",
            name: "Chicken Burger",
            description: "Grilled chicken breast with avocado",
            price: 279,
            category: "Burgers",
            restaurant: "mock2",
            isAvailable: true,
          },
        ],
        Snacks: [
          {
            _id: "menu6",
            name: "French Fries",
            description: "Crispy golden fries",
            price: 99,
            category: "Snacks",
            restaurant: "mock2",
            isAvailable: true,
          },
        ],
      },
      items: [
        {
          _id: "menu4",
          name: "Classic Burger",
          description: "Beef patty with lettuce, tomato, onion",
          price: 249,
          category: "Burgers",
          restaurant: "mock2",
          isAvailable: true,
        },
        {
          _id: "menu5",
          name: "Chicken Burger",
          description: "Grilled chicken breast with avocado",
          price: 279,
          category: "Burgers",
          restaurant: "mock2",
          isAvailable: true,
        },
        {
          _id: "menu6",
          name: "French Fries",
          description: "Crispy golden fries",
          price: 99,
          category: "Snacks",
          restaurant: "mock2",
          isAvailable: true,
        },
      ],
    },
  },
  mock3: {
    success: true,
    data: {
      restaurant: "Sushi Express",
      menu: {
        Sushi: [
          {
            _id: "menu7",
            name: "California Roll",
            description: "Crab, avocado, cucumber",
            price: 399,
            category: "Sushi",
            restaurant: "mock3",
            isAvailable: true,
          },
          {
            _id: "menu8",
            name: "Salmon Sashimi",
            description: "Fresh salmon slices",
            price: 599,
            category: "Sushi",
            restaurant: "mock3",
            isAvailable: true,
          },
        ],
        Soup: [
          {
            _id: "menu9",
            name: "Miso Soup",
            description: "Traditional soybean soup",
            price: 149,
            category: "Soup",
            restaurant: "mock3",
            isAvailable: true,
          },
        ],
      },
      items: [
        {
          _id: "menu7",
          name: "California Roll",
          description: "Crab, avocado, cucumber",
          price: 399,
          category: "Sushi",
          restaurant: "mock3",
          isAvailable: true,
        },
        {
          _id: "menu8",
          name: "Salmon Sashimi",
          description: "Fresh salmon slices",
          price: 599,
          category: "Sushi",
          restaurant: "mock3",
          isAvailable: true,
        },
        {
          _id: "menu9",
          name: "Miso Soup",
          description: "Traditional soybean soup",
          price: 149,
          category: "Soup",
          restaurant: "mock3",
          isAvailable: true,
        },
      ],
    },
  },
  mock4: {
    success: true,
    data: {
      restaurant: "Spice Garden",
      menu: {
        "Main Course": [
          {
            _id: "menu10",
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken",
            price: 349,
            category: "Main Course",
            restaurant: "mock4",
            isAvailable: true,
          },
        ],
        Rice: [
          {
            _id: "menu11",
            name: "Biryani",
            description: "Aromatic basmati rice with spices and meat",
            price: 299,
            category: "Rice",
            restaurant: "mock4",
            isAvailable: true,
          },
        ],
      },
      items: [
        {
          _id: "menu10",
          name: "Butter Chicken",
          description: "Creamy tomato-based curry with tender chicken",
          price: 349,
          category: "Main Course",
          restaurant: "mock4",
          isAvailable: true,
        },
        {
          _id: "menu11",
          name: "Biryani",
          description: "Aromatic basmati rice with spices and meat",
          price: 299,
          category: "Rice",
          restaurant: "mock4",
          isAvailable: true,
        },
      ],
    },
  },
};

const mockCategories = ["Italian", "American", "Japanese", "Indian"];

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

      // If backend returns empty data, use mock fallback
      if (res.data.success && (!res.data.data || res.data.data.length === 0)) {
        console.log("🎭 Using mock restaurant data as fallback");
        return {
          success: true,
          data: mockRestaurants,
          pagination: {
            page: 1,
            limit: 20,
            total: mockRestaurants.length,
            pages: 1,
          },
        };
      }

      return res.data;
    } catch (error) {
      console.error("🔴 Get restaurants error:", error);
      console.log("🎭 Using mock restaurant data due to error");
      return {
        success: true,
        data: mockRestaurants,
        pagination: {
          page: 1,
          limit: 20,
          total: mockRestaurants.length,
          pages: 1,
        },
      };
    }
  },

  getRestaurant: async (id) => {
    try {
      const res = await api.get(`/api/restaurants/${id}`);

      // If restaurant not found, try mock data
      if (!res.data.success || !res.data.data) {
        console.log(`🎭 Using mock restaurant data for ${id}`);
        const mockRestaurant = mockRestaurants.find((r) => r._id === id);
        if (mockRestaurant) {
          return {
            success: true,
            data: mockRestaurant,
          };
        }
        throw new Error("Restaurant not found");
      }

      return res.data;
    } catch (error) {
      console.error("🔴 Get restaurant error:", error);
      console.log(`🎭 Trying mock restaurant data for ${id}`);
      const mockRestaurant = mockRestaurants.find((r) => r._id === id);
      if (mockRestaurant) {
        return {
          success: true,
          data: mockRestaurant,
        };
      }
      throw new Error("Failed to fetch restaurant details");
    }
  },

  getCategories: async () => {
    try {
      const res = await api.get("/api/restaurants/categories");

      // If backend returns empty data, use mock fallback
      if (res.data.success && (!res.data.data || res.data.data.length === 0)) {
        console.log("🎭 Using mock categories as fallback");
        return {
          success: true,
          data: mockCategories,
        };
      }

      return res.data;
    } catch (error) {
      console.error("🔴 Get categories error:", error);
      console.log("🎭 Using mock categories due to error");
      return {
        success: true,
        data: mockCategories,
      };
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

      // If backend returns empty data, use mock fallback
      if (
        res.data.success &&
        (!res.data.data ||
          !res.data.data.items ||
          res.data.data.items.length === 0)
      ) {
        console.log(`🎭 Using mock menu data for restaurant ${restaurantId}`);
        return (
          mockMenuItems[restaurantId] || {
            success: true,
            data: { restaurant: "Unknown", menu: {}, items: [] },
          }
        );
      }

      return res.data;
    } catch (error) {
      console.error("🔴 Get menu error:", error);
      console.log(
        `🎭 Using mock menu data for restaurant ${restaurantId} due to error`,
      );
      return (
        mockMenuItems[restaurantId] || {
          success: true,
          data: { restaurant: "Unknown", menu: {}, items: [] },
        }
      );
    }
  },

  getMenuItems: async (restaurantId, params = {}) => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}/menu`, {
        params,
      });

      // If backend returns empty data, use mock fallback
      if (
        res.data.success &&
        (!res.data.data ||
          !res.data.data.items ||
          res.data.data.items.length === 0)
      ) {
        console.log(`🎭 Using mock menu items for restaurant ${restaurantId}`);
        return (
          mockMenuItems[restaurantId] || {
            success: true,
            data: { restaurant: "Unknown", menu: {}, items: [] },
          }
        );
      }

      return res.data;
    } catch (error) {
      console.error("🔴 Get menu items error:", error);
      console.log(
        `🎭 Using mock menu items for restaurant ${restaurantId} due to error`,
      );
      return (
        mockMenuItems[restaurantId] || {
          success: true,
          data: { restaurant: "Unknown", menu: {}, items: [] },
        }
      );
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
