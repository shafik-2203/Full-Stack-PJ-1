import { useState } from "react";
import { User, CartItem, ApiClient, Restaurant, Order } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";
import DemoCredentials from "@/components/DemoCredentials";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      console.error("Login error details:", error);

      // Show user-friendly error messages
      if (errorMessage.includes("Network error")) {
        toast.error(
          "Unable to connect to server. Please check your internet connection and try again.",
        );
      } else if (errorMessage.includes("Development Mode")) {
        toast.success(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <BackButton to="/" variant="light" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-primary-100">Sign in to your FASTIO account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
          <DemoCredentials />
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input w-full transform transition-all duration-300 focus:scale-105 focus:shadow-lg"
                placeholder="Enter your email or username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full pr-10 transform transition-all duration-300 focus:scale-105 focus:shadow-lg"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {isLoading ? (
                <span className="loading-dots">Signing In</span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div
            className="mt-4 text-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-all duration-200 hover:underline hover:scale-105 transform"
            >
              🔑 Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
