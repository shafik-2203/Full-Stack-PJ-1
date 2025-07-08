import { User } from "lucide-react";
import axios from "axios";
import { User, CartItem, Restaurant, Order, ApiClient, OrderStatus, RestaurantStatus } from "@/lib/types";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

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
  email: string;
  name: string;
  phone: string;
  isAdmin: boolean;
  isActive: boolean;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cuisine: string[];
  description: string;
  image: string;
  rating: number;
  totalReviews: number;
  status: "Active" | "Inactive" | "Pending" | "Suspended";
  deliveryTime: {
    min: number;
    max: number;
  };
  deliveryFee: number;
  minimumOrder: number;
  totalOrders: number;
  totalRevenue: number;
  isVerified: boolean;
}

export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: {
    _id: string;
    name: string;
  };
  image: string;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: string;
  isAvailable: boolean;
  preparationTime: number;
  rating: number;
  totalOrders: number;
  emoji: string;
}

export interface Order {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  restaurant: {
    _id: string;
    name: string;
  };
  items: {
    foodItem: {
      _id: string;
      name: string;
    };
    quantity: number;
    price: number;
    specialInstructions: string;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status:
    | "Pending"
    | "Confirmed"
    | "Preparing"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod: "UPI" | "Card" | "Wallet" | "Cash on Delivery";
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  estimatedDeliveryTime: string;
  actualDeliveryTime: string;
  notes: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  transactionId: string;
  order: {
    _id: string;
    orderId: string;
    total: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  method: "UPI" | "Card" | "Wallet" | "Cash on Delivery";
  status: "Pending" | "Completed" | "Failed" | "Refunded" | "Cancelled";
  gateway: string;
  gatewayTransactionId: string;
  currency: string;
  refundAmount: number;
  refundReason: string;
  failureReason: string;
  processedAt: string;
  refundedAt: string;
  createdAt: string;
}

export interface SignupRequest {
  _id: string;
  email: string;
  name: string;
  phone: string;
  requestType: "User" | "Restaurant";
  status: "Pending" | "Approved" | "Rejected";
  restaurantInfo?: {
    name: string;
    cuisine: string[];
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    description: string;
  };
  rejectionReason: string;
  processedBy: {
    _id: string;
    name: string;
    email: string;
  };
  processedAt: string;
  notes: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSignups: number;
  activeRestaurants: number;
}

class ApiClient {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<AuthResponse> {
    const response = await api.post("/auth/register", userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get("/admin/dashboard");
    return response.data;
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await api.get("/admin/users");
    return response.data;
  }

  async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ApiResponse<User>> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  }

  async getRestaurants(): Promise<ApiResponse<Restaurant[]>> {
    const response = await api.get("/admin/restaurants");
    return response.data;
  }

  async createRestaurant(
    data: Partial<Restaurant>,
  ): Promise<ApiResponse<Restaurant>> {
    const response = await api.post("/admin/restaurants", data);
    return response.data;
  }

  async updateRestaurant(
    id: string,
    data: Partial<Restaurant>,
  ): Promise<ApiResponse<Restaurant>> {
    const response = await api.put(`/admin/restaurants/${id}`, data);
    return response.data;
  }

  async getFoodItems(): Promise<ApiResponse<FoodItem[]>> {
    const response = await api.get("/admin/food-items");
    return response.data;
  }

  async createFoodItem(
    data: Partial<FoodItem>,
  ): Promise<ApiResponse<FoodItem>> {
    const response = await api.post("/admin/food-items", data);
    return response.data;
  }

  async updateFoodItem(
    id: string,
    data: Partial<FoodItem>,
  ): Promise<ApiResponse<FoodItem>> {
    const response = await api.put(`/admin/food-items/${id}`, data);
    return response.data;
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await api.get("/admin/orders");
    return response.data;
  }

  async updateOrder(
    id: string,
    data: Partial<Order>,
  ): Promise<ApiResponse<Order>> {
    const response = await api.put(`/admin/orders/${id}`, data);
    return response.data;
  }

  async getPayments(): Promise<ApiResponse<Payment[]>> {
    const response = await api.get("/admin/payments");
    return response.data;
  }

  async getSignupRequests(): Promise<ApiResponse<SignupRequest[]>> {
    const response = await api.get("/admin/signup-requests");
    return response.data;
  }

  async updateSignupRequest(
    id: string,
    data: { status: string; rejectionReason?: string },
  ): Promise<ApiResponse<SignupRequest>> {
    const response = await api.put(`/admin/signup-requests/${id}`, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default api;
