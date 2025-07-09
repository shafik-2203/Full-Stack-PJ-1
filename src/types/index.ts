export interface User {
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

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  restaurantId?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  ingredients?: string[];
  allergens?: string[];
  spiceLevel?: string;
  preparationTime?: number;
  rating?: number;
  totalOrders?: number;
  emoji?: string;
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
    specialInstructions?: string;
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
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
}

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
