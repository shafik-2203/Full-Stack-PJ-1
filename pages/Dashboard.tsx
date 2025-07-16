import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import Logo from "../components/Logo";
import PWAInstallPrompt from "../components/PWAInstallPrompt";
import RealTimeDashboard from "../components/RealTimeDashboard";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState(null);
  const [favoriteRestaurant, setFavoriteRestaurant] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [liveDeals, setLiveDeals] = useState([]);
  const [trendingRestaurants, setTrendingRestaurants] = useState([]);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      // Load last order
      const ordersResponse = await apiClient.getOrders(token);
      if (ordersResponse.success && ordersResponse.data.length > 0) {
        setLastOrder(ordersResponse.data[0]);
      }

      // Load restaurants for trending and favorites
      const restaurantsResponse = await apiClient.getRestaurants();
      if (restaurantsResponse.success && restaurantsResponse.data) {
        const restaurants = restaurantsResponse.data;
        setTrendingRestaurants(restaurants.slice(0, 3));

        // Set a favorite restaurant (highest rated)
        const favorite = restaurants.sort((a, b) => b.rating - a.rating)[0];
        setFavoriteRestaurant(favorite);
      }

      // Mock live deals
      setLiveDeals([
        {
          id: "1",
          title: "20% off Pizza",
          restaurant: "Pizza Palace",
          discount: 20,
        },
        {
          id: "2",
          title: "Free delivery",
          restaurant: "Burger Hub",
          discount: 100,
        },
        {
          id: "3",
          title: "30% off Sushi",
          restaurant: "Sushi Express",
          discount: 30,
        },
      ]);

      // Mock saved addresses
      setSavedAddresses([
        { id: "1", label: "Home", address: "123 Main St, City" },
        { id: "2", label: "Work", address: "456 Office Ave, City" },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLastOrder = () => {
    if (lastOrder) {
      navigate("/orders");
    } else {
      navigate("/restaurants");
    }
  };

  const handleFavoriteFood = () => {
    if (favoriteRestaurant) {
      navigate(`/restaurant/${favoriteRestaurant._id}`);
    } else {
      navigate("/restaurants");
    }
  };

  const handleSavedAddresses = () => {
    navigate("/profile");
  };

  const handleLiveDeals = () => {
    navigate("/restaurants");
  };

  const handleTrendingNow = () => {
    navigate("/restaurants");
  };

  const quickActions = [
    {
      title: "Browse Restaurants",
      description: "Discover amazing food near you",
      icon: "🍽️",
      action: () => navigate("/restaurants"),
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Search Food",
      description: "Find your favorite dishes",
      icon: "🔍",
      action: () => navigate("/food"),
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "View Cart",
      description: `${totalItems} items in cart`,
      icon: "🛒",
      action: () => navigate("/cart"),
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "My Orders",
      description: "Track your orders",
      icon: "📦",
      action: () => navigate("/orders"),
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "FASTIO Pass",
      description: "Get exclusive benefits",
      icon: "���",
      action: () => navigate("/fastio-pass"),
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Profile",
      description: "Manage your account",
      icon: "👤",
      action: () => navigate("/profile"),
      color: "from-gray-500 to-slate-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={60} />
            <h1 className="text-2xl font-bold text-white">FASTIO</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-white font-semibold">
              Dashboard
            </Link>
            <Link
              to="/restaurants"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Restaurants
            </Link>
            <Link
              to="/food"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Food
            </Link>
            <Link
              to="/cart"
              className="text-white hover:text-orange-200 transition-colors flex items-center gap-2"
            >
              Cart
              {totalItems > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-white hidden md:block">
              Welcome, {user?.username}!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-white/90 text-lg">
            What would you like to do today?
          </p>
        </div>

        {/* Real-time Dashboard */}
        <div className="mb-8">
          <RealTimeDashboard />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl mb-4`}
              >
                {action.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {action.title}
              </h3>
              <p className="text-white/80">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order History Preview */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              📋 Recent Activity
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleLastOrder}
                className="w-full flex items-center justify-between py-3 px-2 border-b border-white/20 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-white/90">
                  Last Order{" "}
                  {lastOrder
                    ? `- ${lastOrder.restaurant?.name || "Order #" + lastOrder.id.slice(-6)}`
                    : "- None yet"}
                </span>
                <span className="text-white font-medium">View Details →</span>
              </button>
              <button
                onClick={handleFavoriteFood}
                className="w-full flex items-center justify-between py-3 px-2 border-b border-white/20 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-white/90">
                  Favorite Food{" "}
                  {favoriteRestaurant
                    ? `- ${favoriteRestaurant.name}`
                    : "- Discover now"}
                </span>
                <span className="text-white font-medium">Order Again →</span>
              </button>
              <button
                onClick={handleSavedAddresses}
                className="w-full flex items-center justify-between py-3 px-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-white/90">
                  Saved Addresses ({savedAddresses.length})
                </span>
                <span className="text-white font-medium">Manage →</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleLiveDeals}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-3 hover:from-yellow-500 hover:to-orange-500 transition-all"
              >
                <p className="text-sm font-medium text-gray-800">
                  🎉 Live Deals ({liveDeals.length} active)
                </p>
              </button>
              <button
                onClick={handleTrendingNow}
                className="w-full bg-gradient-to-r from-green-400 to-blue-400 rounded-lg p-3 hover:from-green-500 hover:to-blue-500 transition-all"
              >
                <p className="text-sm font-medium text-gray-800">
                  🔥 Trending Now ({trendingRestaurants.length} restaurants)
                </p>
              </button>
              <button
                onClick={() => navigate("/fastio-pass")}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-3 hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                <p className="text-sm font-medium text-gray-800">
                  ⭐ Get FASTIO Pass for exclusive benefits!
                </p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
