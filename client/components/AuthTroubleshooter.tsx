import React, { useState } from "react";

interface AuthTroubleshooterProps {
  onClose: () => void;
  onResolved: (credentials: any) => void;
}

export default function AuthTroubleshooter({
  onClose,
  onResolved,
}: AuthTroubleshooterProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResetAuth = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(
        "/api/debug/reset-auth/mohamedshafik2526@gmail.com",
      );
      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTimeout(() => {
          onResolved(data.credentials);
        }, 3000);
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-800">
              Authentication Issue
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            We detected authentication conflicts. This can happen due to:
          </p>

          <ul className="text-gray-600 text-sm space-y-1 ml-4">
            <li>• Multiple account creation attempts</li>
            <li>• Password mismatches</li>
            <li>• Database inconsistencies</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Fix</h4>
            <p className="text-blue-700 text-sm mb-3">
              Reset your account to clean credentials that you can use
              immediately.
            </p>

            <button
              onClick={handleResetAuth}
              disabled={isResetting}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Resetting Account...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reset My Account
                </>
              )}
            </button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {result.success ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Account Reset Successfully!
                    </span>
                  </div>
                  <div className="text-green-700 text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> {result.credentials.email}
                    </p>
                    <p>
                      <strong>Username:</strong> {result.credentials.username}
                    </p>
                    <p>
                      <strong>Password:</strong> {result.credentials.password}
                    </p>
                  </div>
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    You can now login with these credentials!
                  </p>
                </div>
              ) : (
                <div className="text-red-700">
                  <strong>Error:</strong> {result.error || result.message}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}