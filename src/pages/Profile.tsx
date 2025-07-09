import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  Camera,
  Bell,
  CreditCard,
  Shield,
  Heart,
  Package,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    mobile: user?.mobile || user?.phone || "",
    address: "123 Demo Street, Demo City",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view profile
          </h2>
          <Link to="/login" className="text-orange-600 hover:text-orange-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "preferences", name: "Preferences", icon: Bell },
    { id: "orders", name: "Order History", icon: Package },
    { id: "favorites", name: "Favorites", icon: Heart },
  ];

  const handleSaveProfile = () => {
    // Simulate API call
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Simulate API call
    toast.success("Password changed successfully!");
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const recentOrders = [
    {
      id: "ORD-001",
      restaurant: "Pizza Palace",
      total: 24.99,
      date: "2024-01-15",
      rating: 5,
    },
    {
      id: "ORD-002",
      restaurant: "Burger Junction",
      total: 18.5,
      date: "2024-01-12",
      rating: 4,
    },
    {
      id: "ORD-003",
      restaurant: "Sushi Zen",
      total: 32.0,
      date: "2024-01-10",
      rating: 5,
    },
  ];

  const favoriteItems = [
    { name: "Margherita Pizza", restaurant: "Pizza Palace", image: "🍕" },
    { name: "Classic Burger", restaurant: "Burger Junction", image: "🍔" },
    { name: "California Roll", restaurant: "Sushi Zen", image: "🍣" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-orange-600" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {user.username || user.name}
                </h1>
                <p className="text-orange-100">Member since January 2024</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
                    <span className="text-sm">4.8 Rating</span>
                  </div>
                  <div className="text-sm">{user.totalOrders || 0} Orders</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700"
                  >
                    {isEditing ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={editForm.mobile}
                        onChange={(e) =>
                          setEditForm({ ...editForm, mobile: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <label className="text-sm text-gray-600">
                            Username
                          </label>
                          <p className="font-medium">
                            {user.username || user.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <label className="text-sm text-gray-600">Email</label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <label className="text-sm text-gray-600">
                            Mobile
                          </label>
                          <p className="font-medium">
                            {user.mobile || user.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <label className="text-sm text-gray-600">
                            Address
                          </label>
                          <p className="font-medium">
                            123 Demo Street, Demo City
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Account Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {user.totalOrders || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${user.totalSpent || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        4.8
                      </div>
                      <div className="text-sm text-gray-600">
                        Average Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        12
                      </div>
                      <div className="text-sm text-gray-600">Favorites</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Security Settings</h2>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-600">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Change Password
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showNewPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Enable 2FA
                  </button>
                </div>

                <div className="pt-6">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Logout from All Devices
                  </button>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Link
                    to="/orders"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View All Orders
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.restaurant}</p>
                          <p className="text-sm text-gray-600">
                            {order.id} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: order.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-400 fill-current"
                                />
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Favorites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="text-3xl">{item.image}</div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.restaurant}
                        </p>
                      </div>
                      <button className="ml-auto text-red-500 hover:text-red-600">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Preferences</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Order updates</span>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.orderUpdates}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              notifications: {
                                ...preferences.notifications,
                                orderUpdates: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Promotions and offers</span>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.promotions}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              notifications: {
                                ...preferences.notifications,
                                promotions: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Newsletter</span>
                        <input
                          type="checkbox"
                          checked={preferences.notifications.newsletter}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              notifications: {
                                ...preferences.notifications,
                                newsletter: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">Dietary Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span>Vegetarian</span>
                        <input
                          type="checkbox"
                          checked={preferences.dietary.vegetarian}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              dietary: {
                                ...preferences.dietary,
                                vegetarian: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Vegan</span>
                        <input
                          type="checkbox"
                          checked={preferences.dietary.vegan}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              dietary: {
                                ...preferences.dietary,
                                vegan: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Gluten-free</span>
                        <input
                          type="checkbox"
                          checked={preferences.dietary.glutenFree}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              dietary: {
                                ...preferences.dietary,
                                glutenFree: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success("Preferences saved!")}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
