
export type RestaurantStatus = 'OPEN' | 'CLOSED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

export interface Restaurant {
  _id: string;
  name: string;
  location: string;
  status: RestaurantStatus;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}

export interface DashboardStats {
  usersCount: number;
  ordersCount: number;
  restaurantsCount: number;
}
