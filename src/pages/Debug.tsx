import { useState, useEffect } from "react";

export default function Debug() {
  const [apiStatus, setApiStatus] = useState("Testing...");
  const [healthStatus, setHealthStatus] = useState("Testing...");
  const [dbStatus, setDbStatus] = useState("Testing...");

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test API endpoint
    try {
      console.log("Testing /api/test endpoint...");
      const response = await fetch("/api/test");
      const data = await response.json();
      setApiStatus(`✅ API Working: ${data.message}`);
    } catch (error) {
      console.error("API test failed:", error);
      setApiStatus(`❌ API Error: ${error.message}`);
    }

    // Test health endpoint
    try {
      console.log("Testing /health endpoint...");
      const response = await fetch("/health");
      const data = await response.json();
      setHealthStatus(`✅ Health: ${data.status} - ${data.database}`);
    } catch (error) {
      console.error("Health test failed:", error);
      setHealthStatus(`❌ Health Error: ${error.message}`);
    }

    // Test database through auth endpoint
    try {
      console.log("Testing database connection via API...");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "test",
          email: "test@test.com",
          password: "Test1234@",
          mobile: "1234567890",
        }),
      });
      const data = await response.json();
      setDbStatus(
        `✅ DB Test: Response received - ${data.success ? "Success" : data.message}`,
      );
    } catch (error) {
      console.error("DB test failed:", error);
      setDbStatus(`❌ DB Error: ${error.message}`);
    }
  };

  const handleRetry = () => {
    setApiStatus("Testing...");
    setHealthStatus("Testing...");
    setDbStatus("Testing...");
    testConnections();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          FASTIO Debug Panel
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Connection Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">API Test Endpoint:</span>
                <span
                  className={
                    apiStatus.includes("✅") ? "text-green-600" : "text-red-600"
                  }
                >
                  {apiStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Health Check:</span>
                <span
                  className={
                    healthStatus.includes("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {healthStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">Database Connection:</span>
                <span
                  className={
                    dbStatus.includes("✅") ? "text-green-600" : "text-red-600"
                  }
                >
                  {dbStatus}
                </span>
              </div>
            </div>

            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Retry Tests
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Environment Info
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Base URL:</strong> {window.location.origin}
              </div>
              <div>
                <strong>API Base:</strong> /api
              </div>
              <div>
                <strong>User Agent:</strong> {navigator.userAgent}
              </div>
              <div>
                <strong>Network:</strong>{" "}
                {navigator.onLine ? "Online" : "Offline"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <a
                href="/"
                className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center"
              >
                Go to Home
              </a>
              <a
                href="/signup"
                className="block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-center"
              >
                Test Signup
              </a>
              <a
                href="/login"
                className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center"
              >
                Test Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
