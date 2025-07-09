/**
 * Shared types between client and server
 */

// Auth types
export interface User {
  id: string;
  email: string;
  username: string;
  mobile: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  mobile: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
}

// Order types
export interface CartItem {
  menuItemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: CartItem[];
  deliveryAddress: string;
  paymentMethod: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed";
  estimatedDeliveryTime?: number;
  createdAt: string;
  restaurant?: Restaurant;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  menuItem?: MenuItem;
}

// Address types
export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface DemoResponse {
  message: string;
}
