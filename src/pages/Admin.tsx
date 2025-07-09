import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Users,
  Store,
  Package,
  BarChart3,
} from "lucide-react";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/admin-login"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Admin Login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your food delivery platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">56</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">5,678</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$89,012</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin-portal"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </Link>
              <Link
                to="/admin-portal"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <Store className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Restaurants</span>
              </Link>
              <Link
                to="/admin-portal"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Orders</span>
              </Link>
              <Link
                to="/admin-portal"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
              >
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">New user registered</span>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Order #1234 completed</span>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">New restaurant added</span>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
