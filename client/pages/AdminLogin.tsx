import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the new admin login endpoint
      const response = await fetch("/api/auth/admin-login", {
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
        navigate("/admin");
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Access restricted to authorized personnel only
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                placeholder="Admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign in as Admin"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
