import "./global.css";
import "./responsive.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";

// Import pages
import TestIndex from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Restaurants";
import EnhancedRestaurants from "./pages/EnhancedRestaurants";
import Food from "./pages/Food";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import FastioPass from "./pages/FastioPass";
import ForgotPassword from "./pages/ForgotPassword";
import DataExport from "./pages/DataExport";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminPortal from "./pages/AdminPortal";
import AdminSignup from "./pages/AdminSignup";
import Debug from "./pages/Debug";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

console.log("🚀 Starting FASTIO App...");

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <NetworkStatus />
            <Routes>
              <Route path="/" element={<TestIndex />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/SignIn" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/Register" element={<Signup />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/OTP" element={<OTP />} />
              <Route path="/verify" element={<OTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/Restaurants" element={<Restaurants />} />
              <Route
                path="/restaurants-enhanced"
                element={<EnhancedRestaurants />}
              />
              <Route path="/food" element={<Food />} />
              <Route path="/Food" element={<Food />} />
              <Route path="/restaurant/:id" element={<Restaurant />} />
              <Route path="/restaurants/:id" element={<Restaurant />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/Checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/fastio-pass" element={<FastioPass />} />
              <Route path="/FastioPass" element={<FastioPass />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/data-export" element={<DataExport />} />
              <Route path="/DataExport" element={<DataExport />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/AdminPortal" element={<AdminPortal />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/AdminLogin" element={<AdminLogin />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/AdminSignup" element={<AdminSignup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/Admin" element={<Admin />} />
              <Route path="/admin/dashboard" element={<Admin />} />
              <Route path="/Admin/Dashboard" element={<Admin />} />
              <Route path="/admin-dashboard" element={<Admin />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="/Debug" element={<Debug />} />

              {/* Common variations and redirects */}
              <Route path="/home" element={<TestIndex />} />
              <Route path="/Home" element={<TestIndex />} />
              <Route path="/index" element={<TestIndex />} />
              <Route path="/Index" element={<TestIndex />} />
              <Route path="/menu" element={<Restaurants />} />
              <Route path="/Menu" element={<Restaurants />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/Account" element={<Profile />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="/Settings" element={<Profile />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
