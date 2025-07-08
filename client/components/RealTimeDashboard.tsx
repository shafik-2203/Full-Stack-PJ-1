import React, { useState, useEffect } from "react";

interface RealTimeStats {
  activeOrders: number;
  avgDeliveryTime: number;
  topRestaurants: Array<{
    id: string;
    name: string;
    orders: number;
    rating: number;
  }>;
  deliveryPartners: number;
  promotions: Array<{
    id: string;
    title: string;
    discount: number;
    restaurant: string;
    expiresIn: number;
  }>;
}

export default function RealTimeDashboard() {
  const [stats, setStats] = useState<RealTimeStats>({
    activeOrders: 0,
    avgDeliveryTime: 25,
    topRestaurants: [],
    deliveryPartners: 0,
    promotions: [],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates
    realTimeService.on("connected", setIsConnected);
    realTimeService.on("statsUpdate", handleStatsUpdate);
    realTimeService.on("promotionAlert", handlePromotionAlert);

    // Load initial data
    loadDashboardData();

    // Set up periodic updates
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      realTimeService.off("connected", setIsConnected);
      realTimeService.off("statsUpdate", handleStatsUpdate);
      realTimeService.off("promotionAlert", handlePromotionAlert);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      // Initialize with empty data - in real app this would come from API
      setStats({
        activeOrders: 0,
        avgDeliveryTime: 0,
        topRestaurants: [],
        deliveryPartners: 0,
        promotions: [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleStatsUpdate = (newStats: Partial<RealTimeStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const handlePromotionAlert = (promotion: any) => {
    const message = `🎉 New Deal: ${promotion.title} at ${promotion.restaurant}`;
    setNotifications((prev) => [message, ...prev.slice(0, 4)]); // Keep only 5 notifications
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className={`p-4 rounded-lg flex items-center gap-3 ${
          isConnected
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span
          className={`font-medium ${
            isConnected ? "text-green-800" : "text-red-800"
          }`}
        >
          {isConnected
            ? "🔄 Real-time updates active"
            : "⚠️ Connecting to real-time updates..."}
        </span>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Orders</p>
              <p className="text-3xl font-bold">{stats.activeOrders}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Live tracking</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Delivery</p>
              <p className="text-3xl font-bold">{stats.avgDeliveryTime}m</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Real-time</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Partners Online</p>
              <p className="text-3xl font-bold">{stats.deliveryPartners}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Ready to deliver</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Deals</p>
              <p className="text-3xl font-bold">{stats.promotions.length}</p>
            </div>
            <Percent className="w-8 h-8 text-orange-200" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm">Live offers</span>
          </div>
        </div>
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Live Updates
          </h3>
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="text-yellow-700 text-sm p-2 bg-yellow-100 rounded-lg"
              >
                {notification}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Restaurants - Real-time */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          Trending Now
        </h3>
        <div className="space-y-3">
          {stats.topRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{restaurant.name}</p>
                  <p className="text-sm text-gray-600">
                    {restaurant.orders} orders today
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Promotions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Percent className="w-6 h-6 text-green-500" />
          Live Deals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-green-800">{promotion.title}</h4>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {promotion.discount}% OFF
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {promotion.restaurant}
              </p>
              <div className="flex items-center gap-1 text-red-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Expires in {formatTimeLeft(promotion.expiresIn)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}