import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, KeyIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("fastio121299@gmail.com");
  const [password, setPassword] = useState("fastio1212");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Retry logic for network issues
    const attemptLogin = async (retryCount = 0): Promise<any> => {
      try {
        const response = await apiClient.login({ email, password });
        return response;
      } catch (err) {
        console.error(`Admin login attempt ${retryCount + 1} failed:`, err);

        // Retry on network errors
        const isNetworkError =
          err instanceof Error &&
          (err.message.includes("Network Error") ||
            err.message.includes("Cannot connect to server") ||
            err.message.includes("fetch"));

        if (isNetworkError && retryCount < 2) {
          console.log(`Retrying admin login... (attempt ${retryCount + 2})`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          return attemptLogin(retryCount + 1);
        }
        throw err;
      }
    };

    try {
      const response = await attemptLogin();

      if (response.success && response.user && response.token) {
        // Check if user is admin
        if (
          !response.user.isAdmin &&
          response.user.role !== "admin" &&
          response.user.role !== "super_admin"
        ) {
          setError("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }

        // Store admin token and user info
        localStorage.setItem("fastio_token", response.token);
        sessionStorage.setItem("adminAuth", response.token);
        sessionStorage.setItem("adminUser", JSON.stringify(response.user));
        apiClient.setToken(response.token);

        // Show success animation before redirect
        setIsAnimating(true);
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError(response.message || "Admin login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Admin login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-12 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-48 right-16 w-80 h-80 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-24 left-24 w-88 h-88 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Security Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Admin Access
            </h1>
            <p className="text-gray-400 text-lg">
              Secure authentication for administrators
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

            <form onSubmit={handleSubmit} className="relative space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl text-center">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Admin Email <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Password <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 pl-12 pr-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-200">
                    This is a secure admin area. All access attempts are logged
                    and monitored.
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Access Admin Panel</span>
                  </div>
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <KeyIcon className="w-4 h-4" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              {showForgotPassword && (
                <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-4">
                  <p className="text-yellow-200 text-sm text-center">
                    Please contact your system administrator for password reset
                    assistance.
                    <br />
                    <span className="text-yellow-300 font-medium">
                      support@fastio.com
                    </span>
                  </p>
                </div>
              )}

              {/* Back Button */}
              <div className="text-center pt-4">
                <Link
                  to="/admin-portal"
                  className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Admin Portal</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
