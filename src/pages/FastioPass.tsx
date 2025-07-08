import { Shield , Star } from "lucide-react";
import { useState } from "react";
import BackButton from "@/components/BackButton";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PassPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  savings: string;
  features: string[];
  popular: boolean;
  color: string;
}

const passPlans: PassPlan[] = [
  {
    id: "monthly",
    name: "Monthly Pass",
    price: 9.99,
    duration: "1 Month",
    savings: "Save up to $15/month",
    features: [
      "Free delivery on all orders",
      "5% cashback on every order",
      "Priority customer support",
      "Early access to new restaurants",
      "No surge pricing",
    ],
    popular: false,
    color: "border-gray-200",
  },
  {
    id: "quarterly",
    name: "Quarterly Pass",
    price: 24.99,
    duration: "3 Months",
    savings: "Save up to $50 (Best Value)",
    features: [
      "Free delivery on all orders",
      "10% cashback on every order",
      "Priority customer support",
      "Early access to new restaurants",
      "No surge pricing",
      "Exclusive member-only deals",
      "Free premium support",
    ],
    popular: true,
    color: "border-primary-500 ring-2 ring-primary-200",
  },
  {
    id: "yearly",
    name: "Annual Pass",
    price: 79.99,
    duration: "12 Months",
    savings: "Save up to $200/year",
    features: [
      "Free delivery on all orders",
      "15% cashback on every order",
      "Priority customer support",
      "Early access to new restaurants",
      "No surge pricing",
      "Exclusive member-only deals",
      "Free premium support",
      "Birthday rewards",
      "VIP customer status",
    ],
    popular: false,
    color: "border-gray-200",
  },
];

export default function FastioPass() {
  const [selectedPlan, setSelectedPlan] = useState<string>("quarterly");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe to FASTIO Pass");
      return;
    }

    setIsLoading(true);

    // Simulate subscription process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Successfully subscribed to FASTIO Pass! 🎉");
      // In a real app, this would integrate with a payment processor
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              FASTIO Pass
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get unlimited free delivery, exclusive deals, and premium benefits
            with FASTIO Pass
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-600 text-sm">
              No delivery fees on any order, any time
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Cashback Rewards
            </h3>
            <p className="text-gray-600 text-sm">
              Earn cashback on every order you place
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Priority Support
            </h3>
            <p className="text-gray-600 text-sm">
              Skip the line with priority customer service
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Exclusive Access
            </h3>
            <p className="text-gray-600 text-sm">
              Early access to new restaurants and features
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {passPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${plan.color} ${
                  selectedPlan === plan.id ? "transform scale-105" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(plan.price)}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.duration}</p>
                  <p className="text-green-600 text-sm font-medium mt-2">
                    {plan.savings}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe()}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    selectedPlan === plan.id
                      ? "bg-primary-500 text-white hover:bg-primary-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                How does FASTIO Pass work?
              </h3>
              <p className="text-gray-600">
                FASTIO Pass is a subscription service that gives you unlimited
                free delivery, cashback rewards, and exclusive benefits on all
                your food orders.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your FASTIO Pass subscription at any time
                from your account settings. Your benefits will continue until
                the end of your current billing period.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                What restaurants are included?
              </h3>
              <p className="text-gray-600">
                FASTIO Pass benefits apply to all restaurants on our platform.
                Enjoy free delivery and cashback rewards from any restaurant you
                order from.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
