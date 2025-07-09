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
                <span className="text-lg">🔐 Admin Portal</span>
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

      {/* Quick Actions */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/restaurants"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 group-hover:text-orange-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
              🍽️ Order Food
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Browse restaurants and order your favorite meals
            </p>
          </Link>

          <Link
            to="/dashboard"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:text-blue-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
              📊 Dashboard
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              View your activity and statistics
            </p>
          </Link>

          <Link
            to="/fastio-pass"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in relative overflow-hidden"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:text-purple-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-purple-600 transition-colors relative z-10">
              🎫 FASTIO Pass
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed relative z-10">
              Get exclusive benefits and discounts
            </p>
          </Link>

          <Link
            to="/orders"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 group-hover:text-green-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-green-600 transition-colors">
              📦 Track Orders
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              View your order history and track deliveries
            </p>
          </Link>
        </div>

        {/* Additional Quick Actions Row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            to="/profile"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 group-hover:text-indigo-700"
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
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
              👤 Profile
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Manage your account and preferences
            </p>
          </Link>

          <Link
            to="/cart"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 group-hover:text-yellow-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-yellow-600 transition-colors">
              🛒 Cart
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              View and manage your cart items
            </p>
          </Link>

          <Link
            to="/data-export"
            className="card p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-center touch-manipulation group animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 group-hover:text-teal-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base group-hover:text-teal-600 transition-colors">
              📄 Data Export
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Export your data and preferences
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
