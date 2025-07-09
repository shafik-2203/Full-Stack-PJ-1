import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/api";
import { AuthConflictResolver } from "../utils/authConflictResolver";
import AuthTroubleshooter from "../components/AuthTroubleshooter";
import Logo from "../components/Logo";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    <div className="min-h-screen bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 relative overflow-x-hidden">
      {/* Logo */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-5 z-10">
        <Logo size={80} className="sm:hidden" />
        <Logo size={130} className="hidden sm:block" />
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8 safe-area-top safe-area-bottom">
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-3xl sm:rounded-[50px] p-8 sm:p-12 lg:p-16 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 sm:space-y-8 lg:space-y-11"
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white text-center">
              Login
            </h1>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <div>{error}</div>
                {(error.includes("Invalid") || error.includes("not found")) && (
                  <button
                    onClick={() => setShowTroubleshooter(true)}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    🔧 Fix Authentication Issues
                  </button>
                )}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-7">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-14 sm:h-16 lg:h-20 px-4 sm:px-6 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-base sm:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter the Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full h-14 sm:h-16 lg:h-20 px-4 sm:px-6 pr-12 sm:pr-14 bg-white rounded-lg sm:rounded-xl border-2 border-white/30 text-base sm:text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-200"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
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
                      className="w-5 h-5 sm:w-6 sm:h-6"
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

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-white hover:text-orange-200 underline text-lg transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={handleBack}
                className="w-44 h-15 px-8 py-3 rounded-lg border border-orange-500 bg-white text-orange-500 font-medium text-xl transition-all hover:scale-105"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-44 h-15 px-14 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-medium text-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Submit"}
              </button>
            </div>
          </form>
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
