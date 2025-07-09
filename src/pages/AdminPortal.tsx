import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Users,
  Store,
  Package,
  BarChart3,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
} from "lucide-react";

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Restaurants",
      value: "87",
      change: "+5%",
      icon: Store,
      color: "orange",
    },
    {
      label: "Total Orders",
      value: "15,429",
      change: "+18%",
      icon: Package,
      color: "green",
    },
    {
      label: "Revenue",
      value: "$89,432",
      change: "+23%",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Active",
      joined: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Active",
      joined: "2024-01-14",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "Pending",
      joined: "2024-01-13",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Alice Brown",
      restaurant: "Pizza Palace",
      amount: "$24.99",
      status: "Delivered",
    },
    {
      id: "ORD-002",
      customer: "Bob Wilson",
      restaurant: "Burger Junction",
      amount: "$18.50",
      status: "Preparing",
    },
    {
      id: "ORD-003",
      customer: "Carol Davis",
      restaurant: "Sushi Zen",
      amount: "$32.75",
      status: "Out for Delivery",
    },
  ];

  const tabs = [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "users", name: "User Management", icon: Users },
    { id: "restaurants", name: "Restaurant Management", icon: Store },
    { id: "orders", name: "Order Tracking", icon: Package },
    { id: "analytics", name: "Analytics Dashboard", icon: TrendingUp },
    { id: "reports", name: "Revenue Reports", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin-login"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  FASTIO Admin Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <button className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p
                        className={`text-sm mt-1 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change} from last month
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Users
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.joined}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.customer} • {order.restaurant}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {order.amount}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Preparing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Management
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Orders
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">12</td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.joined}
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                            Edit
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

        {/* Other tabs content - placeholder for now */}
        {activeTab !== "dashboard" && activeTab !== "users" && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {(() => {
                const activeTabData = tabs.find((tab) => tab.id === activeTab);
                const IconComponent = activeTabData?.icon;
                return IconComponent ? (
                  <IconComponent className="w-8 h-8 text-purple-600" />
                ) : null;
              })()}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.name}
            </h3>
            <p className="text-gray-600">
              This section is under development. Advanced{" "}
              {tabs.find((tab) => tab.id === activeTab)?.name.toLowerCase()}{" "}
              features will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
