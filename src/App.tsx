
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminPortal from "./pages/AdminPortal";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Restaurants from "./pages/Restaurants";
import Restaurant from "./pages/Restaurant";
import Food from "./pages/Food";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import TrackOrder from "./pages/TrackOrder";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import WelcomeAnimation from "./components/WelcomeAnimation";

import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <div className="font-sans">
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/food" element={<Food />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/welcome" element={<WelcomeAnimation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </div>
  );
}

export default App;
