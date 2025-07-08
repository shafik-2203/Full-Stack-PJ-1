
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyOTP from "@/pages/VerifyOTP";
import Dashboard from "@/pages/Dashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminSignup from "@/pages/AdminSignup";
import AdminDashboard from "@/pages/AdminDashboard";
import Restaurants from "@/pages/Restaurants";
import Foods from "@/pages/Foods";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import PageNotFound from "@/pages/PageNotFound";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/foods" element={<Foods />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
