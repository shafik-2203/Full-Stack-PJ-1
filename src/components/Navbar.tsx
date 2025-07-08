
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/dashboard">
              <UserIcon className="w-6 h-6 text-gray-700" />
            </Link>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
