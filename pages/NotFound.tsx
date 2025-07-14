import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Logo from "../components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size={60} className="sm:hidden" />
        <Logo size={80} className="hidden sm:block" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-lg mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-6xl sm:text-8xl font-bold text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Sorry, the page{" "}
            <code className="bg-black/20 px-2 py-1 rounded text-orange-200">
              {location.pathname}
            </code>{" "}
            doesn't exist.
          </p>
          <p className="text-white/70 mb-8">
            You might have mistyped the URL or the page may have been moved.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-white text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-all hover:scale-105 shadow-lg"
            >
              🏠 Go Home
            </Link>
            <Link
              to="/restaurants"
              className="flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-orange-500 transition-all hover:scale-105"
            >
              🍕 Browse Restaurants
            </Link>
          </div>

          {/* Additional Quick Links */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-white/60 text-sm mb-4">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link
                to="/dashboard"
                className="text-white/80 hover:text-white underline"
              >
                Dashboard
              </Link>
              <Link
                to="/food"
                className="text-white/80 hover:text-white underline"
              >
                Food
              </Link>
              <Link
                to="/orders"
                className="text-white/80 hover:text-white underline"
              >
                Orders
              </Link>
              <Link
                to="/profile"
                className="text-white/80 hover:text-white underline"
              >
                Profile
              </Link>
              <Link
                to="/admin-portal"
                className="text-white/80 hover:text-white underline"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
