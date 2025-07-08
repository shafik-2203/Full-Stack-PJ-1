import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

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
      // Use the API client for consistency
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Store admin token and user info
        if (data.token) {
          localStorage.setItem("fastio_token", data.token);
          sessionStorage.setItem("adminAuth", data.token);
          sessionStorage.setItem("adminUser", JSON.stringify(data.user));
          apiClient.setToken(data.token);
        }
        toast.success("Admin login successful!");
        navigate("/admin");
      } else {
        toast.error(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      toast.error("Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Access restricted to authorized personnel only
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
                className="input w-full"
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
                className="input w-full"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50"
            >
              {loading ? (
                <span className="loading-dots">Authenticating</span>
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
