export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  isVerified: boolean;
  isAdmin?: boolean;
  isActive?: boolean;
  role: string;
}

export interface ApiClient {
  setToken: (token: string) => void;
  resendOTP?: () => void;
}

export interface CartItem {
  _id: string;
  restaurantId?: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  isVegetarian?: boolean;
  quantity: number;
}

export type RestaurantStatus = "Active" | "Inactive" | "Pending" | "Suspended";

export interface Restaurant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cuisine: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  image: string;
  rating: number;
  status: RestaurantStatus;
  isVerified: boolean;
}

export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";

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
  status: OrderStatus;
  createdAt: string;
}