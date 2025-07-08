import { useAuth } from "@/contexts/AuthContext";
import { Package, TrendingUp, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Orders",
      value: "156",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Revenue",
      value: "$12,450",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Active Users",
      value: "2,341",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Growth",
      value: "+24%",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.username || "User"}! Here's your overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg ${stat.bg} mr-4 transition-transform duration-300 hover:scale-110`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">
                  New order from McDonald's
                </p>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Profile updated</p>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm text-gray-600">
                  FastIO Pass subscription renewed
                </p>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  📦 View Orders
                </p>
                <p className="text-sm text-gray-600">
                  Check your order history and track deliveries
                </p>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  👤 Update Profile
                </p>
                <p className="text-sm text-gray-600">
                  Manage your account settings and preferences
                </p>
              </button>
              <button
                onClick={() => navigate("/restaurants")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  🍽️ Browse Restaurants
                </p>
                <p className="text-sm text-gray-600">
                  Discover new places to order delicious food from
                </p>
              </button>
              <button
                onClick={() => navigate("/fastio-pass")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  🎫 FASTIO Pass
                </p>
                <p className="text-sm text-gray-600">
                  Get exclusive benefits and discounts
                </p>
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  🛒 View Cart
                </p>
                <p className="text-sm text-gray-600">
                  Review and modify your cart items
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
