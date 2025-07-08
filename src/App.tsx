import { Home } from 'lucide-react';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Restaurants from "./pages/Restaurants";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import Admin from "./pages/Admin";
import FastioPass from "./pages/FastioPass";
import Dashboard from "./pages/Dashboard";
import DataExport from "./pages/DataExport";
import Food from "./pages/Food";
import ForgotPassword from "./pages/ForgotPassword";
import RestaurantsEnhanced from "./pages/RestaurantsEnhanced";

// Components
import Navbar from "./components/Navbar";
import LoadingScreen from "./components/LoadingScreen";
import NetworkStatus from "./components/NetworkStatus";
import PageTransition from "./components/PageTransition";
import NotFound from "./pages/NotFound";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NetworkStatus />
      <Navbar />
      <main>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-portal" element={<AdminPortal />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/fastio-pass" element={<FastioPass />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-export" element={<DataExport />} />
            <Route path="/food" element={<Food />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp" element={<VerifyOTP />} />
            <Route
              path="/restaurants-enhanced"
              element={<RestaurantsEnhanced />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
    </div>
  );
}

export default App;