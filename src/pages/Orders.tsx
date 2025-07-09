import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  Truck,
  ChefHat,
  Star,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const mockOrders = [
  {
    id: "1",
    orderId: "ORD-001",
    restaurant: {
      name: "Pizza Palace",
      phone: "(555) 123-4567",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 16.99 },
      { name: "Caesar Salad", quantity: 1, price: 7.99 },
    ],
    total: 24.99,
    status: "Delivered",
    date: "2024-01-15",
    estimatedTime: "25-30 min",
    deliveryTime: "28 min",
    driver: {
      name: "John Doe",
      phone: "(555) 987-6543",
      rating: 4.8,
    },
    timeline: [
      { status: "Order Placed", time: "2:15 PM", completed: true },
      { status: "Confirmed", time: "2:16 PM", completed: true },
      { status: "Preparing", time: "2:20 PM", completed: true },
      { status: "Out for Delivery", time: "2:35 PM", completed: true },
      { status: "Delivered", time: "2:43 PM", completed: true },
    ],
  },
  {
    id: "2",
    orderId: "ORD-002",
    restaurant: {
      name: "Burger Junction",
      phone: "(555) 234-5678",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    },
    items: [
      { name: "Classic Burger", quantity: 1, price: 14.99 },
      { name: "Crispy Fries", quantity: 1, price: 6.99 },
    ],
    total: 21.98,
    status: "Out for Delivery",
    date: "2024-01-16",
    estimatedTime: "15-20 min",
    driver: {
      name: "Sarah Wilson",
      phone: "(555) 456-7890",
      rating: 4.9,
    },
    timeline: [
      { status: "Order Placed", time: "3:10 PM", completed: true },
      { status: "Confirmed", time: "3:11 PM", completed: true },
      { status: "Preparing", time: "3:15 PM", completed: true },
      { status: "Out for Delivery", time: "3:25 PM", completed: true },
      { status: "Delivered", time: "Expected 3:30 PM", completed: false },
    ],
  },
  {
    id: "3",
    orderId: "ORD-003",
    restaurant: {
      name: "Sushi Zen",
      phone: "(555) 345-6789",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop",
    },
    items: [
      { name: "California Roll", quantity: 2, price: 12.99 },
      { name: "Miso Soup", quantity: 1, price: 4.99 },
    ],
    total: 30.97,
    status: "Preparing",
    date: "2024-01-16",
    estimatedTime: "30-35 min",
    timeline: [
      { status: "Order Placed", time: "3:45 PM", completed: true },
      { status: "Confirmed", time: "3:46 PM", completed: true },
      { status: "Preparing", time: "3:50 PM", completed: true },
      {
        status: "Out for Delivery",
        time: "Expected 4:10 PM",
        completed: false,
      },
      { status: "Delivered", time: "Expected 4:20 PM", completed: false },
    ],
  },
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please log in to view orders
          </h2>
          <Link to="/login" className="text-orange-600 hover:text-orange-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Out for Delivery":
        return "bg-blue-100 text-blue-800";
      case "Preparing":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "Out for Delivery":
        return <Truck className="w-5 h-5" />;
      case "Preparing":
        return <ChefHat className="w-5 h-5" />;
      case "Confirmed":
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <div className="text-sm text-gray-600">
            {mockOrders.length} order{mockOrders.length !== 1 ? "s" : ""}
          </div>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Ready to order some delicious food?
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={order.restaurant.image}
                        alt={order.restaurant.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {order.restaurant.name}
                        </h3>
                        <p className="text-gray-600">Order #{order.orderId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                      <p className="font-semibold text-lg">${order.total}</p>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder === order.id ? null : order.id,
                        )
                      }
                      className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
                    >
                      {selectedOrder === order.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder === order.id && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-600 ml-2">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Status
                        </h4>
                        <div className="space-y-4">
                          {order.timeline.map((step, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {step.completed ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Clock className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}
                                >
                                  {step.status}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {step.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Driver Info & Actions */}
                    {order.status === "Out for Delivery" && order.driver && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Delivery Driver
                        </h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-orange-600">
                                {order.driver.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.driver.name}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {order.driver.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                              <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                              <MessageCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                      {order.status === "Delivered" && (
                        <>
                          <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                            Rate Order
                          </button>
                          <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Reorder
                          </button>
                        </>
                      )}
                      {order.status === "Out for Delivery" && (
                        <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Track Live
                        </button>
                      )}
                      {order.status === "Preparing" && (
                        <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                          Cancel Order
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Get Help
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
