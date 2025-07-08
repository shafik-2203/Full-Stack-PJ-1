import type { User, Restaurant, CartItem, Order, ApiClient, OrderStatus, RestaurantStatus } from '@/types';
import BackButton from "@/components/BackButton";
export default function Cart() {
  const {
    items,
    totalAmount,
    totalItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const restaurant =
    items.length > 0
      ? restaurants.find((r) => r.id === items[0].restaurantId)
      : null;

  const deliveryFee = restaurant?.deliveryFee || 0;
  const minimumOrder = restaurant?.minimumOrder || 0;
  const grandTotal = totalAmount + deliveryFee;
  const isMinimumMet = totalAmount >= minimumOrder;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="mb-6">
            <BackButton to="/restaurants" />
          </div>

          <div className="text-center py-20 animate-scale-in">
            <div className="animate-bounce-slow">
              <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-up">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6 animate-slide-up delay-100">
              Add some delicious items from our restaurants!
            </p>
            <Link
              to="/restaurants"
              className="btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2 animate-slide-up delay-200 transform hover:scale-105 transition-transform duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="mb-6">
          <BackButton to="/restaurants" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Cart ({totalItems} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant Info */}
            {restaurant && (
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <h2 className="font-semibold text-gray-900 mb-1">
                  Ordering from {restaurant.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {restaurant.location.address}
                </p>
              </div>
            )}

            {/* Cart Items */}
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 pr-2">
                        {item.name}
                        {item.isVegetarian && (
                          <span className="ml-2 text-green-600 text-sm">
                            🌱
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-600">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {!isMinimumMet && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    Add {formatPrice(minimumOrder - totalAmount)} more to meet
                    the minimum order requirement.
                  </p>
                </div>
              )}

              <Link
                to="/checkout"
                className={`w-full btn-primary py-3 rounded-lg text-center block ${
                  !isMinimumMet ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={(e) => {
                  if (!isMinimumMet) {
                    e.preventDefault();
                  }
                }}
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/restaurants"
                className="w-full mt-3 btn-ghost py-3 rounded-lg text-center block border"
              >
                Add More Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
