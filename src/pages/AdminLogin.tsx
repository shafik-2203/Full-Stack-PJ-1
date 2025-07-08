import { useState } from "react";
import { User, CartItem, ApiClient, Restaurant, Order } from "@/lib/types";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import BackButton from "@/components/BackButton";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Local admin authentication
      const adminCredentials = {
        email: "fastio121299@gmail.com",
        password: "fastio1212",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        email === adminCredentials.email &&
        password === adminCredentials.password
      ) {
        const adminUser = {
          id: "admin_1",
          username: "FastioAdmin",
          email: adminCredentials.email,
          role: "admin",
          isVerified: true,
        };

        const token = `admin_token_${Date.now()}`;

        // Store admin authentication
        localStorage.setItem("fastio_token", token);
        sessionStorage.setItem("adminAuth", token);
        sessionStorage.setItem("adminUser", JSON.stringify(adminUser));
        apiClient.setToken(token);

        toast.success("🎉 Admin login successful!");
        navigate("/admin");
      } else {
        toast.error(
          "Invalid admin credentials. Please check email and password.",
        );
      }
    } catch (err) {
      toast.error("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80">
            Access restricted to authorized personnel only
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full transform transition-all duration-300 focus:scale-105 focus:shadow-lg"
                placeholder="Enter admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input w-full transform transition-all duration-300 focus:scale-105 focus:shadow-lg"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {loading ? (
                <span className="loading-dots">🔐 Authenticating...</span>
              ) : (
                "Sign in as Admin"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <BackButton to="/admin-portal" label="Back to Admin Portal" />
          </div>
        </div>
      </div>
    </div>
  );
}
