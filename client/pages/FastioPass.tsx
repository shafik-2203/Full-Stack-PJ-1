import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Crown,
  Coins,
  Truck,
  Clock,
  Shield,
  Star,
  Gift,
  ArrowRight,
  ChevronRight,
  Zap,
  Heart,
  Users,
  Award,
  Percent,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface PassPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  maxOrders: number;
  benefits: any[];
  savings: string;
  discount?: string;
  popular: boolean;
  originalPrice?: number;
}

interface UserCoins {
  balance: number;
  earnedTotal: number;
  transactions: any[];
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteRestaurant: string;
}

export default function FastioPass() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [currentPass, setCurrentPass] = useState<any>(null);
  const [userCoins, setUserCoins] = useState<UserCoins | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBenefit, setActiveBenefit] = useState(0);

  const passPlans: Record<string, PassPlan> = {
    monthly: {
      id: "monthly",
      name: "FASTIO Pass Monthly",
      price: 99,
      originalPrice: 299,
      duration: 30,
      maxOrders: 30,
      popular: false,
      savings: "Save ₹200/month",
      benefits: [
        {
          icon: <Truck className="w-5 h-5" />,
          title: "FREE Delivery",
          description: "On all orders above ₹99",
          value: "₹49 saved per order",
        },
        {
          icon: <Percent className="w-5 h-5" />,
          title: "15% Discount",
          description: "On orders from premium restaurants",
          value: "Up to ₹200 per order",
        },
        {
          icon: <Coins className="w-5 h-5" />,
          title: "2x FASTIO Coins",
          description: "Earn double coins on every order",
          value: "₹1 = 2 coins",
        },
        {
          icon: <Clock className="w-5 h-5" />,
          title: "Priority Delivery",
          description: "Get your food delivered faster",
          value: "15-20 mins faster",
        },
      ],
    },
    yearly: {
      id: "yearly",
      name: "FASTIO Pass Yearly",
      price: 999,
      originalPrice: 3588,
      duration: 365,
      maxOrders: 365,
      popular: true,
      savings: "Save ₹2,589/year",
      discount: "67% OFF",
      benefits: [
        {
          icon: <Truck className="w-5 h-5" />,
          title: "FREE Delivery",
          description: "On ALL orders (no minimum)",
          value: "₹49 saved per order",
        },
        {
          icon: <Percent className="w-5 h-5" />,
          title: "25% Discount",
          description: "On orders from all restaurants",
          value: "Up to ₹500 per order",
        },
        {
          icon: <Coins className="w-5 h-5" />,
          title: "3x FASTIO Coins",
          description: "Triple coins on every order",
          value: "₹1 = 3 coins",
        },
        {
          icon: <Crown className="w-5 h-5" />,
          title: "VIP Support",
          description: "Dedicated customer support",
          value: "24/7 priority help",
        },
        {
          icon: <Gift className="w-5 h-5" />,
          title: "Exclusive Deals",
          description: "Access to member-only offers",
          value: "50+ exclusive deals",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Order Protection",
          description: "Full refund guarantee",
          value: "100% protected",
        },
      ],
    },
  };

  useEffect(() => {
    fetchUserData();

    // Auto-rotate benefits showcase
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const [passResponse, coinsResponse] = await Promise.all([
        fetch("/api/user/pass", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/user/coins", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (passResponse.ok) {
        const passData = await passResponse.json();
        setCurrentPass(passData.data);
      }

      if (coinsResponse.ok) {
        const coinsData = await coinsResponse.json();
        setUserCoins(coinsData.data);
      }

      // Mock user stats for demo
      setUserStats({
        totalOrders: 47,
        totalSpent: 12450,
        averageOrderValue: 265,
        favoriteRestaurant: "The Great Kitchen",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/pass/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const result = await response.json();
      if (result.success) {
        setCurrentPass(result.data);
        alert("FASTIO Pass activated successfully! 🎉");
      } else {
        alert(result.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to activate FASTIO Pass");
    }
  };

  const calculateSavings = (plan: PassPlan) => {
    if (!userStats) return 0;
    const deliverySavings = userStats.totalOrders * 49; // ₹49 per delivery
    const discountSavings =
      userStats.totalSpent * (plan.id === "yearly" ? 0.25 : 0.15);
    return deliverySavings + discountSavings;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading your FASTIO Pass...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white hover:text-orange-200 transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">FASTIO Pass</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Current Pass Status */}
        {currentPass && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {currentPass.planName}
                  </h3>
                  <p className="text-white/80">
                    Active until{" "}
                    {new Date(currentPass.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {currentPass.ordersRemaining}
                </div>
                <p className="text-white/80 text-sm">Orders remaining</p>
              </div>
            </div>
          </div>
        )}

        {/* User Stats & Coins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="text-white font-semibold">Total Orders</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {userStats?.totalOrders || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">FASTIO Coins</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {userCoins?.balance || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-6 h-6 text-red-400" />
              <span className="text-white font-semibold">Total Spent</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ₹{userStats?.totalSpent || 0}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-purple-400" />
              <span className="text-white font-semibold">Avg Order</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ₹{userStats?.averageOrderValue || 0}
            </div>
          </div>
        </div>

        {/* Benefits Showcase */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Choose FASTIO Pass?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-yellow-400" />,
                  title: "Lightning Fast Delivery",
                  description:
                    "Get your food 15-20 minutes faster with priority delivery",
                },
                {
                  icon: <Gift className="w-8 h-8 text-pink-400" />,
                  title: "Exclusive Member Deals",
                  description: "Access to 50+ exclusive offers and discounts",
                },
                {
                  icon: <Shield className="w-8 h-8 text-blue-400" />,
                  title: "100% Order Protection",
                  description: "Full refund guarantee on all your orders",
                },
                {
                  icon: <Crown className="w-8 h-8 text-purple-400" />,
                  title: "VIP Treatment",
                  description: "Dedicated support and premium customer service",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                    activeBenefit === index
                      ? "bg-white/20 scale-105"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-white/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center">
                    <Crown className="w-32 h-32 text-orange-500" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                  SAVE 67%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Choose Your Plan
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 rounded-full p-2 flex">
              {Object.keys(passPlans).map((planId) => (
                <button
                  key={planId}
                  onClick={() => setSelectedPlan(planId)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedPlan === planId
                      ? "bg-white text-orange-500"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {planId === "monthly" ? "Monthly" : "Yearly"}
                  {passPlans[planId].popular && (
                    <span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                      POPULAR
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {Object.values(passPlans)
              .filter((plan) => plan.id === selectedPlan)
              .map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl p-8 border-4 ${
                    plan.popular
                      ? "border-yellow-400 transform scale-105"
                      : "border-transparent"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      MOST POPULAR
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-5xl font-bold text-orange-500">
                        ₹{plan.price}
                      </span>
                      {plan.originalPrice && (
                        <div className="text-left">
                          <div className="text-lg text-gray-500 line-through">
                            ₹{plan.originalPrice}
                          </div>
                          {plan.discount && (
                            <div className="text-green-600 font-bold">
                              {plan.discount}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{plan.savings}</p>
                    {userStats && (
                      <p className="text-green-600 font-semibold mt-2">
                        You could save ₹
                        {calculateSavings(plan).toLocaleString()} this year!
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                      >
                        <div className="text-orange-500">{benefit.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {benefit.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {benefit.description}
                          </p>
                        </div>
                        <div className="text-green-600 font-semibold text-sm">
                          {benefit.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={currentPass?.planId === plan.id}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {currentPass?.planId === plan.id ? (
                      <>
                        <Check className="w-6 h-6" />
                        Currently Active
                      </>
                    ) : (
                      <>
                        <Crown className="w-6 h-6" />
                        Upgrade to {plan.name}
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Coin Transactions */}
        {userCoins?.transactions && userCoins.transactions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mt-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent Coin Activity
            </h2>
            <div className="space-y-4">
              {userCoins.transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-white font-semibold">
                        {transaction.description}
                      </p>
                      <p className="text-white/60 text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "earned"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {transaction.amount} coins
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
