import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Shield, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import WelcomeAnimation from "@/components/WelcomeAnimation";

export default function Home() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome animation for new users (those who just signed up)
    const isNewUser = localStorage.getItem("isNewUser") === "true";
    if (user && isNewUser) {
      setShowWelcome(true);
      localStorage.removeItem("isNewUser");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 sm:mb-8">
              <Logo size={80} className="sm:w-24 sm:h-24 lg:w-32 lg:h-32" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Welcome to FASTIO
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 font-medium">
              Fast Moves, Fresh Choices
            </p>
            <p className="text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Order delicious food from your favorite restaurants with
              lightning-fast delivery
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full min-w-[200px] touch-manipulation"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto btn-secondary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full min-w-[200px] bg-white/10 text-white border-white/30 hover:bg-white/20 touch-manipulation"
              >
                Sign In
              </Link>
            </div>

            {/* Admin Portal Button */}
            <div className="mt-8 text-center">
              <Link
                to="/admin-login"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                <Shield className="w-5 h-5" />
                <span className="text-lg">Admin Portal</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-white px-4">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Fast Delivery
              </h3>
              <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                Get your food delivered in 30 minutes or less
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Quality Food
              </h3>
              <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                Fresh ingredients from top-rated restaurants
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Secure Payments
              </h3>
              <p className="text-primary-100 text-sm sm:text-base leading-relaxed">
                Safe and secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {showWelcome && (
        <WelcomeAnimation
          userName={user.username}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Welcome back,{" "}
              <span className="block sm:inline">{user.username}!</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-100 mb-6 sm:mb-8 leading-relaxed">
              What would you like to eat today?
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-white text-primary-600 hover:bg-primary-50 touch-manipulation"
            >
              Browse Restaurants
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Portal Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <Link
            to="/admin-login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin Portal
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/restaurants"
            className="card p-4 sm:p-6 hover:shadow-md transition-all hover:scale-105 text-center touch-manipulation"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              Order Food
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Browse restaurants and order your favorite meals
            </p>
          </Link>

          <Link
            to="/orders"
            className="card p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Orders</h3>
            <p className="text-gray-600 text-sm">
              View your order history and track deliveries
            </p>
          </Link>

          <Link
            to="/profile"
            className="card p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600 text-sm">
              Manage your account and preferences
            </p>
          </Link>

          <div className="card p-6 text-center opacity-50">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Offers</h3>
            <p className="text-gray-600 text-sm">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
