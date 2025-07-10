import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { apiClient } from "../lib/api";
import { AuthConflictResolver } from "../utils/authConflictResolver";

// Password validation function
const validatePassword = (
  password: string,
): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (@$!%*?&)",
    };
  }
  return { isValid: true, message: "" };
};

// Phone number validation function
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(formData.mobile)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsLoading(true);
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.mobile
    ) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 Starting signup process...");
      const response = await apiClient.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      });

      console.log("✅ Signup response received:", response);

      if (response && response.success) {
        console.log("��� Signup successful, navigating to OTP verification");
        localStorage.setItem("otp_email", formData.email);
        navigate("/otp");
      } else {
        console.error("❌ Signup failed with response:", response);
        setError(response?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("🚨 Signup error caught:", err);

      let errorMessage = "Signup failed. Please try again.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Handle specific error cases
      if (errorMessage.includes("already exists")) {
        setError(
          "An account with these details already exists. Please try logging in instead.",
        );
        setTimeout(() => navigate("/login"), 3000);
      } else if (errorMessage.includes("Network error")) {
        setError(
          "Network connection issue. Please check your internet and try again.",
        );
      } else if (errorMessage.includes("Invalid JSON")) {
        setError("Server communication error. Please try again.");
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
        <div className="absolute top-32 left-16 w-80 h-80 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-60 right-24 w-96 h-96 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-32 left-32 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <Logo size={60} className="sm:hidden" />
        <Logo size={80} className="hidden sm:block" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
              Join FASTIO
            </h1>
            <p className="text-orange-200 text-lg">
              Create your account and start ordering
            </p>
          </div>

          {/* Signup Card */}
          <div className="bg-gradient-to-br from-amber-300/30 to-amber-200/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-amber-400/10 rounded-3xl"></div>

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl text-center text-sm">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Username <span className="text-orange-400">*</span>
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Create your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-300 border-2 border-white/30"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Email Address <span className="text-orange-400">*</span>
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
                      className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 shadow-lg transition-all duration-300 border-2 border-white/30"
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-300 hover:text-white transition-colors duration-200"
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
                  <p className="text-emerald-300 text-xs mt-1">
                    8+ characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>

                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Confirm Password <span className="text-orange-400">*</span>
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-300 hover:text-white transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
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

                <div className="group">
                  <label className="block text-white/90 font-medium mb-2 text-sm">
                    Mobile Number <span className="text-orange-400">*</span>
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
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

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-orange-200 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
