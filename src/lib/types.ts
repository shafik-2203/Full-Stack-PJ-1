
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
}

export interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  address: string;
  status: RestaurantStatus;
  rating?: number;
}

export interface Food {
  _id: string;
  name: string;
  price: number;
  description: string;
  restaurantId: string;
  image?: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt?: string;
}

export interface ApiClient {
  setToken: (token: string) => void;
  signup: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  resendOTP?: (email: string) => Promise<any>;
}

export enum OrderStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Delivered = "delivered",
  Cancelled = "cancelled"
}

export enum RestaurantStatus {
  Active = "active",
  Inactive = "inactive"
}
