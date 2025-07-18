import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiClient } from "../lib/api";
import { Order } from "@shared/api";
import Logo from "../components/Logo";

export default function Orders() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { totalItems } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
    if (!user || !token) {
      setError("Please log in to view orders");
      setIsLoading(false);
      return;
    }
    fetchOrders();
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      const response = await apiClient.getOrders(token);

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || "Failed to load orders");
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to load orders at the moment");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading orders...</div>
      </div>
    );
  }

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
            <Link
              to="/dashboard"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Home
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
            <Link to="/orders" className="text-orange-200 font-semibold">
              Orders
            </Link>
            <Link
              to="/profile"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user?.username}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-white/80 text-lg">Track your food orders</p>
          </div>

                    {/* Authentication Error */}
          {error && error.includes("log in") ? (
            <div className="text-center py-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="text-white text-8xl mb-6">🔒</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Please Log In
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  You need to be logged in to view your orders.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-100 transition-all mr-4"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-all"
                >
                  Go Home
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
              <button
                onClick={fetchOrders}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          ) : null}

          {/* Orders List */}
          {!error && orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto">
                <div className="text-white text-8xl mb-6">📦</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  No Orders Yet
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  You haven't placed any orders. Discover delicious food from
                  our restaurants!
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-100 transition-all"
                >
                  Browse Restaurants
                </button>
              </div>
            </div>
          ) : !error && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <p className="text-gray-600">
                        From {order.restaurant?.name || "Restaurant"}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Order Date</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-semibold text-orange-500 text-lg">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment</p>
                      <p className="font-semibold capitalize">
                        {order.paymentMethod.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-gray-600 mb-2">Delivery Address</p>
                    <p className="text-gray-800">{order.deliveryAddress}</p>
                  </div>

                  {order.estimatedDeliveryTime && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                      <p className="text-orange-700">
                        <span className="font-semibold">
                          Estimated Delivery:
                        </span>{" "}
                        {new Date(order.estimatedDeliveryTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}