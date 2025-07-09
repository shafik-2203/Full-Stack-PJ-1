import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { realTimeService, formatEstimatedTime } from "../lib/realtime";

interface Order {
  id: string;
  status: string;
  estimatedTime: number;
  restaurant: {
    name: string;
    address: string;
  };
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

interface OrderTrackingProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderTracking({
  orderId,
  onClose,
}: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState("confirmed");
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [deliveryPartner, setDeliveryPartner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial order data
    loadOrderData();

    // Subscribe to real-time updates
    realTimeService.on("orderUpdate", handleOrderUpdate);
    realTimeService.on(
      "deliveryPartnerAssigned",
      handleDeliveryPartnerAssigned,
    );
    realTimeService.on("deliveryLocationUpdate", handleLocationUpdate);

    // Start tracking
    realTimeService.trackOrder(orderId);
    realTimeService.subscribeToDeliveryTracking(orderId);

    return () => {
      realTimeService.off("orderUpdate", handleOrderUpdate);
      realTimeService.off(
        "deliveryPartnerAssigned",
        handleDeliveryPartnerAssigned,
      );
      realTimeService.off("deliveryLocationUpdate", handleLocationUpdate);
    };
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
        setOrderStatus(data.data.status);
      }
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderUpdate = (update: any) => {
    if (update.orderId === orderId) {
      setOrderStatus(update.status);
      if (update.estimatedTime) {
        setEstimatedTime(update.estimatedTime);
      }
    }
  };

  const handleDeliveryPartnerAssigned = (partner: any) => {
    setDeliveryPartner(partner);
  };

  const handleLocationUpdate = (location: any) => {
    // Update delivery partner location on map
    console.log("Delivery partner location:", location);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          title: "Order Confirmed",
          description: "Your order has been confirmed by the restaurant",
          color: "bg-green-100 border-green-200",
        };
      case "preparing":
        return {
          icon: <Clock className="w-6 h-6 text-orange-500" />,
          title: "Preparing Your Order",
          description: "The restaurant is preparing your delicious meal",
          color: "bg-orange-100 border-orange-200",
        };
      case "ready":
        return {
          icon: <AlertCircle className="w-6 h-6 text-blue-500" />,
          title: "Order Ready",
          description: "Your order is ready and waiting for pickup",
          color: "bg-blue-100 border-blue-200",
        };
      case "picked_up":
        return {
          icon: <Truck className="w-6 h-6 text-purple-500" />,
          title: "Out for Delivery",
          description: "Your order is on its way to you",
          color: "bg-purple-100 border-purple-200",
        };
      case "delivered":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: "Delivered",
          description: "Your order has been delivered. Enjoy your meal!",
          color: "bg-green-100 border-green-200",
        };
      default:
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          title: "Processing",
          description: "We're processing your order",
          color: "bg-gray-100 border-gray-200",
        };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Track Your Order</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-orange-100 mt-1">Order #{orderId.slice(-6)}</p>
        </div>

        {/* Status */}
        <div className={`p-6 border-b ${statusInfo.color}`}>
          <div className="flex items-center gap-4">
            {statusInfo.icon}
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{statusInfo.title}</h3>
              <p className="text-gray-600 text-sm">{statusInfo.description}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-orange-500">
                {formatEstimatedTime(estimatedTime)}
              </div>
              <p className="text-xs text-gray-500">estimated</p>
            </div>
          </div>
        </div>

        {/* Delivery Partner (if assigned) */}
        {deliveryPartner && (
          <div className="p-6 border-b bg-gray-50">
            <h4 className="font-semibold text-gray-800 mb-3">
              Your Delivery Partner
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {deliveryPartner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {deliveryPartner.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">
                      {deliveryPartner.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {deliveryPartner.vehicle}
                    </span>
                  </div>
                </div>
              </div>
              <a
                href={`tel:${deliveryPartner.phone}`}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order && (
          <div className="p-6 border-b">
            <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-bold">
                <span>Total Amount</span>
                <span className="text-orange-500">₹{order.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Info */}
        {order && (
          <div className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="font-medium text-gray-800">
                  {order.restaurant.name}
                </p>
                <p className="text-sm text-gray-600">
                  {order.restaurant.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            {["confirmed", "preparing", "ready", "picked_up", "delivered"].map(
              (step, index) => {
                const isActive = getStatusPriority(orderStatus) >= index + 1;
                const isCurrent = orderStatus === step;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-600 mt-1 text-center">
                      {step.replace("_", " ")}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusPriority(status: string): number {
  const priorities: Record<string, number> = {
    confirmed: 1,
    preparing: 2,
    ready: 3,
    picked_up: 4,
    delivered: 5,
  };
  return priorities[status] || 0;
}
