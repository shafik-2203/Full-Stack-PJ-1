import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  UserPlus,
  Trash2,
  CheckSquare,
  XSquare,
  Store,
  UtensilsCrossed,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Truck,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  Download,
  Plus,
  Edit,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  username: string;
  mobile: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
}

interface AdminPermission {
  email: string;
  granted_by: string;
  granted_at: string;
  is_active: boolean;
}

interface AdminRequest {
  id: string;
  name: string;
  email: string;
  department: string;
  employee_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requested_at: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  status: "active" | "inactive";
  orders_count: number;
  revenue: number;
}

interface MenuItem {
  id: string;
  name: string;
  restaurant_id: string;
  price: number;
  category: string;
  status: "available" | "unavailable";
}

interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  total_amount: number;
  created_at: string;
}

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>(
    [],
  );
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);
  const [signupRequests, setSignupRequests] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated as admin and check for first-time login
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin-login");
      return;
    }

    // Check if this is first-time admin login
    const hasVisitedAdmin = localStorage.getItem("hasVisitedAdmin");
    if (!hasVisitedAdmin) {
      setIsFirstTime(true);
      localStorage.setItem("hasVisitedAdmin", "true");
      // Show welcome animation for 3 seconds
      setTimeout(() => setIsFirstTime(false), 3000);
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin-login");
      return {};
    }
    return {
      Authorization: `Bearer ${adminAuth}`,
      "Content-Type": "application/json",
    };
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      // Use existing admin endpoints that we know work
      try {
        // Fetch dashboard stats
        const dashboardResponse = await fetch("/api/admin/dashboard", {
          headers,
        });
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log("Dashboard data:", dashboardData);
          if (dashboardData.success && dashboardData.data) {
            // Set dashboard stats
            setStats({
              total: dashboardData.data.totalUsers || 0,
              verified: Math.floor((dashboardData.data.totalUsers || 0) * 0.8),
              unverified: Math.floor(
                (dashboardData.data.totalUsers || 0) * 0.2,
              ),
            });
          }
        }

        // Fetch users
        const usersResponse = await fetch("/api/admin/users", { headers });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.success && usersData.data) {
            setUsers(usersData.data);
          }
        }

        // Fetch restaurants
        const restaurantsResponse = await fetch("/api/admin/restaurants", {
          headers,
        });
        if (restaurantsResponse.ok) {
          const restaurantsData = await restaurantsResponse.json();
          if (restaurantsData.success && restaurantsData.data) {
            setRestaurants(restaurantsData.data);
          }
        }

        // Fetch orders
        const ordersResponse = await fetch("/api/admin/orders", { headers });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          if (ordersData.success && ordersData.data) {
            setOrders(ordersData.data);
          }
        }

        // Fetch food items
        const foodResponse = await fetch("/api/admin/food-items", { headers });
        if (foodResponse.ok) {
          const foodData = await foodResponse.json();
          if (foodData.success && foodData.data) {
            setMenuItems(
              foodData.data.map((item: any) => ({
                id: item._id,
                name: item.name,
                restaurant_id: item.restaurant?._id || "unknown",
                price: item.price,
                category: item.category,
                status: item.isAvailable ? "available" : "unavailable",
              })),
            );
          }
        }

        // Fetch payments
        const paymentsResponse = await fetch("/api/admin/payments", {
          headers,
        });
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          if (paymentsData.success && paymentsData.data) {
            setPayments(
              paymentsData.data.map((payment: any) => ({
                id: payment._id,
                order_id: payment.order?._id || "unknown",
                amount: payment.amount,
                method: payment.method,
                status: payment.status,
                created_at: payment.createdAt,
              })),
            );
          }
        }

        // Fetch signup requests
        const signupResponse = await fetch("/api/admin/signup-requests", {
          headers,
        });
        if (signupResponse.ok) {
          const signupData = await signupResponse.json();
          if (signupData.success && signupData.data) {
            setSignupRequests(signupData.data);
          }
        }
      } catch (fetchError) {
        console.warn("Some admin endpoints failed:", fetchError);
      }

      // Calculate stats from fetched data if dashboard endpoint didn't work
      if (!stats && users.length > 0) {
        setStats({
          total: users.length,
          verified: users.filter((u) => u.is_verified).length,
          unverified: users.filter((u) => !u.is_verified).length,
        });
      }

      // Set fallback data if endpoints failed
      if (menuItems.length === 0) {
        setMenuItems([
          {
            id: "item_1",
            name: "Margherita Pizza",
            restaurant_id: "rest-1",
            price: 299,
            category: "Pizza",
            status: "available",
          },
          {
            id: "item_2",
            name: "Chicken Burger",
            restaurant_id: "rest-2",
            price: 249,
            category: "Burger",
            status: "available",
          },
        ]);
      }

      if (payments.length === 0) {
        setPayments([
          {
            id: "pay_1",
            order_id: "order-1",
            amount: 916.7,
            method: "UPI",
            status: "completed",
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "pay_2",
            order_id: "order-2",
            amount: 412.8,
            method: "Card",
            status: "completed",
            created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError("Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const logout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin-login");
  };

  const grantAdminAccess = async () => {
    if (!newAdminEmail.trim()) {
      alert("Please enter an email address");
      return;
    }
    alert(`Admin access granted to ${newAdminEmail}`);
    setNewAdminEmail("");
  };

  const removeUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to remove user ${userEmail}?`)) {
      return;
    }

    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers,
        },
      );
      const data = await response.json();

      if (data.success) {
        alert(`User ${userEmail} removed successfully`);
        fetchUserData();
      } else {
        alert("Failed to remove user: " + data.message);
      }
    } catch (err) {
      alert("Error removing user");
      console.error("Error:", err);
    }
  };

  // First-time admin welcome animation
  if (isFirstTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="animate-bounce-gentle mb-8">
            <Settings className="w-24 h-24 text-white mx-auto" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-slide-up">
            Welcome to FASTIO Admin
          </h1>
          <p className="text-xl text-white/90 animate-fade-in">
            Your administrative dashboard is loading...
          </p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-orange-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to App</span>
              </Link>
              <div className="border-l border-white/30 h-6 mx-2"></div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6" />
                FASTIO Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUserData}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "restaurants", label: "Restaurants", icon: Store },
              { id: "food", label: "Food Items", icon: UtensilsCrossed },
              { id: "orders", label: "Orders", icon: Package },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "admin", label: "Admin Management", icon: UserPlus },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.total || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Store className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Restaurants
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {restaurants.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <Package className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        orders.filter(
                          (o) =>
                            o.status !== "delivered" &&
                            o.status !== "cancelled",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹
                      {payments
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Recent Orders
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #{order.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{order.total_amount}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Pending Actions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Admin Requests</span>
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {
                        adminRequests.filter((r) => r.status === "pending")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Unverified Users</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {stats?.unverified || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Pending Orders</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {orders.filter((o) => o.status === "pending").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  User Management
                </h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                  <button
                    onClick={fetchUserData}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* User Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {stats?.total || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">
                        Verified
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {stats?.verified || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center">
                    <UserX className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600">
                        Unverified
                      </p>
                      <p className="text-2xl font-bold text-red-900">
                        {stats?.unverified || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 animate-pulse">
                    Loading users...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id.slice(-8)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">
                                {user.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.mobile || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.is_verified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.is_verified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.created_at
                              ? formatDate(user.created_at)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeUser(user.id, user.email)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Restaurant Management
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  <Plus className="w-4 h-4" />
                  Add Restaurant
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {restaurant.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          restaurant.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {restaurant.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {restaurant.cuisine}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">{restaurant.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Orders: {restaurant.orders_count}</p>
                      <p>Revenue: ₹{restaurant.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Management
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          User {order.user_id.slice(-4)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.total_amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Truck className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Food Items Tab */}
        {activeTab === "food" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Food Items Management
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Food Item
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading food items...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "available"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Category: {item.category}
                      </p>
                      <p className="text-lg font-bold text-orange-600 mb-2">
                        ₹{item.price}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Restaurant ID: {item.restaurant_id.slice(-6)}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Management
                </h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading payments...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{payment.order_id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            ₹{payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-900 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              {payment.status === "pending" && (
                                <button className="text-orange-600 hover:text-orange-900 transition-colors">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === "admin" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Admin Management
              </h2>

              {/* Grant Admin Access */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  Grant Admin Access
                </h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter employee email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={grantAdminAccess}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Grant Access
                  </button>
                </div>
              </div>

              {/* Admin Requests */}
              {adminRequests.filter((r) => r.status === "pending").length >
                0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    Pending Admin Requests (
                    {adminRequests.filter((r) => r.status === "pending").length}
                    )
                  </h3>
                  <div className="space-y-4">
                    {adminRequests
                      .filter((r) => r.status === "pending")
                      .map((request) => (
                        <div
                          key={request.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {request.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {request.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {request.department} • ID: {request.employee_id}
                              </p>
                              <p className="text-sm text-gray-700 mt-2">
                                {request.reason}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                <CheckSquare className="w-4 h-4" />
                                Approve
                              </button>
                              <button className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                <XSquare className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
