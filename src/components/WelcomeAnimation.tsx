import { useEffect, useState } from "react";
import { User, CartItem, ApiClient, Restaurant, Order } from "@/lib/types";
import { Utensils, ShoppingCart, Star } from "lucide-react";

interface WelcomeAnimationProps {
  onComplete: () => void;
  userName?: string;
}

export default function WelcomeAnimation({
  onComplete,
  userName,
}: WelcomeAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: <Utensils className="w-16 h-16 text-primary-500" />,
      title: "Welcome to FASTIO!",
      description: userName
        ? `Hi ${userName}! Let's get you started`
        : "Your food delivery journey begins here",
    },
    {
      icon: <Utensils className="w-16 h-16 text-orange-500" />,
      title: "Discover Amazing Restaurants",
      description: "Browse through hundreds of local restaurants and cuisines",
    },
    {
      icon: <ShoppingCart className="w-16 h-16 text-green-500" />,
      title: "Easy Ordering",
      description: "Add items to cart and checkout in just a few taps",
    },
    {
      icon: <Star className="w-16 h-16 text-yellow-500" />,
      title: "Get FASTIO Pass",
      description: "Enjoy free delivery and exclusive discounts",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in transform-gpu">
        <div className="flex justify-center mb-6 animate-bounce-slow transform-gpu">
          {steps[currentStep].icon}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-slide-up transform-gpu">
          {steps[currentStep].title}
        </h2>

        <p className="text-gray-600 mb-8 animate-slide-up delay-100 transform-gpu">
          {steps[currentStep].description}
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-smooth transform-gpu ${
                index <= currentStep
                  ? "bg-primary-500 scale-110"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onComplete, 300);
          }}
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors-smooth"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}
