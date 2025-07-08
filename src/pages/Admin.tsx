import type { User, Restaurant, CartItem, Order, ApiClient, OrderStatus, RestaurantStatus } from '@/types';
import type {
  DashboardStats,
  User,
  Restaurant,
  FoodItem,
  Order,
  Payment,
  SignupRequest,
} from "../lib/api";

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("fastio_user");
    if (!user) {
      navigate("/admin-login");
      return;
    }

    const userData = JSON.parse(user);
    if (!userData.role || userData.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    setCurrentUser(userData);

    const hasSeenWelcome = localStorage.getItem("admin_welcome_seen");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("admin_welcome_seen", "true");
      setTimeout(() => setShowWelcome(false), 3000);
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadDashboardStats(),
        loadUsers(),
        loadRestaurants(),
        loadFoodItems(),
        loadOrders(),
        loadPayments(),
        loadSignupRequests(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const response = await apiClient.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      setDashboardStats({
        totalUsers: 2,
        totalRestaurants: 4,
        totalOrders: 3,
        totalRevenue: 1435.6,
        pendingSignups: 2,
        activeRestaurants: 3,
      });
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([
        {
          id: "user-1",
          email: "mohamedshafik2526@gmail.com",
          name: "Mohamed Shafik",
          phone: "+91-9876543211",
          isAdmin: false,
          isActive: true,
          lastLogin: new Date().toISOString(),
          totalOrders: 5,
          totalSpent: 2450,
        },
      ]);
    }
  };

  const loadRestaurants = async () => {
    try {
      const response = await apiClient.getRestaurants();
      if (response.success) {
        setRestaurants(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load restaurants:", error);
      setRestaurants([
        {
          _id: "rest-1",
          name: "Pizza Palace",
          email: "pizza@example.com",
          phone: "+91-9876543212",
          address: {
            street: "123 Main St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
          },
          cuisine: ["Italian", "American"],
          description: "Authentic Italian pizzas",
          image: "",
          rating: 4.5,
          totalReviews: 125,
          status: OrderStatus.Active,
          deliveryTime: { min: 25, max: 35 },
          deliveryFee: 40,
          minimumOrder: 200,
          totalOrders: 1250,
          totalRevenue: 125000,
          isVerified: true,
        },
        {
          _id: "rest-2",
          name: "Burger Junction",
          email: "burger@example.com",
          phone: "+91-9876543213",
          address: {
            street: "456 Food St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400002",
          },
          cuisine: ["American"],
          description: "Gourmet burgers",
          image: "",
          rating: 4.2,
          totalReviews: 98,
          status: OrderStatus.Active,
          deliveryTime: { min: 20, max: 30 },
          deliveryFee: 35,
          minimumOrder: 150,
          totalOrders: 890,
          totalRevenue: 89000,
          isVerified: true,
        },
        {
          _id: "rest-3",
          name: "Spice Garden",
          email: "spice@example.com",
          phone: "+91-9876543214",
          address: {
            street: "789 Curry Lane",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400003",
          },
          cuisine: ["Indian"],
          description: "Traditional Indian cuisine",
          image: "",
          rating: 4.7,
          totalReviews: 210,
          status: OrderStatus.Active,
          deliveryTime: { min: 30, max: 45 },
          deliveryFee: 45,
          minimumOrder: 250,
          totalOrders: 1580,
          totalRevenue: 158000,
          isVerified: true,
        },
        {
          _id: "rest-4",
          name: "Cafe Delight",
          email: "cafe@example.com",
          phone: "+91-9876543215",
          address: {
            street: "321 Coffee Ave",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400004",
          },
          cuisine: ["Continental"],
          description: "Coffee and pastries",
          image: "",
          rating: 4.0,
          totalReviews: 76,
          status: OrderStatus.Inactive,
          deliveryTime: { min: 15, max: 25 },
          deliveryFee: 30,
          minimumOrder: 100,
          totalOrders: 450,
          totalRevenue: 45000,
          isVerified: false,
        },
      ]);
    }
  };

  const loadFoodItems = async () => {
    try {
      const response = await apiClient.getFoodItems();
      if (response.success) {
        setFoodItems(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load food items:", error);
      setFoodItems([
        {
          _id: "food-1",
          name: "Margherita Pizza",
          description: "Classic pizza with fresh tomatoes",
          price: 299,
          category: "Main Course",
          restaurant: { _id: "rest-1", name: "Pizza Palace" },
          image: "",
          ingredients: ["Tomatoes", "Mozzarella"],
          allergens: [],
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          spiceLevel: "Mild",
          isAvailable: true,
          preparationTime: 20,
          rating: 4.6,
          totalOrders: 245,
          emoji: "🍕",
        },
        {
          _id: "food-2",
          name: "Chicken Burger",
          description: "Juicy grilled chicken burger",
          price: 249,
          category: "Main Course",
          restaurant: { _id: "rest-2", name: "Burger Junction" },
          image: "",
          ingredients: ["Chicken", "Lettuce"],
          allergens: [],
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          spiceLevel: "Medium",
          isAvailable: true,
          preparationTime: 15,
          rating: 4.3,
          totalOrders: 189,
          emoji: "🍔",
        },
      ]);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await apiClient.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([
        {
          _id: "order-1",
          orderId: "ORD-001",
          user: {
            _id: "user-1",
            name: "Mohamed Shafik",
            email: "mohamedshafik2526@gmail.com",
          },
          restaurant: { _id: "rest-1", name: "Pizza Palace" },
          items: [],
          subtotal: 598,
          tax: 59.8,
          deliveryFee: 40,
          total: 697.8,
          status: OrderStatus.Delivered,
          paymentStatus: "Completed",
          paymentMethod: "UPI",
          deliveryAddress: {
            street: "123 User St",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400005",
            phone: "+91-9876543211",
          },
          estimatedDeliveryTime: new Date().toISOString(),
          actualDeliveryTime: new Date().toISOString(),
          notes: "",
          rating: 5,
          review: "Excellent!",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await apiClient.getPayments();
      if (response.success) {
        setPayments(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      setPayments([
        {
          _id: "pay-1",
          transactionId: "TXN-001",
          order: { _id: "order-1", orderId: "ORD-001", total: 697.8 },
          user: {
            _id: "user-1",
            name: "Mohamed Shafik",
            email: "mohamedshafik2526@gmail.com",
          },
          amount: 697.8,
          method: "UPI",
          status: "Completed",
          gateway: "PhonePe",
          gatewayTransactionId: "PP123456789",
          currency: "INR",
          refundAmount: 0,
          refundReason: "",
          failureReason: "",
          processedAt: new Date().toISOString(),
          refundedAt: "",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadSignupRequests = async () => {
    try {
      const response = await apiClient.getSignupRequests();
      if (response.success) {
        setSignupRequests(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load signup requests:", error);
      setSignupRequests([
        {
          _id: "req-1",
          email: "john.doe@example.com",
          name: "John Doe",
          phone: "+91-9876543216",
          requestType: "User",
          status: OrderStatus.Pending,
          rejectionReason: "",
          processedBy: { _id: "", name: "", email: "" },
          processedAt: "",
          notes: "",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const loadMockData = () => {
    setDashboardStats({
      totalUsers: 2,
      totalRestaurants: 4,
      totalOrders: 3,
      totalRevenue: 1435.6,
      pendingSignups: 2,
      activeRestaurants: 3,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("fastio_user");
    localStorage.removeItem("fastio_token");
    localStorage.removeItem("admin_welcome_seen");
    navigate("/admin-login");
  };

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await apiClient.updateUser(userId, { isActive });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isActive } : user,
        ),
      );
      toast.success(
        `User ${isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleUpdateRestaurantStatus = async (
    restaurantId: string,
    status: string,
  ) => {
    try {
      await apiClient.updateRestaurant(restaurantId, { status });
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, status }
            : restaurant,
        ),
      );
      toast.success("Restaurant status updated successfully");
    } catch (error) {
      console.error("Failed to update restaurant:", error);
      toast.error("Failed to update restaurant status");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiClient.updateOrder(orderId, { status });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleSignupRequest = async (
    requestId: string,
    action: "approve" | "reject",
    rejectionReason = "",
  ) => {
    try {
      const status = action === "approve" ? "Approved" : "Rejected";
      await apiClient.updateSignupRequest(requestId, {
        status,
        rejectionReason,
      });
      setSignupRequests(
        signupRequests.map((request) =>
          request._id === requestId
            ? { ...request, status, rejectionReason }
            : request,
        ),
      );
      toast.success(`Signup request ${action}d successfully`);
    } catch (error) {
      console.error("Failed to update signup request:", error);
      toast.error("Failed to update signup request");
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome Back, Admin!
          </h1>
          <p className="text-purple-100 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "bg-white",
  }: any) => (
    <div
      className={`${color} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "restaurants", label: "Restaurants", icon: Store },
    { id: "food-items", label: "Food Items", icon: UtensilsCrossed },
    { id: "orders", label: "Orders", icon: Package },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "signup-requests", label: "Signup Requests", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FastIO Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-400" />
              <Settings className="w-5 h-5 text-gray-400" />
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && dashboardStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={dashboardStats.totalUsers}
                icon={Users}
                trend="+12% vs last month"
              />
              <StatCard
                title="Active Restaurants"
                value={dashboardStats.activeRestaurants}
                icon={Store}
                trend="+3 new this week"
              />
              <StatCard
                title="Total Orders"
                value={dashboardStats.totalOrders}
                icon={Package}
                trend="+25% vs last month"
              />
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardStats.totalRevenue.toFixed(2)}`}
                icon={DollarSign}
                trend="+18% vs last month"
              />
              <StatCard
                title="Pending Signups"
                value={dashboardStats.pendingSignups}
                icon={UserPlus}
              />
              <StatCard
                title="Total Restaurants"
                value={dashboardStats.totalRestaurants}
                icon={Store}
              />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                User Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{user.totalSpent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? OrderStatus.Active : OrderStatus.Inactive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleUpdateUserStatus(user.id, !user.isActive)
                          }
                          className={`mr-2 ${user.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}
                        >
                          {user.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === "restaurants" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Restaurant Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuisine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
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
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {restaurant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {restaurant.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.cuisine.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {restaurant.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {restaurant.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{restaurant.totalRevenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={restaurant.status}
                          onChange={(e) =>
                            handleUpdateRestaurantStatus(
                              restaurant._id,
                              e.target.value,
                            )
                          }
                          className="text-xs font-semibold rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value={OrderStatus.Active}>Active</option>
                          <option value={OrderStatus.Inactive}>Inactive</option>
                          <option value={OrderStatus.Pending}>Pending</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Eye className="w-4 h-4 text-indigo-600 hover:text-indigo-900 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Food Items Tab */}
        {activeTab === "food-items" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Food Items Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {foodItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{item.emoji}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.restaurant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.totalOrders}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.restaurant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                          className="text-xs font-semibold rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value={OrderStatus.Pending}>Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value=OrderStatus.Preparing>Preparing</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value=OrderStatus.Delivered>Delivered</option>
                          <option value=OrderStatus.Cancelled>Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
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
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "Failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Signup Requests Tab */}
        {activeTab === "signup-requests" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Signup Requests
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {signupRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.requestType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.status === OrderStatus.Pending && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleSignupRequest(request._id, "approve")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleSignupRequest(
                                  request._id,
                                  "reject",
                                  "Not approved",
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
