import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Clock,
  Star,
  TrendingUp,
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  Home,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your dashboard
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: user.totalOrders || 0, icon: ShoppingBag },
    {
      label: "Total Spent",
      value: `$${user.totalSpent || 0}`,
      icon: CreditCard,
    },
    { label: "Favorite Items", value: "12", icon: Star },
    { label: "Last Order", value: "2 days ago", icon: Clock },
  ];

  const recentOrders = [
    {
      id: "1",
      restaurant: "Pizza Palace",
      items: ["Margherita Pizza", "Caesar Salad"],
      total: 24.99,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "2",
      restaurant: "Burger Junction",
      items: ["Classic Burger", "Fries"],
      total: 18.5,
      status: "Delivered",
      date: "2024-01-12",
    },
    {
      id: "3",
      restaurant: "Sushi Zen",
      items: ["California Roll", "Miso Soup"],
      total: 32.0,
      status: "Delivered",
      date: "2024-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
              >
                <Home size={20} />
                <span className="font-medium">Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user.username || user.name}! 👋
              </h2>
              <p className="text-orange-100 mb-4">
                Ready to order some delicious food?
              </p>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Browse Restaurants
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <Link
                  to="/orders"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link
                    to="/restaurants"
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Start ordering →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {order.restaurant}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {order.items.join(", ")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${order.total}
                        </p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/restaurants"
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
                >
                  <ShoppingBag className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Order Food
                  </span>
                </Link>
                <Link
                  to="/orders"
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <Clock className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Track Orders
                  </span>
                </Link>
                <Link
                  to="/profile"
                  className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <User className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    My Profile
                  </span>
                </Link>
                <Link
                  to="/fastio-pass"
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <Gift className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    FASTIO Pass
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended for You
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Try Popular Items
                </h4>
                <p className="text-sm text-gray-600">
                  Discover trending dishes in your area
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  New Restaurants
                </h4>
                <p className="text-sm text-gray-600">
                  Check out newly added restaurants
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Special Offers
                </h4>
                <p className="text-sm text-gray-600">
                  Get exclusive deals and discounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
