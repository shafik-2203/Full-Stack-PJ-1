import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Gift,
  Zap,
  Crown,
  Truck,
  Clock,
  Check,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function FastioPass() {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { user } = useAuth();

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: 9.99,
      period: "month",
      savings: null,
      popular: false,
    },
    {
      id: "quarterly",
      name: "Quarterly",
      price: 24.99,
      period: "3 months",
      savings: "Save 15%",
      popular: true,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 79.99,
      period: "year",
      savings: "Save 33%",
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: Truck,
      title: "Unlimited Free Delivery",
      description: "Zero delivery fees on all orders, no minimum required",
      color: "purple",
    },
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Early access to deals and member-only discounts",
      color: "pink",
    },
    {
      icon: Crown,
      title: "Priority Support",
      description: "24/7 premium customer support with instant chat",
      color: "orange",
    },
    {
      icon: Clock,
      title: "Faster Delivery",
      description: "Priority queue for 15% faster delivery times",
      color: "blue",
    },
    {
      icon: Star,
      title: "Bonus Rewards",
      description: "Earn 2x points on every order for future discounts",
      color: "yellow",
    },
    {
      icon: Zap,
      title: "Express Checkout",
      description: "Skip the queue with one-click ordering",
      color: "green",
    },
  ];

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please log in to subscribe");
      return;
    }

    setIsSubscribing(true);
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribing(false);
      toast.success("Welcome to FASTIO Pass! 🎉", {
        description: "Your premium benefits are now active",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            FASTIO Pass
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Unlock premium benefits and save money with every order
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
            <Gift className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-medium">
              Join 10,000+ satisfied members
            </span>
          </div>
        </div>

        {/* Plans Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                } ${plan.popular ? "ring-2 ring-purple-200" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {plan.savings}
                    </span>
                  )}
                  <div className="mt-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mx-auto ${
                        selectedPlan === plan.id
                          ? "bg-purple-500 border-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check className="w-full h-full text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {isSubscribing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Subscribe to FASTIO Pass
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-3">
              Cancel anytime • No commitment • Instant activation
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Premium Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={`w-16 h-16 bg-${benefit.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${benefit.color}-200 transition-colors`}
                >
                  <benefit.icon
                    className={`w-8 h-8 text-${benefit.color}-600`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  $127
                </div>
                <p className="text-gray-600">Average monthly savings</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 mb-2">15%</div>
                <p className="text-gray-600">Faster delivery times</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  98%
                </div>
                <p className="text-gray-600">Member satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How does the free delivery work?
              </h3>
              <p className="text-gray-600">
                FASTIO Pass members get unlimited free delivery on all orders,
                regardless of order value or restaurant location.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your FASTIO Pass subscription at any time
                with no cancellation fees. Your benefits will continue until the
                end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do the benefits work at all restaurants?
              </h3>
              <p className="text-gray-600">
                FASTIO Pass benefits apply to all partner restaurants on our
                platform. Some exclusive offers may be restaurant-specific.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
