import React from "react";
import { Routes, Route } from "react-router-dom";

// Import all page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import Restaurant from "./pages/Restaurant";
import Food from "./pages/Food";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import FastioPass from "./pages/FastioPass";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminPortal from "./pages/AdminPortal";
import Admin from "./pages/Admin";
import DataExport from "./pages/DataExport";
import Debug from "./pages/Debug";
import AdminDashboard from "./pages/Admin";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/verify-otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<Restaurant />} />
      <Route path="/restaurants/:id" element={<Restaurant />} />
      <Route path="/food/:id" element={<Food />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/fastio-pass" element={<FastioPass />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/admin-portal" element={<AdminPortal />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/data-export" element={<DataExport />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin" element={<Admin/>} />
    </Routes>
  );
}
