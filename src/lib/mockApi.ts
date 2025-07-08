// mockApi.ts disabled for production build
/*
// Mock API service to simulate backend responses
import type { AuthResponse, User, Restaurant, MenuItem, Order } from "./api";
import { User, CartItem, ApiClient, Restaurant, Order } from "@/lib/types";

// Mock database
const mockUsers = new Map<string, any>();
const mockPendingSignups = new Map<string, any>();
const mockOrders = new Map<string, Order>();

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulate network delay
const delay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiService {
  // Auth endpoints
  async signup(userData: {
    username: string;
    email: string;
    password: string;
    mobile: string;
  }): Promise<AuthResponse> {
    await delay(1500);

    // Check if user already exists
    if (mockUsers.has(userData.email.toLowerCase())) {
      throw new Error("User with this email already exists");
    }

    // Store pending signup
    const otpCode = "123456"; // Fixed OTP for demo
    mockPendingSignups.set(userData.email.toLowerCase(), {
      ...userData,
      otp: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    return {
      success: true,
      message:
        "Account created successfully! Please check your email for OTP verification code.",
    };
  }

  async verifyOTP(data: { email: string; otp: string }): Promise<AuthResponse> {
    await delay(1000);

    const pendingSignup = mockPendingSignups.get(data.email.toLowerCase());

    if (!pendingSignup) {
      throw new Error("No pending signup found for this email");
    }

    if (pendingSignup.expiresAt < Date.now()) {
      mockPendingSignups.delete(data.email.toLowerCase());
      throw new Error("OTP has expired. Please sign up again.");
    }

    if (pendingSignup.otp !== data.otp) {
      throw new Error("Invalid OTP. Please check your email and try again.");
    }

    // Create verified user
    const userId = generateId();
    const user: User = {
      id: userId,
      username: pendingSignup.username,
      email: pendingSignup.email,
      mobile: pendingSignup.mobile,
      isVerified: true,
      role: "user",
    };

    mockUsers.set(pendingSignup.email.toLowerCase(), user);
    mockPendingSignups.delete(data.email.toLowerCase());

    const token = `mock_token_${userId}_${Date.now()}`;

    return {
      success: true,
      message: "Account verified successfully! Welcome to FASTIO!",
      user,
      token,
    };
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    await delay(1000);

    // Check for demo users
    const demoUsers = [
      {
        email: "demo@fastio.com",
        password: "Demo123@",
        user: {
          id: "demo_user_1",
          username: "Demo User",
          email: "demo@fastio.com",
          mobile: "1234567890",
          isVerified: true,
          role: "user",
        },
      },
      {
        email: "admin@fastio.com",
        password: "Admin123@",
        user: {
          id: "admin_user_1",
          username: "Admin User",
          email: "admin@fastio.com",
          mobile: "9876543210",
          isVerified: true,
          role: "admin",
        },
      },
    ];

    // Check demo users first
    const demoUser = demoUsers.find(
      (u) =>
        (u.email === credentials.username.toLowerCase() ||
          u.user.username === credentials.username) &&
        u.password === credentials.password,
    );

    if (demoUser) {
      const token = `mock_token_${demoUser.user.id}_${Date.now()}`;
      return {
        success: true,
        message: "Login successful!",
        user: demoUser.user,
        token,
      };
    }

    // Check registered users
    const user = Array.from(mockUsers.values()).find(
      (u) =>
        u.email === credentials.username.toLowerCase() ||
        u.username === credentials.username,
    );

    if (!user) {
      throw new Error(
        "Account not found. Please check your credentials or sign up.",
      );
    }

    const token = `mock_token_${user.id}_${Date.now()}`;

    return {
      success: true,
      message: "Login successful!",
      user,
      token,
    };
  }

  async resendOTP(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    await delay(1000);

    const pendingSignup = mockPendingSignups.get(email.toLowerCase());

    if (!pendingSignup) {
      throw new Error("No pending signup found for this email");
    }

    // Update expiry time
    pendingSignup.expiresAt = Date.now() + 10 * 60 * 1000;
    mockPendingSignups.set(email.toLowerCase(), pendingSignup);

    return {
      success: true,
      message: "OTP resent successfully! Please check your email.",
    };
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<{ success: boolean; data: Restaurant[] }> {
    await delay(500);

    const { restaurants } = await import("../data/restaurants");
    return {
      success: true,
      data: restaurants.map(r => ({ ...r, _id: r._id || "r1", cuisine: r.cuisine || "Unknown" })),
    };
  }

  async getRestaurant(
    id: string,
  ): Promise<{ success: boolean; data: Restaurant }> {
    await delay(500);

    const { restaurants } = await import("../data/restaurants");
    const restaurant = restaurants.find((r) => r.id === id);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return {
      success: true,
      data: { ...restaurant, _id: restaurant._id || "r1", cuisine: restaurant.cuisine || "Unknown" },
    };
  }

  async getMenuItems(
    restaurantId: string,
  ): Promise<{ success: boolean; data: MenuItem[] }> {
    await delay(500);

    const { restaurants } = await import("../data/restaurants");
    const restaurant = restaurants.find((r) => r.id === restaurantId);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    return {
      success: true,
      data: restaurant.menu.map(m => ({ ...m, _id: m._id || "m1", isAvailable: true, restaurantId: restaurant._id || "r1" })),
    };
  }

  // Order endpoints
  async createOrder(orderData: {
    restaurantId: string;
    items: { menuItemId: string; quantity: number }[];
    deliveryAddress: string;
    paymentMethod: string;
  }): Promise<{ success: boolean; data: Order }> {
    await delay(1500);

    const orderId = generateId();
    const order: Order = {
      _id: orderId,
      userId: "current_user",
      restaurantId: orderData.restaurantId,
      items: orderData.items.map((item) => ({
        menuItemId: item.menuItemId,
        name: "Sample Item",
        price: 12.99,
        quantity: item.quantity,
        image: "https://via.placeholder.com/150",
      })),
      totalAmount: 25.99,
      status: "pending",
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: new Date(
        Date.now() + 30 * 60 * 1000,
      ).toISOString(),
    };

    mockOrders.set(orderId, order);

    return {
      success: true,
      data: order,
    };
  }

  async getUserOrders(): Promise<{ success: boolean; data: Order[] }> {
    await delay(500);

    return {
      success: true,
      data: Array.from(mockOrders.values()),
    };
  }
}

export const mockApiService = new MockApiService();

*/
const mockApiService = {
  getRestaurants: async () => ({
    success: true,
    data: [],
    message: "Mock disabled",
  }),
  getRestaurant: async (id: string) => ({
    success: true,
    data: {
      _id: id,
      name: "Mock Restaurant",
      description: "Mock description",
      image: "",
      rating: 4.5,
      deliveryTime: "30-45 min",
      deliveryFee: 2.99,
      minimumOrder: 15.0,
      cuisine: ["Mock"],
      isOpen: true,
      location: {
        address: "Mock Address",
        coordinates: [0, 0] as [number, number],
      },
    },
    message: "Mock disabled",
  }),
  getMenuItems: async (_restaurantId: string) => ({
    success: true,
    data: [],
    message: "Mock disabled",
  }),
  signup: async (_userData: any) => ({
    success: true,
    message: "Mock disabled",
  }),
  login: async (_credentials: any) => ({
    success: true,
    message: "Mock disabled",
  }),
  verifyOTP: async (_data: any) => ({
    success: true,
    message: "Mock disabled",
  }),
  resendOTP: async (_email: string) => ({
    success: true,
    message: "Mock disabled",
  }),
};

export { mockApiService };
export default mockApiService;
