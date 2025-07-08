import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Store, Package, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return null; // Don't show navbar on auth pages
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <Logo size={32} className="sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
              FASTIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/restaurants"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/restaurants")
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Store size={20} />
              <span>Restaurants</span>
            </Link>
            <Link
              to="/orders"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/orders")
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Package size={20} />
              <span>Orders</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
              style={{ minHeight: "44px", minWidth: "44px" }}
            >
              <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation"
                style={{ minHeight: "44px", minWidth: "44px" }}
              >
                <User size={20} className="sm:w-6 sm:h-6" />
                <span className="hidden lg:block text-sm font-medium truncate max-w-[100px]">
                  {user.username}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white safe-area-bottom">
        <div className="flex justify-around py-1 px-2">
          <Link
            to="/"
            className={`flex flex-col items-center p-3 min-w-[60px] touch-manipulation ${
              isActive("/") ? "text-primary-600" : "text-gray-600"
            }`}
          >
            <Home size={20} className="mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link
            to="/restaurants"
            className={`flex flex-col items-center p-3 min-w-[60px] touch-manipulation ${
              isActive("/restaurants") ? "text-primary-600" : "text-gray-600"
            }`}
          >
            <Store size={20} className="mb-1" />
            <span className="text-xs font-medium">Food</span>
          </Link>
          <Link
            to="/cart"
            className={`flex flex-col items-center p-3 min-w-[60px] relative touch-manipulation ${
              isActive("/cart") ? "text-primary-600" : "text-gray-600"
            }`}
          >
            <ShoppingCart size={20} className="mb-1" />
            <span className="text-xs font-medium">Cart</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center p-3 min-w-[60px] touch-manipulation ${
              isActive("/orders") ? "text-primary-600" : "text-gray-600"
            }`}
          >
            <Package size={20} className="mb-1" />
            <span className="text-xs font-medium">Orders</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
