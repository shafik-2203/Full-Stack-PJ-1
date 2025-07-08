// Modern API client for FASTIO
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://fsd-project1-backend.onrender.com/api";

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse extends ApiResponse {
  user?: User;
  token?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  mobile: string;
  isVerified: boolean;
  role?: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  cuisine: string[];
  isOpen: boolean;
  location: {
    address: string;
    coordinates: [number, number];
  };
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  restaurantId: string;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("fastio_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("fastio_token", token);
      } else {
        localStorage.removeItem("fastio_token");
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      mode: "cors",
      credentials: "omit",
      ...options,
    };

    console.log(`🔄 API Request: ${config.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${url}`, error);

      // Handle specific network errors
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Network error: Unable to connect to server. Please check your internet connection or try again later.",
        );
      }

      throw error;
    }
  }

  // Auth endpoints
  async signup(userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async verifyOTP(data: { email: string; otp: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resendOTP(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    return this.request<ApiResponse<Restaurant[]>>("/restaurants");
  }

  async getRestaurant(id: string): Promise<ApiResponse<Restaurant>> {
    return this.request<ApiResponse<Restaurant>>(`/restaurants/${id}`);
  }

  async getMenuItems(restaurantId: string): Promise<ApiResponse<MenuItem[]>> {
    return this.request<ApiResponse<MenuItem[]>>(
      `/restaurants/${restaurantId}/menu`,
    );
  }

  async searchRestaurants(query: string): Promise<ApiResponse<Restaurant[]>> {
    return this.request<ApiResponse<Restaurant[]>>(
      `/restaurants/search?q=${encodeURIComponent(query)}`,
    );
  }

  // Order endpoints
  async createOrder(orderData: {
    restaurantId: string;
    items: { menuItemId: string; quantity: number }[];
    deliveryAddress: string;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<ApiResponse<Order[]>>("/orders");
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/orders/${id}`);
  }

  // User endpoints
  async updateProfile(data: {
    username: string;
    email: string;
    mobile: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
