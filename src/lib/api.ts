import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const signup = (data: {
  username: string;
  email: string;
  password: string;
}) => api.post("/api/auth/signup", data);

export const verifyOtp = (data: {
  email: string;
  otp: string;
}) => api.post("/api/auth/verify-otp", data);

export const login = (data: {
  email: string;
  password: string;
}) => api.post("/api/auth/login", data);

export const adminLogin = (data: {
  email: string;
  password: string;
}) => api.post("/api/auth/admin-login", data);

export const resendOtp = (data: { email: string }) =>
  api.post("/api/auth/resend-otp", data);

// USERS
export const getUsers = () => api.get("/api/users");

// RESTAURANTS
export const getRestaurants = () => api.get("/api/restaurants");
export const addRestaurant = (data: any) =>
  api.post("/api/restaurants", data);
export const updateRestaurant = (id: string, data: any) =>
  api.put(`/api/restaurants/${id}`, data);
export const deleteRestaurant = (id: string) =>
  api.delete(`/api/restaurants/${id}`);

// FOODS
export const getFoods = () => api.get("/api/foods");
export const addFood = (data: any) => api.post("/api/foods", data);
export const updateFood = (id: string, data: any) =>
  api.put(`/api/foods/${id}`, data);
export const deleteFood = (id: string) => api.delete(`/api/foods/${id}`);

// ORDERS
export const placeOrder = (data: any) => api.post("/api/orders", data);
export const getOrders = () => api.get("/api/orders");
export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/api/orders/${id}`, { status });