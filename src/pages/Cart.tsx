import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Logo from "../components/Logo";

export default function Cart() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size={60} />
              <h1 className="text-2xl font-bold text-white">FASTIO</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-white hover:text-orange-200 transition-colors"
              >
                Home
              </Link>
              <Link to="/cart" className="text-orange-200 font-semibold">
                Cart
              </Link>
              <Link
                to="/orders"
                className="text-white hover:text-orange-200 transition-colors"
              >
                Orders
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 text-center max-w-2xl">
            <div className="text-white text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover delicious food from our restaurants and add items to your
              cart.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-100 transition-all"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  const restaurantName = items[0]?.restaurantName || "Restaurant";
  const deliveryFee = 2.99; // This should come from restaurant data
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={60} />
            <h1 className="text-2xl font-bold text-white">FASTIO</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Home
            </Link>
            <Link to="/cart" className="text-orange-200 font-semibold">
              Cart ({totalItems})
            </Link>
            <Link
              to="/orders"
              className="text-white hover:text-orange-200 transition-colors"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user?.username}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-orange-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Cart</h1>
            <p className="text-white/80 text-lg">From {restaurantName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Items ({totalItems})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl">🍽️</span>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.menuItem.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.menuItem.description}
                        </p>
                        <p className="text-orange-500 font-semibold">
                          ${item.menuItem.price}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      ${deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-orange-500">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to={`/restaurants/${items[0]?.restaurantId}`}
                  className="block w-full text-center mt-4 text-orange-500 hover:text-orange-700 transition-colors"
                >
                  Add more items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
