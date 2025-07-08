import { Info, Users, ShoppingCart, Star, Zap } from "lucide-react";

export default function UserGuide() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            Welcome to FASTIO! 🍔
          </h2>
          <p className="text-green-800 text-sm mb-4">
            Your complete food delivery experience is ready. Here's what you can
            do:
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Sign Up & Login</h3>
          <p className="text-gray-600 text-sm">
            Create an account or use demo credentials to get started
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <ShoppingCart className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Browse & Order</h3>
          <p className="text-gray-600 text-sm">
            Explore 4 restaurants with real menu items and add to cart
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Star className="w-8 h-8 text-yellow-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">Rate & Review</h3>
          <p className="text-gray-600 text-sm">
            See ratings, reviews, and delivery times for each restaurant
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Zap className="w-8 h-8 text-orange-600 mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">FASTIO Pass</h3>
          <p className="text-gray-600 text-sm">
            Subscribe for free delivery and exclusive benefits
          </p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-green-700 text-sm font-medium">
          ✨ Everything works locally - no internet required! ✨
        </p>
      </div>
    </div>
  );
}
