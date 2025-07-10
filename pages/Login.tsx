import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api";
import { AuthConflictResolver } from "../utils/authConflictResolver";
import AuthTroubleshooter from "../components/AuthTroubleshooter";
import Logo from "../components/Logo";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "mohamedshafik2526@gmail.com",
    password: "Shafik1212@",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.user && response.token) {
        // Update API client token
        apiClient.setToken(response.token);
        // Update auth context
        login(response.user, response.token);
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";

      // Handle specific error cases with intelligent resolution
      if (errorMessage.includes("Account not found")) {
        setError("Checking account details...");

        try {
          const resolution = await AuthConflictResolver.handleLoginNotFound(
            formData.email,
          );

          setError(resolution.message);

          if (resolution.action === "suggest_alternatives") {
            // Show suggestions but don't auto-redirect
          } else if (resolution.action === "suggest_signup") {
            setTimeout(() => navigate("/signup"), 3000);
          }
        } catch (resolutionError) {
          setError(
            "Account not found. Please check your credentials or sign up.",
          );
          setTimeout(() => navigate("/signup"), 2000);
        }
      } else if (errorMessage.includes("verify your account")) {
        setError("Please verify your account. Check your email for OTP.");
        setTimeout(() => navigate("/otp"), 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(255, 109, 0), rgb(255, 165, 0), rgb(240, 156, 4))",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size={60} className="sm:hidden" />
        <Logo size={80} className="hidden sm:block" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-orange-200 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-3xl"></div>

            <form onSubmit={handleSubmit} className="relative space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl text-center">
                  <div>{error}</div>
                  {(error.includes("Invalid") ||
                    error.includes("not found")) && (
                    <button
                      onClick={() => setShowTroubleshooter(true)}
                      className="mt-2 text-sm underline hover:no-underline text-red-200"
                    >
                      🔧 Fix Authentication Issues
                    </button>
                  )}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Email Address <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-500"
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
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-300 border-2 border-white/30"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Password <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-orange-300"
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-14 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-300 border-2 border-white/30"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      disabled={isLoading}
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

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-orange-200 hover:text-white transition-colors duration-200 text-sm font-medium underline decoration-orange-300"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                Back to Home
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-orange-200 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Auth Troubleshooter */}
      {showTroubleshooter && (
        <AuthTroubleshooter
          onClose={() => setShowTroubleshooter(false)}
          onResolved={(credentials) => {
            setShowTroubleshooter(false);
            setFormData({
              email: credentials.email,
              password: credentials.password,
            });
            setError("");
            alert(
              `Account reset! Use:\nEmail: ${credentials.email}\nPassword: ${credentials.password}`,
            );
          }}
        />
      )}
    </div>
  );
}
