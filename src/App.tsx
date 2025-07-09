import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Safely import page components with fallbacks
const importPage = (path: string) => {
  try {
    return require(path).default;
  } catch {
    return () => (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Page Under Development</h2>
        <p className="text-gray-600">This page is currently being built.</p>
      </div>
    );
  }
};

const Home = importPage("./pages/Home");
const Login = importPage("./pages/Login");
const Signup = importPage("./pages/Signup");
const VerifyOTP = importPage("./pages/VerifyOTP");
const ForgotPassword = importPage("./pages/ForgotPassword");
const Dashboard = importPage("./pages/Dashboard");
const Restaurants = importPage("./pages/Restaurants");
const Restaurant = importPage("./pages/Restaurant");
const Food = importPage("./pages/Food");
const Cart = importPage("./pages/Cart");
const Checkout = importPage("./pages/Checkout");
const Orders = importPage("./pages/Orders");
const Profile = importPage("./pages/Profile");
const FastioPass = importPage("./pages/FastioPass");
const DataExport = importPage("./pages/DataExport");
const AdminLogin = importPage("./pages/AdminLogin");
const AdminSignup = importPage("./pages/AdminSignup");
const AdminPortal = importPage("./pages/AdminPortal");
const Admin = importPage("./pages/Admin");
const NotFound = importPage("./pages/NotFound");

// Import contexts with fallbacks
let AuthProvider, CartProvider;

try {
  AuthProvider = require("./contexts/AuthContext").AuthProvider;
} catch {
  AuthProvider = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
}

try {
  CartProvider = require("./contexts/CartContext").CartProvider;
} catch {
  CartProvider = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
}

// Import components (with fallbacks)
let Navbar, ErrorBoundary;

try {
  Navbar = require("./components/Navbar").default;
} catch {
  Navbar = () => null;
}

try {
  ErrorBoundary = require("./components/ErrorBoundary").default;
} catch {
  ErrorBoundary = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
}

// Enhanced FastIO Homepage for non-authenticated users
function LandingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderNow = () => {
    navigate("/restaurants");
  };

  const handleDownloadApp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 text-center text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F53e602feabe5447da13ddaa0f99d281d%2F8df4b720e4d54c139f349fa997ea8cff?format=webp&width=800"
              alt="FastIO Logo"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <div className="text-lg font-semibold">FASTIO</div>
              <div className="text-sm opacity-80">Food Delivery</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Current Time</div>
            <div className="text-lg font-semibold">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F53e602feabe5447da13ddaa0f99d281d%2F8df4b720e4d54c139f349fa997ea8cff?format=webp&width=800"
              alt="FastIO Logo"
              className="w-20 h-20 animate-pulse rounded-full"
            />
            <h1 className="text-7xl font-bold animate-pulse">FASTIO</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">Fast Food Delivery</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Delicious food from your favorite restaurants, delivered fast to
            your door! Order now and enjoy amazing meals in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleOrderNow}
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            >
              🚀 Order Now
            </button>
            <button
              onClick={handleDownloadApp}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-500 transition-all transform hover:scale-105 cursor-pointer"
            >
              📱 Get Started
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate("/restaurants")}
          >
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-2xl font-semibold mb-4">Browse Restaurants</h3>
            <p className="opacity-90">
              Discover amazing local restaurants and cuisines near you
            </p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-4">Easy Ordering</h3>
            <p className="opacity-90">
              Simple and fast ordering process with secure payments
            </p>
          </div>
          <div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
            <p className="opacity-90">
              Quick delivery tracking and real-time updates
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm opacity-80">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-sm opacity-80">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">30min</div>
            <div className="text-sm opacity-80">Avg Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-80">Available</div>
          </div>
        </div>

        {/* Sign In / Sign Up Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-semibold mb-6">Ready to get started?</h3>
          <div className="space-y-4">
            <button
              onClick={handleSignIn}
              className="w-full bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all transform hover:scale-105"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-all transform hover:scale-105"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 text-sm opacity-80">
            <p>Demo Credentials:</p>
            <div className="text-xs mt-2">
              <div>Admin: fastio121299@gmail.com / fastio1212</div>
              <div>User: mohamedshafik2526@gmail.com / Shafik1212@</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center opacity-80 mt-12">
          <p>© 2024 FastIO Food Delivery. Made with ❤️ by Mohamed Shafik</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const AppWrapper =
    typeof ErrorBoundary === "function" ? ErrorBoundary : React.Fragment;
  const Auth =
    typeof AuthProvider === "function" ? AuthProvider : React.Fragment;
  const Cart =
    typeof CartProvider === "function" ? CartProvider : React.Fragment;

  return (
    <AppWrapper>
      <Auth>
        <Cart>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/welcome" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Main App Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurant/:id" element={<Restaurant />} />
              <Route path="/food/:id" element={<Food />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/fastio-pass" element={<FastioPass />} />
              <Route path="/data-export" element={<DataExport />} />

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/admin" element={<Admin />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Conditional Navbar - only show on authenticated routes */}
            {typeof Navbar === "function" && <Navbar />}
          </div>
        </Cart>
      </Auth>
    </AppWrapper>
  );
}

export default App;
