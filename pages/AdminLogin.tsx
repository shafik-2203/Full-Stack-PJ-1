import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, KeyIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the standard login endpoint (admin users are handled in backend)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin token and user info
        if (data.token) {
          localStorage.setItem("fastio_token", data.token);
          sessionStorage.setItem("adminAuth", data.token);
          sessionStorage.setItem("adminUser", JSON.stringify(data.user));
        }

        // Show success animation before redirect
        setIsAnimating(true);
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 flex items-center justify-center px-4 py-8">
      <div
        className={`max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8 transition-all duration-1000 ${isAnimating ? "animate-fade-in" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-white animate-bounce-gentle" />
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-white animate-slide-up">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 animate-fade-in">
            Secure access for authorized personnel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full p-4 border-2 border-white/30 rounded-2xl bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-white/50 focus:border-white transition-all"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full p-4 border-2 border-white/30 rounded-2xl bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-white/50 focus:border-white transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-100/90 border-2 border-red-300 text-red-700 rounded-2xl backdrop-blur-sm animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border-2 border-transparent rounded-2xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-white/50 disabled:opacity-50 transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Sign in as Admin"
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                className="flex items-center justify-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
              >
                <KeyIcon className="w-4 h-4" />
                Forgot Password?
              </button>
            </div>

            {showForgotPassword && (
              <div className="bg-white/20 rounded-2xl p-4 animate-fade-in">
                <p className="text-white text-sm text-center">
                  Please contact your system administrator for password reset
                  assistance.
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/admin-portal"
                className="flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
